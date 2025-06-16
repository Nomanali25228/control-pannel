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
  // FaEdit,
  // FaTrash,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Optional for table format

const StaffData = [
  {
    email: "nomigt6@gmail.com ",
    name: "Noman Developer",
    position: "Registered Nurse",
    department: "Nursing",
    startDate: "2023-05-10",
    status: "Active",
  },

];

const Page = () => {


  // Define your navigation links here with proper routes
  const navItems = [
    { icon: <FaThLarge />, label: "Dashboard", href: "/Dashboard" },
    { icon: <FaUser />, label: "Client Management", href: "/Client-Management" },
    { icon: <FaClipboardList />, label: "Care Planning", href: "/Care-Planning" },
    { icon: <FaExclamationTriangle />, label: "Incident Reports", href: "/Incident-Reports" },
    { icon: <FaUsers />, label: "HR Management", href: "/HR-Management", active: true },
    { icon: <FaGraduationCap />, label: "Training", href: "/Training" },
    { icon: <FaShieldAlt />, label: "Compliance", href: "/Compliance" },
    { icon: <FaUserCog />, label: "User Management", href: "/User-Management" },
  ];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [StaffData, setStaffData] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState("All Staff");
  const filters = ["All Staff", "Nursing", "Care", "Administration", "Management"];




  // Define your navigation links here with proper routes
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');




  // add staf -------------------------------------------------------------------------------------------------------------
  const [showModal3, setShowModal3] = useState(false);
  const [formData3, setFormData3] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    startDate: '',
  });
const handleEdit = (hr) => {
  console.log("handleEdit called with:", hr);
  setFormData3({
    name: hr.fullName,
    email: hr.email,
    position: hr.position,
    department: hr.department,
    startDate: hr.startDate?.slice(0, 10)
  });
  setShowModal3(true);
  setEditingUserId(hr._id);
};



const handleViewPdf = (item) => {
  // Alert or modal to show data in UI
  alert(`Full Name: ${item.fullName}\nEmail: ${item.email}\nPosition: ${item.position}\nDepartment: ${item.department}\nStart Date: ${item.startDate}`);
};

