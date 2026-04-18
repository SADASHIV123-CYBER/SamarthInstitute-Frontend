import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const TestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchTest();
  }, [id]);

  const fetchTest = async () => {
    try {
      const { data } = await axios.get('/api/tests/active');
      if (!data.test || data.test._id !== id) {
        toast.error('Test not available');
        navigate('/dashboard');
        return;
      }
      setTest(data.test);
      setAnswers(new Array(data.test.questions.length).fill(null));
      const endTime = new Date(data.test.endTime).getTime();
      setTimeLeft(Math.max(0, Math.floor((endTime - Date.now()) / 1000)));
    } catch (error) {
      toast.error('Failed to load test');
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleAutoSubmit = async () => {
    if (submitted) return;
    toast.error('Time is up! Submitting...');
    await submitTest();
  };

  const handleAnswerSelect = (qIndex, optIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optIndex;
    setAnswers(newAnswers);
  };

  const submitTest = async () => {
    try {
      const timeTaken = test.duration * 60 - timeLeft;
      const { data } = await axios.post('/api/tests/submit', {
        testId: test._id,
        answers,
        timeTaken,
      });
      setSubmitted(true);
      toast.success(`Test submitted! Score: ${data.result.score}/${test.questions.length}`);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error) {
      toast.error('Submission failed');
    }
  };

  if (!test) return <div className="text-center py-12">Loading...</div>;

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Test Submitted</h2>
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="sticky top-16 bg-white p-4 shadow-md rounded-lg mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{test.title}</h1>
        <div className="text-xl font-mono bg-purple-100 px-4 py-2 rounded">
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>
      <div className="space-y-6">
        {test.questions.map((q, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow">
            <p className="font-semibold mb-3">
              {idx + 1}. {q.questionText}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => (
                <label key={optIdx} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value={optIdx}
                    checked={answers[idx] === optIdx}
                    onChange={() => handleAnswerSelect(idx, optIdx)}
                    className="text-purple-700"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button onClick={submitTest} className="btn-primary px-8 py-3 text-lg">
          Submit Test
        </button>
      </div>
    </div>
  );
};

export default TestPage;