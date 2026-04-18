import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChat, HiX } from 'react-icons/hi';
import axios from 'axios';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    targetExam: '',
    mobile: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    { field: 'name', question: "What's your name?", type: 'text' },
    {
      field: 'class',
      question: 'Which class are you in?',
      type: 'select',
      options: ['11', '12'],
    },
    {
      field: 'targetExam',
      question: 'What is your target exam?',
      type: 'select',
      options: ['NEET', 'JEE', 'MHT-CET'],
    },
    { field: 'mobile', question: 'What is your mobile number?', type: 'tel' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [questions[step].field]: e.target.value });
  };

  const handleNext = () => {
    if (!formData[questions[step].field]) {
      toast.error('Please fill this field');
      return;
    }
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      submitLead();
    }
  };

  const submitLead = async () => {
    try {
      await axios.post('/leads', formData);
      setSubmitted(true);
      toast.success('Thank you! We will contact you soon.');
      setTimeout(() => {
        setIsOpen(false);
        setStep(0);
        setFormData({ name: '', class: '', targetExam: '', mobile: '' });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-purple-700 text-white p-4 rounded-full shadow-lg hover:bg-purple-800 transition-colors z-50"
      >
        {isOpen ? <HiX size={24} /> : <HiChat size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="bg-purple-700 text-white p-4">
              <h3 className="font-semibold">Chat with us</h3>
              <p className="text-sm opacity-90">We'll help you get started</p>
            </div>
            <div className="p-4 h-80 overflow-y-auto">
              {submitted ? (
                <p className="text-center text-green-600">Thank you! We'll be in touch.</p>
              ) : (
                <div>
                  <p className="mb-3 text-gray-700">{questions[step].question}</p>
                  {questions[step].type === 'select' ? (
                    <select
                      className="w-full p-2 border rounded"
                      value={formData[questions[step].field]}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {questions[step].options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={questions[step].type}
                      className="w-full p-2 border rounded"
                      value={formData[questions[step].field]}
                      onChange={handleChange}
                      onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                    />
                  )}
                  <button onClick={handleNext} className="btn-primary w-full mt-4">
                    {step === questions.length - 1 ? 'Submit' : 'Next'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;