import { useState } from "react";
import { toast } from "react-hot-toast";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="px-8 py-16 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border rounded px-4 py-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="border rounded px-4 py-2"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          className="border rounded px-4 py-2 h-32"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;