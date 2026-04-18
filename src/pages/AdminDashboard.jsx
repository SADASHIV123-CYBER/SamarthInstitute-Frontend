import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  HiUsers,
  HiCode,
  HiDocumentText,
  HiAcademicCap,
  HiClock,
  HiUpload,
} from 'react-icons/hi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [leads, setLeads] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceCode, setAttendanceCode] = useState(null);
  const [tests, setTests] = useState([]);
  const [notes, setNotes] = useState([]);
  const [file, setFile] = useState(null);

  const [testForm, setTestForm] = useState({
    title: '',
    description: '',
    duration: 30,
    questions: [{ questionText: '', options: ['', '', '', ''], correctOption: 0 }],
  });

  useEffect(() => {
    fetchLeads();
    fetchStudents();
    fetchAttendance();
    fetchTests();
    fetchNotes();
  }, []);

  const fetchLeads = async () => {
    const { data } = await axios.get('/api/leads');
    setLeads(data.leads);
  };

  const fetchStudents = async () => {
    const { data } = await axios.get('/api/users/students');
    setStudents(data.students);
  };

  const fetchAttendance = async () => {
    const { data } = await axios.get('/api/attendance');
    setAttendanceRecords(data.records);
  };

  const fetchTests = async () => {
    // Assuming we have endpoint to get all tests (you may add)
    const { data } = await axios.get('/api/tests');
    setTests(data.tests || []);
  };

  const fetchNotes = async () => {
    const { data } = await axios.get('/api/notes');
    setNotes(data.notes);
  };

  const generateAttendanceCode = async () => {
    try {
      const { data } = await axios.post('/api/attendance/code');
      setAttendanceCode(data.code);
      toast.success(`Code generated: ${data.code.code}`);
    } catch (error) {
      toast.error('Failed to generate code');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('/api/notes', formData);
      toast.success('Notes uploaded');
      fetchNotes();
      setFile(null);
    } catch (error) {
      toast.error('Upload failed');
    }
  };

  const addQuestion = () => {
    setTestForm({
      ...testForm,
      questions: [...testForm.questions, { questionText: '', options: ['', '', '', ''], correctOption: 0 }],
    });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...testForm.questions];
    if (field === 'options') {
      updated[index].options = value;
    } else if (field === 'correctOption') {
      updated[index].correctOption = parseInt(value);
    } else {
      updated[index][field] = value;
    }
    setTestForm({ ...testForm, questions: updated });
  };

  const createTest = async () => {
    try {
      const { data } = await axios.post('/api/tests', testForm);
      toast.success('Test created');
      setTests([...tests, data.test]);
      setTestForm({
        title: '',
        description: '',
        duration: 30,
        questions: [{ questionText: '', options: ['', '', '', ''], correctOption: 0 }],
      });
    } catch (error) {
      toast.error('Failed to create test');
    }
  };

  const activateTest = async (testId) => {
    try {
      await axios.put(`/api/tests/${testId}/activate`);
      toast.success('Test activated');
      fetchTests();
    } catch (error) {
      toast.error('Activation failed');
    }
  };

  const toggleFeesPaid = async (studentId, currentStatus) => {
    try {
      await axios.put(`/api/users/students/${studentId}`, { feesPaid: !currentStatus });
      fetchStudents();
      toast.success('Fee status updated');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const chartData = {
    labels: ['Students', 'Leads', 'Attendance Today'],
    datasets: [
      {
        label: 'Count',
        data: [students.length, leads.length, attendanceRecords.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length],
        backgroundColor: '#6b21a8',
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        {['overview', 'leads', 'attendance', 'tests', 'notes', 'students'].map((tab) => (
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

      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <HiUsers className="text-4xl text-purple-700 mb-2" />
              <h3 className="text-lg font-semibold">Total Students</h3>
              <p className="text-3xl font-bold">{students.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <HiCode className="text-4xl text-purple-700 mb-2" />
              <h3 className="text-lg font-semibold">Leads</h3>
              <p className="text-3xl font-bold">{leads.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <HiClock className="text-4xl text-purple-700 mb-2" />
              <h3 className="text-lg font-semibold">Today's Attendance</h3>
              <p className="text-3xl font-bold">
                {attendanceRecords.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Statistics</h3>
            <Bar data={chartData} />
          </div>
        </motion.div>
      )}

      {activeTab === 'leads' && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Class</th>
                <th className="px-6 py-3 text-left">Target</th>
                <th className="px-6 py-3 text-left">Mobile</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="border-t">
                  <td className="px-6 py-3">{lead.name}</td>
                  <td className="px-6 py-3">{lead.class}</td>
                  <td className="px-6 py-3">{lead.targetExam}</td>
                  <td className="px-6 py-3">{lead.mobile}</td>
                  <td className="px-6 py-3">{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Generate Attendance Code</h3>
            <button onClick={generateAttendanceCode} className="btn-primary">
              Generate Code
            </button>
            {attendanceCode && (
              <div className="mt-4 p-4 bg-green-50 rounded">
                <p>Active Code: <span className="font-mono text-xl">{attendanceCode.code}</span></p>
                <p>Expires: {new Date(attendanceCode.expiresAt).toLocaleTimeString()}</p>
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <h3 className="text-xl font-semibold p-6 pb-2">Attendance Records</h3>
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Code Used</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((rec) => (
                  <tr key={rec._id} className="border-t">
                    <td className="px-6 py-3">{rec.student?.name}</td>
                    <td className="px-6 py-3">{new Date(rec.date).toLocaleString()}</td>
                    <td className="px-6 py-3">{rec.codeUsed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tests' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Create New Test</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Test Title"
                className="w-full p-2 border rounded"
                value={testForm.title}
                onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={testForm.description}
                onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                className="w-full p-2 border rounded"
                value={testForm.duration}
                onChange={(e) => setTestForm({ ...testForm, duration: e.target.value })}
              />
              <div className="space-y-4">
                {testForm.questions.map((q, idx) => (
                  <div key={idx} className="border p-4 rounded">
                    <input
                      type="text"
                      placeholder="Question"
                      className="w-full p-2 border rounded mb-2"
                      value={q.questionText}
                      onChange={(e) => updateQuestion(idx, 'questionText', e.target.value)}
                    />
                    {q.options.map((opt, optIdx) => (
                      <input
                        key={optIdx}
                        type="text"
                        placeholder={`Option ${optIdx + 1}`}
                        className="w-full p-2 border rounded mb-2"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...q.options];
                          newOpts[optIdx] = e.target.value;
                          updateQuestion(idx, 'options', newOpts);
                        }}
                      />
                    ))}
                    <select
                      className="w-full p-2 border rounded"
                      value={q.correctOption}
                      onChange={(e) => updateQuestion(idx, 'correctOption', e.target.value)}
                    >
                      {q.options.map((_, i) => (
                        <option key={i} value={i}>Option {i + 1}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <button type="button" onClick={addQuestion} className="btn-secondary">
                  Add Question
                </button>
              </div>
              <button onClick={createTest} className="btn-primary">Create Test</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <h3 className="text-xl font-semibold p-6 pb-2">Existing Tests</h3>
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test._id} className="border-t">
                    <td className="px-6 py-3">{test.title}</td>
                    <td className="px-6 py-3">{test.duration} min</td>
                    <td className="px-6 py-3">{test.isActive ? 'Active' : 'Inactive'}</td>
                    <td className="px-6 py-3">
                      {!test.isActive && (
                        <button
                          onClick={() => activateTest(test._id)}
                          className="text-purple-700 hover:underline"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Upload Notes</h3>
            <form onSubmit={handleFileUpload} className="flex items-center space-x-4">
              <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2" />
              <button type="submit" className="btn-primary">Upload</button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <h3 className="text-xl font-semibold p-6 pb-2">Uploaded Notes</h3>
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Link</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note._id} className="border-t">
                    <td className="px-6 py-3">{note.title}</td>
                    <td className="px-6 py-3">{note.fileType}</td>
                    <td className="px-6 py-3">
                      <a href={note.fileUrl} target="_blank" rel="noreferrer" className="text-purple-700">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Class</th>
                <th className="px-6 py-3">Target</th>
                <th className="px-6 py-3">Fees Paid</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-t">
                  <td className="px-6 py-3">{student.name}</td>
                  <td className="px-6 py-3">{student.email}</td>
                  <td className="px-6 py-3">{student.class}</td>
                  <td className="px-6 py-3">{student.targetExam}</td>
                  <td className="px-6 py-3">{student.feesPaid ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => toggleFeesPaid(student._id, student.feesPaid)}
                      className="text-purple-700 hover:underline"
                    >
                      Toggle Fees
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;