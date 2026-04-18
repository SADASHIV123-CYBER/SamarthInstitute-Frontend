import { motion } from 'framer-motion';

const courses = [
  {
    title: 'NEET Preparation',
    description: 'Complete syllabus coverage with focus on NCERT and advanced problems.',
    duration: '1 Year',
    target: 'NEET UG',
  },
  {
    title: 'JEE Main & Advanced',
    description: 'In-depth Chemistry for JEE with problem-solving techniques.',
    duration: '2 Years',
    target: 'JEE',
  },
  {
    title: 'MHT-CET',
    description: 'Targeted preparation for Maharashtra CET with mock tests.',
    duration: '1 Year',
    target: 'MHT-CET',
  },
  {
    title: '11th & 12th Board',
    description: 'Strong foundation in Chemistry for board exams.',
    duration: 'Academic Year',
    target: 'Board Exams',
  },
];

const Courses = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map((course, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <h3 className="text-2xl font-semibold text-purple-700 mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Duration: {course.duration}</span>
              <span>Target: {course.target}</span>
            </div>
            <button className="btn-primary mt-4 w-full">Enroll Now</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Courses;