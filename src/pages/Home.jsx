import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiAcademicCap, HiClock } from 'react-icons/hi';
import {HiTrophy} from 'react-icons/hi2'

import Teacher from "../assets/mamImage.png"
import chemistryCoaching from '../assets/chemistryCoaching.png'


const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:w-1/2"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Samarth Chemistry Coaching
              </h1>
              <p className="text-xl mb-6">
                Expert guidance for NEET, JEE Main & Advanced, MHT-CET
              </p>
              <p className="mb-8">11th & 12th Board Theory | Comprehensive Preparation</p>
              <div className="flex space-x-4">
                <Link to="/register" className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
                  Enroll Now
                </Link>
                <Link to="/courses" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-700">
                  Explore Courses
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:w-1/2 mt-8 md:mt-0"
            >
              <img
                src={chemistryCoaching}
                alt="Chemistry Coaching"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <HiAcademicCap className="text-5xl text-purple-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Faculty</h3>
              <p className="text-gray-600">Learn from experienced teachers with proven track record.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <HiClock className="text-5xl text-purple-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Comprehensive Study Material</h3>
              <p className="text-gray-600">Access to notes, tests, and regular assessments.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <HiTrophy className="text-5xl text-purple-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-600">Our students consistently achieve top ranks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2">
              <img src={Teacher} alt="Teacher" className="rounded-lg shadow-md" />
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 md:pl-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Lead Instructor</h2>
              <h3 className="text-2xl text-purple-700 mb-2">Vaishnavi Salve</h3>
              <p className="text-gray-600 mb-4">
                With over 15 years of experience in teaching Chemistry for competitive exams,
                Vaishnavi Mam has guided thousands of students to success in NEET, JEE, and MHT-CET.
              </p>
              <p className="text-gray-600">
                His unique teaching methodology simplifies complex concepts and builds strong fundamentals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Preview */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Top Performers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['जय भाबडी 98.50%', 'अक्षता सोनटक्के 98.48%', 'भावना जागळे 95.92%', 'मनीषा दलवी 94.00%'].map((result, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded-lg shadow text-center"
              >
                <p className="font-semibold">{result}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/results" className="btn-primary inline-block">
              View All Results
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;