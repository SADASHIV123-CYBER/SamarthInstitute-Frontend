import { Outlet } from 'react-router-dom';
// import Navbar from '../components/Navbar';
import Navbar from '../Navbar';
// import Footer from '../components/Footer';
import Footer from '../Footer';
// import Chatbot from '../components/Chatbot';
import Chatbot from '../Chatbot';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Layout;