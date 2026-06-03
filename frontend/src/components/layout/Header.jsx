import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import NotificationsDropdown from './NotificationsDropdown';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">TechSchedule</span>
            </Link>
            
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link to="/services" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Servicii</Link>
              <Link to="/about" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Despre noi</Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <NotificationsDropdown />
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                  {user?.profile_photo ? (
                    <img src={user.profile_photo} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                  <span>Contul meu</span>
                </Link>
                <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Ieșire</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Autentificare
                </Link>
                <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  Creează cont
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden ml-4">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
