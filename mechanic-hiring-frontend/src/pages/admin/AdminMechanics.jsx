import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";

const AdminMechanics = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMechanics = async () => {
    try {
      const res = await adminService.getMechanics();
      setMechanics(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMechanics();
  }, []);

  const approveMechanic = async (id) => {
    try {
      await adminService.approveMechanic(id);
      toast.success("Mechanic approved successfully!");
      fetchMechanics();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve mechanic");
    }
  };

  const deleteMechanic = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mechanic?")) return;
    try {
      await adminService.deleteUser(id);
      toast.success("Mechanic deleted successfully!");
      fetchMechanics();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete mechanic");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Mechanics</h1>
      {mechanics.length === 0 ? (
        <p>No mechanics found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Skills</th>
                <th className="px-4 py-2 border">Experience</th>
                <th className="px-4 py-2 border">Availability</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mechanics.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-2 border">{m.fullName}</td>
                  <td className="px-4 py-2 border">{m.email}</td>
                  <td className="px-4 py-2 border">{m.skills.join(", ")}</td>
                  <td className="px-4 py-2 border">{m.experience}</td>
                  <td className="px-4 py-2 border">{m.availability}</td>
                  <td className="px-4 py-2 border">{m.status || "Pending"}</td>
                  <td className="px-4 py-2 border flex gap-2">
                    {m.status !== "Approved" && (
                      <button onClick={() => approveMechanic(m.id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                        Approve
                      </button>
                    )}
                    <button onClick={() => deleteMechanic(m.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
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

export default AdminMechanics;