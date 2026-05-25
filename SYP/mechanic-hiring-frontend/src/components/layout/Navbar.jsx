import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600 no-underline">
        MechanicHire
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-blue-600 transition no-underline">
          Home
        </Link>
        <Link to="/services" className="hover:text-blue-600 transition no-underline">
          Services
        </Link>
        <Link to="/hire-mechanics" className="hover:text-blue-600 transition no-underline">
          Hire Mechanic
        </Link>
        <Link to="/about" className="hover:text-blue-600 transition no-underline">
          About
        </Link>
        <Link to="/contact" className="hover:text-blue-600 transition no-underline">
          Contact
        </Link>

        {!user ? (
          <>
            <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition no-underline">
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition no-underline"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to={`/dashboard/${user.role}`} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition no-underline">
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;