import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/picture/image1.png';

export default function Header() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 shadow-md">
      {/* justify-between spaces out your 3 sections evenly to the edges */}
      <nav className="flex items-center justify-between px-6 py-4 w-full bg-white-700">
        {/* ================= 1. LEFT DIV: Logo / Symbol ================= */}
        <div className="flex items-center">
          <Link
            to="/"
            className="text-xl font-black text-white tracking-wider flex items-center gap-2"
          >
            {/* You can replace this emoji with an SVG or image logo */}
            <img src={logo} alt="evil-twin-logo" height={50} width={50} />
            <span className="hidden sm:inline">BlogApp</span>
          </Link>
        </div>

        {/* ================= 2. CENTER DIV: Navigation Links ================= */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition text-sm font-medium">
              Home
            </button>
          </Link>
          <Link to="/dashboard">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition text-sm font-medium">
              Dashboard
            </button>
          </Link>
          <Link to="/posts">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition text-sm font-medium">
              Post
            </button>
          </Link>
          <Link to="/shop">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition text-sm font-medium">
              Card
            </button>
          </Link>
          <Link to="/message">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition text-sm font-medium">
              Message
            </button>
          </Link>
        </div>

        {/* ================= 3. RIGHT DIV: User Profile & Dropdown ================= */}
        <div className="relative flex items-center justify-end">
          {user ? (
            <div>
              {/* Clickable username box */}
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-blue-800 px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-700 transition select-none border border-blue-600"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover border border-slate-700"
                />
                <span className="text-sm font-medium text-slate-100">
                  {user.username || 'User'}
                </span>
                <span className="text-xs text-slate-300">▼</span>
              </div>

              {/* Popup Dropdown Menu for Logout */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-2 z-50">
                  <Link to="/UserProfile">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition text-sm font-medium">
                      User Profile
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition font-medium"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl transition text-sm font-medium shadow"
            >
              Log in
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
