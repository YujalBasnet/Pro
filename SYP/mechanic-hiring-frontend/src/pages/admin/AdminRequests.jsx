import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await adminService.getRequests();
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await adminService.deleteRequest(id);
      toast.success("Request deleted successfully!");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete request");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Service Requests</h1>
      {requests.length === 0 ? (
        <p>No service requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Service</th>
                <th className="px-4 py-2 border">Customer</th>
                <th className="px-4 py-2 border">Mechanic</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 border">{r.service}</td>
                  <td className="px-4 py-2 border">{r.customerName}</td>
                  <td className="px-4 py-2 border">{r.mechanicName}</td>
                  <td className="px-4 py-2 border">{r.location}</td>
                  <td className="px-4 py-2 border">{r.status}</td>
                  <td className="px-4 py-2 border">
                    <button onClick={() => deleteRequest(r.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;