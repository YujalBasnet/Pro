import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import mechanicService from "../../services/mechanicService";
import requestService from "../../services/requestService";
import { toast } from "react-hot-toast";

const HireMechanic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mechanic, setMechanic] = useState(null);
  const [form, setForm] = useState({ service: "", location: "", description: "" });

  useEffect(() => {
    const fetchMechanic = async () => {
      try {
        const res = await mechanicService.getMechanicById(id);
        setMechanic(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMechanic();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestService.createRequest({ ...form, mechanicId: id });
      toast.success("Service request created successfully!");
      navigate("/dashboard/customer");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create request!");
    }
  };

  if (!mechanic) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Hire {mechanic.name}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="service"
          placeholder="Service Name"
          value={form.service}
          onChange={handleChange}
          className="border rounded px-4 py-2"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border rounded px-4 py-2"
          required
        />
        <textarea
          name="description"
          placeholder="Describe the issue"
          value={form.description}
          onChange={handleChange}
          className="border rounded px-4 py-2 h-32"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Hire Mechanic
        </button>
      </form>
    </div>
  );
};

export default HireMechanic;