import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    class: '11',
    targetExam: 'NEET',
    mobile: '',
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (error) {
      // Error handled
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border rounded"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border rounded"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border rounded"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Class</label>
            <select
              name="class"
              className="w-full p-2 border rounded"
              value={form.class}
              onChange={handleChange}
            >
              <option value="11">11th</option>
              <option value="12">12th</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Target Exam</label>
            <select
              name="targetExam"
              className="w-full p-2 border rounded"
              value={form.targetExam}
              onChange={handleChange}
            >
              <option value="NEET">NEET</option>
              <option value="JEE">JEE</option>
              <option value="MHT-CET">MHT-CET</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Mobile</label>
            <input
              type="tel"
              name="mobile"
              className="w-full p-2 border rounded"
              value={form.mobile}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-primary w-full">Register</button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;