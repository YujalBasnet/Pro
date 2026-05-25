import { useEffect, useState } from "react";
import { FaUsers, FaTools, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import adminService from "../../services/adminService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, mechanics: 0, requests: 0, completed: 0 });
  const [jobsPerMonth, setJobsPerMonth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await adminService.getUsers();
        const mechanics = await adminService.getMechanics();
        const requests = await adminService.getRequests();

        const completed = requests.data.filter(r => r.status === "Completed").length;

        // Example: Jobs per month (simplified, adjust backend API)
        const months = Array.from({ length: 12 }, (_, i) => ({ month: `Month ${i + 1}`, jobs: Math.floor(Math.random() * 20) }));
        setJobsPerMonth(months);

        setStats({ users: users.data.length, mechanics: mechanics.data.length, requests: requests.data.length, completed });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const pieData = [
    { name: "Completed", value: stats.completed },
    { name: "Pending", value: stats.requests - stats.completed },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow rounded p-6 flex items-center gap-4">
          <FaUsers className="text-blue-600 text-3xl" />
          <div>
            <p className="text-gray-500">Total Users</p>
            <h2 className="text-xl font-bold">{stats.users}</h2>
          </div>
        </div>
        <div className="bg-white shadow rounded p-6 flex items-center gap-4">
          <FaTools className="text-yellow-500 text-3xl" />
          <div>
            <p className="text-gray-500">Total Mechanics</p>
            <h2 className="text-xl font-bold">{stats.mechanics}</h2>
          </div>
        </div>
        <div className="bg-white shadow rounded p-6 flex items-center gap-4">
          <FaClipboardList className="text-purple-600 text-3xl" />
          <div>
            <p className="text-gray-500">Total Requests</p>
            <h2 className="text-xl font-bold">{stats.requests}</h2>
          </div>
        </div>
        <div className="bg-white shadow rounded p-6 flex items-center gap-4">
          <FaCheckCircle className="text-green-500 text-3xl" />
          <div>
            <p className="text-gray-500">Completed Jobs</p>
            <h2 className="text-xl font-bold">{stats.completed}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-2xl font-bold mb-4">Job Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-2xl font-bold mb-4">Jobs per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobsPerMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="jobs" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;