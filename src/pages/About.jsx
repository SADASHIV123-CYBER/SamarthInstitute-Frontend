import about from '../assets/about.png'

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
      <div className="max-w-3xl mx-auto">
        <img src={about} alt="About" className="w-full rounded-lg shadow-md mb-8" />
        <p className="text-lg text-gray-700 mb-6">
          Samarh Chemistry Coaching is a premier institute dedicated to preparing students for
          medical and engineering entrance examinations. Founded with a vision to provide quality
          education accessible to all, we specialize in NEET, JEE Main & Advanced, and MHT-CET.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Our comprehensive programs cover 11th and 12th board theory along with intensive coaching
          for competitive exams. We believe in building strong conceptual foundations while
          developing problem-solving skills.
        </p>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700">
            To empower students with knowledge and skills to achieve their dreams in medical and
            engineering fields through dedicated mentoring and innovative teaching methods.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;