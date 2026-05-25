import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FaHome, FaUser, FaToolbox, FaUsers } from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();

  let links = [];
  if (!user) links = [];
  else if (user.role === "customer")
    links = [
      { name: "Dashboard", path: "/dashboard/customer", icon: <FaHome /> },
      { name: "Service Requests", path: "/request-service", icon: <FaToolbox /> },
      { name: "Mechanics", path: "/mechanics", icon: <FaUsers /> },
    ];
  else if (user.role === "mechanic")
    links = [
      { name: "Dashboard", path: "/dashboard/mechanic", icon: <FaHome /> },
      { name: "Jobs", path: "/mechanic/jobs", icon: <FaToolbox /> },
      { name: "Profile", path: "/mechanic/profile", icon: <FaUser /> },
    ];
  else if (user.role === "admin")
    links = [
      { name: "Dashboard", path: "/dashboard/admin", icon: <FaHome /> },
      { name: "Users", path: "/admin/users", icon: <FaUsers /> },
      { name: "Mechanics", path: "/admin/mechanics", icon: <FaToolbox /> },
      { name: "Requests", path: "/admin/requests", icon: <FaToolbox /> },
    ];

  return (
    <div className="w-64 h-screen bg-white shadow-md p-6 fixed">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <ul className="flex flex-col gap-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link to={link.path} className="flex items-center gap-2 hover:text-blue-600">
              {link.icon} {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;