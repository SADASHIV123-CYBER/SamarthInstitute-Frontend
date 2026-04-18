import { useState, useEffect } from 'react';
import axios from '../services/axios';
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
  HiTrash,
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
  const [uploading, setUploading] = useState(false);

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
    try {
      const { data } = await axios.get('/leads');
      setLeads(data.leads);
    } catch (error) {
      console.error('Failed to fetch leads');
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get('/users/students');
      setStudents(data.students);
    } catch (error) {
      console.error('Failed to fetch students');
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data } = await axios.get('/attendance');
      setAttendanceRecords(data.records);
    } catch (error) {
      console.error('Failed to fetch attendance');
    }
  };

  const fetchTests = async () => {
    try {
      const { data } = await axios.get('/tests');
      setTests(data.tests || []);
    } catch (error) {
      console.error('Failed to fetch tests');
      setTests([]);
    }
  };

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get('/notes');
      setNotes(data.notes);
    } catch (error) {
      console.error('Failed to fetch notes');
    }
  };

  const generateAttendanceCode = async () => {
    try {
      const { data } = await axios.post('/attendance/code');
      setAttendanceCode(data.code);
      toast.success(`Code generated: ${data.code.code}`);
    } catch (error) {
      toast.error('Failed to generate code');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only images, PDFs, and documents are allowed.');
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/notes', formData);
      toast.success('Notes uploaded successfully');
      fetchNotes();
      setFile(null);
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const addQuestion = () => {
    setTestForm({
      ...testForm,
      questions: [...testForm.questions, { questionText: '', options: ['', '', '', ''], correctOption: 0 }],
    });
  };

  const removeQuestion = (index) => {
    const updated = testForm.questions.filter((_, i) => i !== index);
    setTestForm({ ...testForm, questions: updated });
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

  const validateTestForm = () => {
    if (!testForm.title.trim()) {
      toast.error('Test title is required');
      return false;
    }
    if (!testForm.duration || testForm.duration < 1) {
      toast.error('Duration must be at least 1 minute');
      return false;
    }
    
    for (let i = 0; i < testForm.questions.length; i++) {
      const q = testForm.questions[i];
      if (!q.questionText.trim()) {
        toast.error(`Question ${i + 1} text is required`);
        return false;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          toast.error(`Option ${j + 1} for question ${i + 1} is required`);
          return false;
        }
      }
    }
    return true;
  };

  const createTest = async () => {
    if (!validateTestForm()) return;
    
    try {
      const { data } = await axios.post('/tests', testForm);
      toast.success('Test created successfully');
      setTests([...tests, data.test]);
      // Reset form
      setTestForm({
        title: '',
        description: '',
        duration: 30,
        questions: [{ questionText: '', options: ['', '', '', ''], correctOption: 0 }],
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create test');
    }
  };

  const activateTest = async (testId) => {
    try {
      await axios.put(`/tests/${testId}/activate`);
      toast.success('Test activated');
      fetchTests();
    } catch (error) {
      toast.error('Activation failed');
    }
  };

  const toggleFeesPaid = async (studentId, currentStatus) => {
    try {
      await axios.put(`/users/students/${studentId}`, { feesPaid: !currentStatus });
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
        data: [
          students.length,
          leads.length,
          attendanceRecords.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length
        ],
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
                    <td className="px-6 py-3">{rec.student?.name || 'Unknown'}</td>
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
              <div>
                <label className="block text-sm font-medium mb-1">Test Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Weekly Test - Chemical Bonding"
                  className="w-full p-2 border rounded"
                  value={testForm.title}
                  onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  placeholder="Optional description"
                  className="w-full p-2 border rounded"
                  rows="2"
                  value={testForm.description}
                  onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes) *</label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-2 border rounded"
                  value={testForm.duration}
                  onChange={(e) => setTestForm({ ...testForm, duration: parseInt(e.target.value) || 30 })}
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Questions</h4>
                {testForm.questions.map((q, idx) => (
                  <div key={idx} className="border p-4 rounded bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Question {idx + 1}</h5>
                      {testForm.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <HiTrash />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Enter question text"
                      className="w-full p-2 border rounded mb-3"
                      value={q.questionText}
                      onChange={(e) => updateQuestion(idx, 'questionText', e.target.value)}
                    />
                    <div className="space-y-2 mb-3">
                      {q.options.map((opt, optIdx) => (
                        <input
                          key={optIdx}
                          type="text"
                          placeholder={`Option ${optIdx + 1}`}
                          className="w-full p-2 border rounded"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...q.options];
                            newOpts[optIdx] = e.target.value;
                            updateQuestion(idx, 'options', newOpts);
                          }}
                        />
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Correct Answer</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={q.correctOption}
                        onChange={(e) => updateQuestion(idx, 'correctOption', e.target.value)}
                      >
                        <option value={0}>Option 1</option>
                        <option value={1}>Option 2</option>
                        <option value={2}>Option 3</option>
                        <option value={3}>Option 4</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addQuestion} className="btn-secondary w-full">
                  + Add Another Question
                </button>
              </div>
              <button onClick={createTest} className="btn-primary w-full">Create Test</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <h3 className="text-xl font-semibold p-6 pb-2">Existing Tests</h3>
            {tests.length === 0 ? (
              <p className="p-6 text-gray-500">No tests created yet.</p>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Questions</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test) => (
                    <tr key={test._id} className="border-t">
                      <td className="px-6 py-3">{test.title}</td>
                      <td className="px-6 py-3">{test.questions?.length || 0}</td>
                      <td className="px-6 py-3">{test.duration} min</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          test.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {test.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
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
            )}
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Upload Notes</h3>
            <form onSubmit={handleFileUpload} encType="multipart/form-data">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select File (Max 10MB)
                  </label>
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    className="w-full p-2 border rounded"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    disabled={uploading}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: PDF, Images (JPG, PNG), Documents (DOC, DOCX)
                  </p>
                </div>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={!file || uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <h3 className="text-xl font-semibold p-6 pb-2">Uploaded Notes</h3>
            {notes.length === 0 ? (
              <p className="p-6 text-gray-500">No notes uploaded yet.</p>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Uploaded</th>
                    <th className="px-6 py-3">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note) => (
                    <tr key={note._id} className="border-t">
                      <td className="px-6 py-3">{note.title}</td>
                      <td className="px-6 py-3">{note.fileType?.split('/')[1] || note.fileType}</td>
                      <td className="px-6 py-3">{new Date(note.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3">
                        <a 
                          href={note.fileUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-purple-700 hover:underline"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
                <th className="px-6 py-3">Mobile</th>
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
                  <td className="px-6 py-3">{student.mobile || '-'}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      student.feesPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.feesPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => toggleFeesPaid(student._id, student.feesPaid)}
                      className="text-purple-700 hover:underline"
                    >
                      Toggle Status
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