import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import mechanicService from "../../services/mechanicService";
import { toast } from "react-hot-toast";

const MechanicProfile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", skills: "", experience: "", availability: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await mechanicService.getProfile();
        setForm({
          fullName: res.data.fullName,
          email: res.data.email,
          phone: res.data.phone,
          skills: res.data.skills.join(", "),
          experience: res.data.experience,
          availability: res.data.availability,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = {
        ...form,
        skills: form.skills.split(",").map(s => s.trim())
      };
      const res = await mechanicService.updateProfile(dataToUpdate);
      setUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="border rounded px-4 py-2" required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border rounded px-4 py-2" required />
        <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border rounded px-4 py-2" required />
        <input type="text" name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} className="border rounded px-4 py-2" required />
        <input type="text" name="experience" placeholder="Experience" value={form.experience} onChange={handleChange} className="border rounded px-4 py-2" required />
        <select name="availability" value={form.availability} onChange={handleChange} className="border rounded px-4 py-2" required>
          <option value="">Select Availability</option>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Profile</button>
      </form>
    </div>
  );
};

export default MechanicProfile;