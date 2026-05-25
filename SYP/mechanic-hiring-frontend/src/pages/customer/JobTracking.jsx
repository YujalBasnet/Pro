import { useEffect, useState } from "react";
import requestService from "../../services/requestService";

const JobTracking = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await requestService.getUserRequests();
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Job Tracking</h1>
      {jobs.length === 0 ? (
        <p>No service requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white shadow rounded p-4">
              <h2 className="font-bold text-xl mb-2">{job.service}</h2>
              <p><span className="font-semibold">Mechanic:</span> {job.mechanicName}</p>
              <p><span className="font-semibold">Location:</span> {job.location}</p>
              <p><span className="font-semibold">Status:</span> {job.status}</p>
              <p className="mt-2 text-gray-600">{job.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobTracking;