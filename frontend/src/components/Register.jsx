// frontend/src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Use dynamic API URL from Vite environment variables (VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Register() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('candidate'); // 'candidate' or 'hr'
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', pan: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleCandidateSubmit = async (e) => {
    e.preventDefault();

    // Validate PAN and phone
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (!panRegex.test(formData.pan)) {
      setErrorMessage("Invalid PAN format. (e.g., ABCDE1234F)");
      return;
    }
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage("Invalid phone number format. (10 digits required)");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/candidates/register`, formData);
      // On successful registration, navigate to the test page.
      navigate('/test', { state: { email: formData.email } });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Error registering candidate");
    }
  };

  const handleHRLogin = (e) => {
    e.preventDefault();
    if (loginData.email === 'hr@centillion.com' && loginData.password === 'cent@1234') {
      navigate('/dashboard');
    } else {
      setErrorMessage("Invalid HR credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {/* Tabs */}
        <div className="flex mb-4 border-b">
          <button 
            onClick={() => { setActiveTab('candidate'); setErrorMessage(''); }}
            className={`flex-1 p-2 text-center ${activeTab === 'candidate' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
          >
            Candidate
          </button>
          <button 
            onClick={() => { setActiveTab('hr'); setErrorMessage(''); }}
            className={`flex-1 p-2 text-center ${activeTab === 'hr' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
          >
            HR Login
          </button>
        </div>

        {activeTab === 'candidate' ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">Candidate Registration</h1>
            <p className="text-sm text-gray-600 mb-4">
              Test duration: 20 minutes. Tab switching is prevented.
            </p>
            {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
            <form onSubmit={handleCandidateSubmit}>
              <input 
                type="text" 
                name="name" 
                placeholder="Name" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required 
                className="w-full p-2 mb-2 border rounded"
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required 
                className="w-full p-2 mb-2 border rounded"
              />
              <input 
                type="text" 
                name="phone" 
                placeholder="Phone" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required 
                className="w-full p-2 mb-2 border rounded"
              />
              <input 
                type="text" 
                name="pan" 
                placeholder="PAN Number" 
                value={formData.pan} 
                onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                required 
                className="w-full p-2 mb-4 border rounded"
              />
              <button 
                type="submit" 
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Start Test
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">HR Login</h1>
            {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
            <form onSubmit={handleHRLogin}>
              <input 
                type="email" 
                name="email" 
                placeholder="HR Email" 
                value={loginData.email} 
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required 
                className="w-full p-2 mb-2 border rounded"
              />
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={loginData.password} 
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required 
                className="w-full p-2 mb-4 border rounded"
              />
              <button 
                type="submit" 
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
