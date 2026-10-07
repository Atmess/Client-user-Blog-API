import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ page, setpage }) {

 const { user, loading ,logout } = useAuth();

  return (<div >
    <nav className="flex justify-center gap-4 p-4 ">
      <Link to="/">
        {' '}
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
          Home
        </button>
      </Link>
      <Link to="/shop">
        {' '}
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
          Shop
        </button>
      </Link>
      <Link to="/cart">
        {' '}
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
          Cart
        </button>{' '}
      </Link>
      
       {user ? (
          <div className="flex items-center gap-3 bg-blue-700 ">
            <span className="text-sm font-medium text-slate-100">
              Hi, {user.username || 'User'}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded transition"
          >
            Log in
          </Link>
        )}
    </nav>
    </div>
  );
}
