import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      toast.success('Welcome back!');

      setTimeout(() => {
        if (response.user.role === 'customer') {
          navigate('/customer/dashboard');
        } else if (response.user.role === 'mechanic') {
          navigate('/mechanic/dashboard');
        } else if (response.user.role === 'admin') {
          navigate('/admin/dashboard');
        }
      }, 500);
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-blue-500/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your MechanicHire account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 mt-8"
            >
              {loading ? '⏳ Signing In...' : '🔓 Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-cyan-300 font-semibold transition">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}