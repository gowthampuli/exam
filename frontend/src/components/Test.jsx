// // frontend/src/components/Test.js
// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function Test() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const email = location.state?.email;

//   const [isLoading, setIsLoading] = useState(true);
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
//   const [tabSwitchCount, setTabSwitchCount] = useState(0);
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [showWarningModal, setShowWarningModal] = useState(false);
//   const [warningMessage, setWarningMessage] = useState('');

//   useEffect(() => {
//     if (!email) {
//       navigate('/');
//       return;
//     }
//     setIsLoading(true);
//     axios
//       .get(`http://localhost:5000/api/candidates/questions/${email}`)
//       .then((res) => {
//         if (res.data.message) {
//           setErrorMessage(res.data.message);
//           setShowErrorModal(true);
//         } else {
//           setQuestions(res.data.questions);
//           setAnswers(new Array(res.data.questions.length).fill(''));
//         }
//       })
//       .catch(() => {
//         setErrorMessage("Error fetching questions");
//         setShowErrorModal(true);
//       })
//       .finally(() => setIsLoading(false));
//   }, [email, navigate]);

//   // Timer countdown
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           handleSubmit();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Tab switching detection
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setTabSwitchCount((prev) => {
//           const newCount = prev + 1;
//           if (newCount < 2) {
//             setWarningMessage(`Warning: Tab switching is not allowed. You have ${2 - newCount} chance left.If u do tabswitching again the test will be automaiclly submited`);
//             setShowWarningModal(true);
//           } else {
//             handleSubmit();
//           }
//           return newCount;
//         });
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, []);

//   const handleAnswerChange = (index, value) => {
//     const newAnswers = [...answers];
//     newAnswers[index] = value;
//     setAnswers(newAnswers);
//   };

//   const handleSubmit = async () => {
//     try {
//       await axios.post('/api/candidates/submit', { email, answers });
//       navigate('/test-completed');
//     } catch (err) {
//       setErrorMessage("Error submitting test");
//       setShowErrorModal(true);
//     }
//   };

//   const formatTime = (seconds) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}:${s < 10 ? '0' : ''}${s}`;
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
//       <div className="max-w-3xl w-full bg-white p-6 rounded shadow">
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
//           <h2 className="text-xl font-bold mb-2 sm:mb-0">Test</h2>
//           <span className="text-red-500 font-bold">Time Left: {formatTime(timeLeft)}</span>
//         </div>
//         {questions.map((q, index) => (
//           <div key={index} className="mb-4">
//             <p className="font-medium">{index + 1}. {q.question}</p>
//             <div className="mt-2">
//               {q.options.map((option, idx) => (
//                 <label key={idx} className="block">
//                   <input 
//                     type="radio" 
//                     name={`question-${index}`} 
//                     value={option} 
//                     checked={answers[index] === option}
//                     onChange={() => handleAnswerChange(index, option)}
//                     className="mr-2"
//                   />
//                   {option}
//                 </label>
//               ))}
//             </div>
//           </div>
//         ))}
//         <button 
//           onClick={handleSubmit} 
//           className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
//         >
//           Submit Test
//         </button>
//       </div>

//       {/* Error Modal */}
//       {showErrorModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
//             <h2 className="text-xl font-bold mb-4 text-center">Error</h2>
//             <p className="mb-6 text-center">{errorMessage}</p>
//             <button 
//               onClick={() => {
//                 setShowErrorModal(false);
//                 navigate('/');
//               }} 
//               className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Warning Modal */}
//       {showWarningModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
//             <h2 className="text-xl font-bold mb-4 text-center">Warning</h2>
//             <p className="mb-6 text-center">{warningMessage}</p>
//             <button 
//               onClick={() => setShowWarningModal(false)} 
//               className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Test;

// frontend/src/components/Test.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Test() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  // Create a ref to always have the latest answers
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/');
      return;
    }
    setIsLoading(true);
    axios
      .get(`http://localhost:5000/api/candidates/questions/${email}`)
      .then((res) => {
        if (res.data.message) {
          setErrorMessage(res.data.message);
          setShowErrorModal(true);
        } else {
          setQuestions(res.data.questions);
          const initialAnswers = new Array(res.data.questions.length).fill('');
          setAnswers(initialAnswers);
          answersRef.current = initialAnswers;
        }
      })
      .catch(() => {
        setErrorMessage("Error fetching questions");
        setShowErrorModal(true);
      })
      .finally(() => setIsLoading(false));
  }, [email, navigate]);

  // Timer countdown effect with auto-submission
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit(); // auto-submit when time reaches 0
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tab switching detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount < 2) {
            setWarningMessage(
              `Warning: Tab switching is not allowed. You have ${2 - newCount} chance left. If you switch again, the test will be automatically submitted.`
            );
            setShowWarningModal(true);
          } else {
            handleSubmit(); // auto-submit on second tab switch
          }
          return newCount;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      // Use answersRef.current to send the latest answers
      await axios.post('http://localhost:5000/api/candidates/submit', { email, answers: answersRef.current });
      navigate('/test-completed');
    } catch (err) {
      setErrorMessage("Error submitting test");
      setShowErrorModal(true);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white p-6 rounded shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-bold mb-2 sm:mb-0">Test</h2>
          <span className="text-red-500 font-bold">Time Left: {formatTime(timeLeft)}</span>
        </div>
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <p className="font-medium">{index + 1}. {q.question}</p>
            <div className="mt-2">
              {q.options.map((option, idx) => (
                <label key={idx} className="block">
                  <input 
                    type="radio" 
                    name={`question-${index}`} 
                    value={option} 
                    checked={answers[index] === option}
                    onChange={() => handleAnswerChange(index, option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button 
          onClick={handleSubmit} 
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Submit Test
        </button>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Error</h2>
            <p className="mb-6 text-center">{errorMessage}</p>
            <button 
              onClick={() => {
                setShowErrorModal(false);
                navigate('/');
              }} 
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Warning</h2>
            <p className="mb-6 text-center">{warningMessage}</p>
            <button 
              onClick={() => setShowWarningModal(false)} 
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Test;




