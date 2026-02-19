import { Outlet } from 'react-router-dom';
import { ToastContainer as ReactToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import Sidebar from './Sidebar';
import { useApp } from '../../contexts/AppContext';

export default function Layout() {
  const { isSidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <ReactToastifyContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={`transition-all duration-300 ml-0 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <Header />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
