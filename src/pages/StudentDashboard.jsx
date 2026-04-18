import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { HiCheckCircle, HiBookOpen, HiClock } from 'react-icons/hi';
import { HiTrophy } from 'react-icons/hi2';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [attendanceCode, setAttendanceCode] = useState('');
  const [myAttendance, setMyAttendance] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [testAttempt, setTestAttempt] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchAttendance();
    fetchActiveTest();
    fetchNotes();
  }, []);

  const fetchAttendance = async () => {
    const { data } = await axios.get('/attendance/my');
    setMyAttendance(data.records);
  };

  const fetchActiveTest = async () => {
    try {
      const { data } = await axios.get('/tests/active');
      setActiveTest(data.test);
      if (data.test) {
        const attemptRes = await axios.get(`/tests/${data.test._id}/attempt`);
        setTestAttempt(attemptRes.data.attempt);
        const lbRes = await axios.get(`/tests/${data.test._id}/leaderboard`);
        setLeaderboard(lbRes.data.leaderboard);
      }
    } catch (error) {
      // No active test
    }
  };

  const fetchNotes = async () => {
    const { data } = await axios.get('/notes');
    setNotes(data.notes);
  };

  const markAttendance = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/attendance/mark', { code: attendanceCode });
      toast.success('Attendance marked');
      setAttendanceCode('');
      fetchAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid code');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        {['profile', 'attendance', 'test', 'notes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeTab === tab ? 'bg-purple-700 text-white' : 'bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
          <div className="space-y-3">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Class:</strong> {user.class}</p>
            <p><strong>Target Exam:</strong> {user.targetExam}</p>
            <p><strong>Mobile:</strong> {user.mobile}</p>
            <p><strong>Fees Status:</strong> {user.feesPaid ? 'Paid' : 'Pending'}</p>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow max-w-md">
            <h3 className="text-xl font-semibold mb-4">Mark Attendance</h3>
            <form onSubmit={markAttendance} className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter code"
                className="flex-1 p-2 border rounded"
                value={attendanceCode}
                onChange={(e) => setAttendanceCode(e.target.value)}
              />
              <button type="submit" className="btn-primary">Submit</button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <h3 className="text-xl font-semibold p-6 pb-2">My Attendance</h3>
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {myAttendance.map((rec) => (
                  <tr key={rec._id} className="border-t">
                    <td className="px-6 py-3">{new Date(rec.date).toLocaleString()}</td>
                    <td className="px-6 py-3 text-green-600"><HiCheckCircle className="inline" /> Present</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'test' && (
        <div className="space-y-6">
          {activeTest ? (
            testAttempt ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Test Completed</h3>
                <p>Your Score: {testAttempt.score} / {testAttempt.totalQuestions}</p>
                <p>Submitted: {new Date(testAttempt.submittedAt).toLocaleString()}</p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">{activeTest.title}</h3>
                <p className="mb-4">{activeTest.description}</p>
                <p className="mb-4">Duration: {activeTest.duration} minutes</p>
                <Link to={`/test/${activeTest._id}`} className="btn-primary inline-block">
                  Start Test
                </Link>
              </div>
            )
          ) : (
            <p className="text-gray-600">No active test at the moment.</p>
          )}
          {leaderboard.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <HiTrophy className="text-yellow-500 mr-2" /> Leaderboard
              </h3>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Rank</th>
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, idx) => (
                    <tr key={entry._id} className="border-b">
                      <td className="py-2">{idx + 1}</td>
                      <td className="py-2">{entry.student?.name}</td>
                      <td className="py-2">{entry.score} / {entry.totalQuestions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <h3 className="text-xl font-semibold p-6 pb-2">Study Notes</h3>
          {user.feesPaid ? (
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Download</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note._id} className="border-t">
                    <td className="px-6 py-3">{note.title}</td>
                    <td className="px-6 py-3">{note.fileType}</td>
                    <td className="px-6 py-3">
                      <a href={note.fileUrl} target="_blank" rel="noreferrer" className="text-purple-700">
                        View/Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center">
              <HiBookOpen className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">Notes are locked. Please pay fees to access.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;