const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Samarth Chemistry</h3>
            <p className="text-gray-400">
              Empowering students for NEET, JEE, and MHT-CET with expert guidance.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/courses" className="hover:text-white">Courses</a></li>
              <li><a href="/results" className="hover:text-white">Results</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <p className="text-gray-400">Samarth Chemistry Classes Kotha Road, Bank Colony, Vasmat Nagar District Hingoli</p>
            <p className="text-gray-400">Mobile: 8329863662</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          © {new Date().getFullYear()} Samarth Chemistry Coaching. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;