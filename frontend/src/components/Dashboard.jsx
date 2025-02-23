// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTrash } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch candidates using Axios
  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/candidates?search=${search}`);
      setCandidates(res.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, [search]);

  // Sort candidates:
  // - Candidates with nonzero scores are sorted in descending order (highest first)
  // - Candidates with a score of 0 are pushed to the bottom.
  const sortedCandidates = [...candidates].sort((a, b) => {
    if (a.testScore === 0 && b.testScore !== 0) return 1;
    if (b.testScore === 0 && a.testScore !== 0) return -1;
    return b.testScore - a.testScore;
  });

  // Compute counts for selected and rejected candidates
  const selectedCount = candidates.filter(c => c.status === 'selected').length;
  const rejectedCount = candidates.filter(c => c.status === 'rejected').length;

  // Bulk delete all candidates with loader
  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await axios.delete('http://localhost:5000/api/candidates');
      fetchCandidates();
      setShowDeleteAllModal(false);
    } catch (error) {
      console.error("Error deleting all candidates:", error);
    }
    setIsDeleting(false);
  };

  // Set candidate to delete (for individual deletion)
  const confirmDeleteCandidate = (id) => {
    setCandidateToDelete(id);
  };

  // Delete an individual candidate with loader
  const deleteCandidate = async () => {
    if (!candidateToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/candidates/${candidateToDelete}`);
      fetchCandidates();
      setCandidateToDelete(null);
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
    setIsDeleting(false);
  };

  // Pagination calculations using sortedCandidates
  const indexOfLastCandidate = currentPage * itemsPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - itemsPerPage;
  const currentCandidates = sortedCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalPages = Math.ceil(sortedCandidates.length / itemsPerPage);

  const renderPaginationNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 rounded transition-all duration-200 ${
            currentPage === i
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-800 hover:bg-blue-100'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["S/N", "Name", "Email", "Phone", "PAN", "Test Set", "Score", "Status"];
    const tableRows = [];
    sortedCandidates.forEach((candidate, index) => {
      const candidateData = [
        index + 1,
        candidate.name,
        candidate.email,
        candidate.phone,
        candidate.pan,
        candidate.testSet,
        candidate.testScore,
        candidate.status,
      ];
      tableRows.push(candidateData);
    });
    doc.text("Candidate Report", 14, 15);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        overflow: 'line',   // Prevent line breaking (all text in one line)
        cellWidth: 'auto'   // Allow cell width to expand automatically
      },
      // Optionally, set a column style if you want to override a specific column:
      columnStyles: {
        // For example, force the first column to have auto width:
        0: { cellWidth: 'auto' }
      }
    });
    doc.save("candidate_report.pdf");
  };
  

  // Download candidate data as Excel using SheetJS and file-saver
  const downloadExcel = () => {
    const formattedData = sortedCandidates.map((candidate, index) => ({
      "S/N": index + 1,
      "Name": candidate.name,
      "Email": candidate.email,
      "Phone": candidate.phone,
      "PAN": candidate.pan,
      "Test Set": candidate.testSet,
      "Score": candidate.testScore,
      "Status": candidate.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "candidate_report.xlsx");
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-4 md:mb-0">Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search by name,or phone,pan"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
            />
            <button
              onClick={() => setShowDeleteAllModal(true)}
              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete All
            </button>
            <button
              onClick={downloadPDF}
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={downloadExcel}
              className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Download Excel
            </button>
          </div>
        </div>

        {/* Candidate counts */}
        <div className="flex flex-col sm:flex-row justify-around bg-blue-50 p-4 rounded mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{selectedCount}</p>
            <p className="text-sm text-gray-600">Selected</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-700">{rejectedCount}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-2xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['S/N', 'Name', 'Email', 'Phone', 'PAN', 'Test Set', 'Score', 'Status', 'Actions'].map(header => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCandidates.map((candidate, index) => (
                  <tr
                    key={candidate._id}
                    className="transition-colors duration-150 hover:bg-blue-50 odd:bg-white even:bg-gray-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {indexOfFirstCandidate + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{candidate.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{candidate.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{candidate.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-mono">{candidate.pan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{candidate.testSet}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold">{candidate.testScore}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${candidate.status === 'selected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setCandidateToDelete(candidate._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {candidates.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                No candidates found
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-1 rounded transition-all duration-200 ${currentPage === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Previous
          </button>
          {renderPaginationNumbers()}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 mx-1 rounded transition-all duration-200 ${currentPage === totalPages ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Individual Delete Modal */}
      {candidateToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Confirm Candidate Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this candidate?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setCandidateToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteCandidate}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center"
              >
                {isDeleting && (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Confirm Bulk Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete all candidate data? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center"
              >
                {isDeleting && (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                )}
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
