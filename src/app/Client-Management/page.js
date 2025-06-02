"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../(component)/navbar/Navbar";
import {
  FaThLarge,
  FaUser,
  FaClipboardList,
  FaExclamationTriangle,
  FaUsers,
  FaGraduationCap,
  FaShieldAlt,
  FaUserCog,
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const clients = [
  {
    name: "Noman developer",
    age: "20 years",
    room: "99",
    careType: "Residential",
    admitted: "02/21/2222",
    status: "Active",
  },
  {
    name: "k",
    age: "20 years",
    room: "99",
    careType: "Residential",
    admitted: "02/21/2222",
    status: "Active",
  },
];

const Page = () => {
  
    // Define your navigation links here with proper routes
            const navItems = [
                { icon: <FaThLarge />, label: "Dashboard", href: "/Dashboard" },
                { icon: <FaUser />, label: "Client Management", href: "/Client-Management", active: true },
                { icon: <FaClipboardList />, label: "Care Planning", href: "/Care-Planning" },
                { icon: <FaExclamationTriangle />, label: "Incident Reports", href: "/Incident-Reports"  },
                { icon: <FaUsers />, label: "HR Management", href: "/HR-Management" },
                { icon: <FaGraduationCap />, label: "Training", href: "/Training" },
                { icon: <FaShieldAlt />, label: "Compliance", href: "/Compliance" },
                { icon: <FaUserCog />, label: "User Management", href: "/User-Management"},
            ];
            const [sidebarOpen, setSidebarOpen] = useState(false);
                 const [StaffData, setStaffData] = useState([]);
                  const [filteredStaff, setFilteredStaff] = useState([]);
                  const [searchQuery, setSearchQuery] = useState('');
                const [selected, setSelected] = useState("All Clients");
                const filters = ["All Clients","Nursing","Residential", "Memory Care" ,"Respite"];
            const [totalclientlength, setTotalClientLength] = useState(0);
                    
            console.log("Total Clients:", totalclientlength);
                
                    
                        // Define your navigation links here with proper routes
                 const [message, setMessage] = useState('');
                  const [error, setError] = useState('');
            
// add client --------------------------
 
 const [showModal, setShowModal] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    room: '',
    careType: '',
    admitDate: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const handleEdit = (client) => {
  setFormData({
    name: client.fullName,
    age: client.age,
   room: client.roomNumber,
    careType: client.careType,
    admitDate: client.admissionDate?.slice(0, 10)
  });
  setShowModal(true); // ✅ FIXED HERE
  setEditingUserId(client._id);
};

  // Handle input changes

  // Optional: Handle form submit
  
  

 const [editingUserId, setEditingUserId] = useState(null); // track if editing
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  const { name,  age, room, careType, admitDate, } = formData;

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const payload = { fullName:name, age:age, roomNumber:room , careType:careType, admissionDate:admitDate };

  const request = editingUserId
    ? axios.put(`https://control-panel-backend-eta.vercel.app/client/${editingUserId}`, payload, config)
    : axios.post(`https://control-panel-backend-eta.vercel.app/client`, payload, config);

  request
    .then(res => {
      setMessage(editingUserId ? 'Staff updated successfully' : 'Staff added successfully');
      setEditingUserId(null);
      setFormData({ name: '', age: '', room:"", careType: '', admitDate: '' });
      setShowModal(false);
toast.success("Add successfly")
      return axios.get('https://control-panel-backend-eta.vercel.app/client', config);
    })
    .then(res => {
      setStaffData(res.data.clients || res.data); // Adjust based on your API response structure
    })
    .catch(err => {
      console.error("Error:", err.response?.data);
      setError(err.response?.data?.msg || 'An error occurred');
      toast.error(err.response?.data?.msg || 'An error occurred')
    });
  };

  
 useEffect(() => {
   const fetchHR = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("https://control-panel-backend-eta.vercel.app/client", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaffData(res.data.clients); // no .users needed, your backend returns an array
      setFilteredStaff(res.data.clients);
      setMessage('Users fetched successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch HR data");
    }
  };
  fetchHR();
  }, []);

  // Filter staff whenever searchQuery or selected changes
 useEffect(() => {
  let filtered = [];

  if (selected === "All Clients") {
    filtered = StaffData;
  } else {
    filtered = StaffData.filter((staff) => staff.careType === selected);
  }

  setFilteredStaff(filtered);
}, [selected, StaffData]);








const handleDelete = (id) => {
  if (!window.confirm('Are you sure you want to delete this user?')) return;

  const token = localStorage.getItem('token');
  axios.delete(`https://control-panel-backend-eta.vercel.app/client/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  .then(() => {
    setMessage('User deleted');
    // Remove user from UI
    const updated = StaffData.filter(user => user._id !== id);
    setStaffData(updated);
    setFilteredStaff(updated);
    toast.success("delete successfuly")
  })
  .catch(err => {
    console.error(err);
    setError(err.response?.data?.msg || 'Failed to delete user');
    toast.error(err.response?.data?.msg || 'Failed to delete user')
  });
};



const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/Login');
  }, [user ,router]);

  if (!user) return null;











  return (
    <div className="bg-[#111827] min-h-screen flex flex-col">
      <Navbar />

     {/* Toggle Sidebar Button - only for small screens */}
<div className="lg:hidden p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow">
  <h2 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
    Client Management
  </h2>
  <button
    onClick={() => setSidebarOpen(!sidebarOpen)}
    className="text-gray-800 dark:text-white text-xl"
  >
    {sidebarOpen ? <FaTimes /> : <FaBars />}
  </button>
</div>

<div className="flex flex-1">
  {/* Sidebar - always visible on lg+, toggle on small screens */}
  <aside
    className={`w-64 bg-white dark:bg-gray-800 shadow h-screen z-40
      ${sidebarOpen ? "fixed top-0 left-0 lg:sticky" : "hidden"} 
      lg:block`}
  >
    <nav className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Navigation
        </p>
      </div>

      <div className="flex-1 px-2 py-4 overflow-y-auto">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`side-menu-item flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-md transition-colors ${
              item.active
                ? "bg-primary-light dark:bg-gray-700 text-primary-light"
                : "hover:bg-primary-light hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary-light"
            }`}
            onClick={() => setSidebarOpen(false)} // close sidebar after click on small screens
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-[#EEEEFF] flex items-center justify-center text-[#4A49B0] font-medium">
            {user.fullName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </nav>
  </aside>



        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Client Management
</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Clients
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage client records and information
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 pr-4 py-2 focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light dark:bg-gray-700 dark:text-white text-base"
                    placeholder="Search clients..."
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <button  onClick={() => setShowModal(true)} className="bg-[#4a48d4] hover:bg-[#4A49B0] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                  <FaPlus className="mr-2" /> Create New Plan
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className=" mb-4 flex flex-wrap gap-2 text-white">
              {filters.map((label, index) => (
                <button
                  key={index}
                  onClick={() => setSelected(label)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    selected === label
                      ? "bg-primary-light text-primary dark:bg-gray-700 dark:text-primary-light shadow"
                      : "bg-gray-100 hover:bg-primary-light dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {["Name", "Room", "Care Type", "Admitted", "Status", "Actions"].map((col, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStaff.map((client, i) => (
                    <tr key={i}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white text-blue-500 flex items-center justify-center rounded-full font-semibold">
                            {client.fullName
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {client.fullName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {client.age}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {client.roomNumber}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {client.careType}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {client.admissionDate.slice(0, 10)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {"Active"}
                        </span>
                      </td>
                      <td className="px-4 py-7 flex gap-3 items-center text-sm text-gray-900 dark:text-white">
                        {/* <FaEye className="cursor-pointer hover:text-blue-500 transition" /> */}
                        <FaEdit  className="cursor-pointer hover:text-yellow-500 transition" onClick={() => handleEdit(client)}/>
                        <FaTrash className="   cursor-pointer hover:text-red-500 transition" onClick={() => handleDelete(client._id)}/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
               {filteredStaff.length === 0 && (
                                <p className="text-center px-4 sm:px-6 py-36 text-gray-500 dark:text-gray-400">No staff found.</p>
                            )}
            </div>
          </div>

 {/* Add Client Button */}
      

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0   bg-black/50  flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6">
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="age" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="room" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  name="room"
                  id="room"
                  value={formData.room}
                  onChange={handleChange}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="careType" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Care Type
                </label>
                <select
                  name="careType"
                  id="careType"
                  value={formData.careType}
                  onChange={handleChange}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Care Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Nursing">Nursing</option>
                  <option value="Memory Care">Memory Care</option>
                  <option value="Respite">Respite</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="admitDate" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Admission Date
                </label>
                <input
                  type="date"
                  name="admitDate"
                  id="admitDate"
                  value={formData.admitDate}
                  onChange={handleChange}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}





        </main>
      </div>
    </div>
  );
};

export default Page;
