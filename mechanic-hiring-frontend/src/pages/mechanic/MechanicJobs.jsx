import { useEffect, useState } from "react";
import requestService from "../../services/requestService";
import { toast } from "react-hot-toast";

const MechanicJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await requestService.getMechanicJobs();
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const updateStatus = async (jobId, status) => {
    try {
      await requestService.updateJobStatus(jobId, status);
      toast.success(`Job marked as ${status}`);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white shadow rounded p-4 flex flex-col gap-2">
              <h2 className="font-bold text-xl">{job.service}</h2>
              <p><span className="font-semibold">Customer:</span> {job.customerName}</p>
              <p><span className="font-semibold">Location:</span> {job.location}</p>
              <p><span className="font-semibold">Status:</span> {job.status}</p>
              <div className="flex gap-2 mt-2">
                {job.status !== "Accepted" && (
                  <button onClick={() => updateStatus(job.id, "Accepted")} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                    Accept
                  </button>
                )}
                {job.status !== "In Progress" && (
                  <button onClick={() => updateStatus(job.id, "In Progress")} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                    In Progress
                  </button>
                )}
                {job.status !== "Completed" && (
                  <button onClick={() => updateStatus(job.id, "Completed")} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MechanicJobs;