const handleDownloadPdf = async (item) => {
  const jsPDF = (await import('jspdf')).default;
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("HR Management Details", 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [["Field", "Value"]],
    body: [
      ["Full Name", item.fullName],
      ["Email", item.email],
      ["Position", item.position],
      ["Department", item.department],
      ["Start Date", item.startDate],
    ]
  });

  doc.save(`${item.fullName}_details.pdf`);
};



  const handleChange3 = (e) => {
    const { name, value } = e.target;
    setFormData3((prev) => ({ ...prev, [name]: value }));
  };



  const [editingUserId, setEditingUserId] = useState(null); // track if editing



  const handleSubmit3 = (e) => {
    e.preventDefault();
    const { name, email, position, department, startDate, } = formData3;

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const payload = { fullName: name, email: email, position: position, department: department, startDate: startDate };

    const request = editingUserId
      ? axios.put(`https://control-panel-backend-eta.vercel.app/hr/${editingUserId}`, payload, config)
      : axios.post(`https://control-panel-backend-eta.vercel.app/hr`, payload, config);

    request
      .then(res => {
        setMessage(editingUserId ? 'Staff updated successfully' : 'Staff added successfully');
        setEditingUserId(null);
        setFormData3({ name: '', department: '', email: "", position: '', startDate: '' });
        setShowModal3(false);
        toast.success("Add successfuly")
        return axios.get('https://control-panel-backend-eta.vercel.app/hr', config);
      })
      .then(res => {
        setStaffData(res.data.allHr);
      })
      .catch(err => {
        console.error("Error:", err.response?.data);
        setError(err.response?.data?.msg || 'An error occurred');
        toast.error(err.response?.data?.msg || 'An error occurred')
      });
  };





  useEffect
    (() => {
      const fetchHR = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get("https://control-panel-backend-eta.vercel.app/hr", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStaffData(res.data.allHr); // no .users needed, your backend returns an array
          setFilteredStaff(res.data.allHr);
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

  if (selected === "All Staff") {
    filtered = StaffData;
  } else {
    filtered = StaffData.filter((staff) => staff.department === selected);
  }

  if (searchQuery.trim() !== "") {
    const lowerSearch = searchQuery.toLowerCase();
    filtered = filtered.filter(staff =>
      staff.fullName.toLowerCase().includes(lowerSearch)
    );
  }

  setFilteredStaff(filtered);
}, [selected, StaffData, searchQuery]);









  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    const token = localStorage.getItem('token');
    axios.delete(`https://control-panel-backend-eta.vercel.app/hr/${id}`, {
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
        toast("deleted successfuly")
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
  }, [user, router]);

  if (!user) return null;






  return (
    <div className="bg-[#111827] min-h-screen ">
      <Navbar />
{/* Mobile Navbar Toggle */}
<div className="lg:hidden flex items-center justify-end px-4 py-3 bg-white dark:bg-gray-800 shadow relative">
  <h1 className="text-lg text-gray-900 dark:text-white font-semibold absolute left-4">HR Management</h1>
  <button
    onClick={() => setSidebarOpen(!sidebarOpen)}
    className="text-gray-800 dark:text-white text-xl"
  >
    {sidebarOpen ? <FaTimes /> : <FaBars />}
  </button>
</div>

<div className="flex flex-1">
  {/* Sidebar */}
  <aside
    className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0 lg:relative lg:block`}
  >
    <nav className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center lg:block">
        <p className="text-sm text-gray-500 dark:text-gray-400">Navigation</p>
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
            onClick={() => setSidebarOpen(false)}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#EEEEFF] flex items-center justify-center text-[#4A49B0] font-medium">
            {user.fullName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>
    </nav>
  </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 hidden md:block">HR Management</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Staff</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage staff and schedules</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 pr-4 py-2 focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light dark:bg-gray-700 dark:text-white"
                    placeholder="Search staff..."
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <button onClick={() => setShowModal3(true)} className="bg-[#4a48d4] hover:bg-[#4A49B0] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                  <FaPlus className="mr-2" /> Add New Staff
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex text-white flex-wrap gap-2">
              {filters.map((label, index) => (
                <button
                  key={index}
                  onClick={() => setSelected(label)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all cursor-pointer backdrop-blur-sm ${selected === label
                    ? "bg-primary-light text-primary dark:bg-gray-700 dark:text-primary-light shadow-lg"
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
                    {["Name", "Position", "Department", "Start Date", "Actions"].map((col, i) => (
                      <th
                        key={i}
                        className="  px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStaff.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white text-blue-500 flex items-center justify-center rounded-full border dark:border-gray-600">
                            {item.fullName.split(' ').map(word => word[0]).join('').toUpperCase()}
                          </div>
                          <div className=" -px-5">
                            <div className=" text-sm font-medium text-gray-900 dark:text-white">{item.fullName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{item.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">{item.position}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">{item.department}</td>
                      <td className="px-2 py-4 text-[12px] text-gray-900 dark:text-white">{item.startDate.slice(0, 10)}</td>
                      {/* <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.status}</td> */}
                      <td className="px-4 py-4">
                        <div className="flex space-x-2 text-gray-900 dark:text-white">
                          {/* <button className="hover:text-blue-500 transition   cursor-pointer" >
                            <FaEye />
                          </button> */}
                          <button className="hover:text-yellow-500 transition cursor-pointer" onClick={() => handleEdit(item)}>
                            <FaEdit />
                          </button>
                          <button className="hover:text-red-500 transition    cursor-pointer" onClick={() => handleDelete(item._id)}>
                            <FaTrash />
                          </button>
                           <button
      className="hover:text-green-600 transition cursor-pointer"
      onClick={() => handleDownloadPdf(item)}
    >
      <FaDownload />
    </button>
                        </div>
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

          {/* Modal Form add staf */}
          {showModal3 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/50 bg-opacity-50">
              <form
                id="add-staff-form"
                onSubmit={handleSubmit3}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-lg"
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Add Staff Member
                </h2>

                {/* Full Name */}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    id="staff-name"
                    name="name"
                    type="text"
                    value={formData3.name}
                    onChange={handleChange3}
                    required
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    id="staff-email"
                    name="email"
                    type="email"
                    value={formData3.email}
                    onChange={handleChange3}
                    required
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Position */}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Position
                  </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    value={formData3.position}
                    onChange={handleChange3}
                    required
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Department */}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData3.department}
                    onChange={handleChange3}
                    required
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select Department</option>
                    <option value="Nursing">Nursing</option>
                    <option value="Care">Care</option>
                    <option value="Administration">Administration</option>
                    <option value="Management">Management</option>
                    <option value="Support">Support</option>
                  </select>
                </div>

                {/* Start Date */}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData3.startDate}
                    onChange={handleChange3}
                    required
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Action Buttons */}
               <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
  {/* Left side: Download PDF */}

  <div>
    <button
      type="button"
      onClick={() => setShowModal3(false)}
      className="modal-close bg-gray-300 cursor-pointer hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="bg-[#4a48d4] hover:bg-[#4A49B0] cursor-pointer text-white font-bold py-2 px-4 rounded"
    >
      Add Staff Member
    </button>
  </div>
</div>
              </form>
            </div>
          )}



        </main>
      </div>
    </div>
  );
};

export default Page;
