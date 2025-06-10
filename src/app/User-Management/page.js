"use client";
import React, { use, useState } from "react";
import Navbar from "../(component)/navbar/Navbar";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
  FaKey,
  FaBars,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import Link from "next/link";
import { set } from "nprogress";
import { toast } from "react-toastify";

const filters = ["All Users", "Admins", "Staff", "Clients"];

const StaffData = [
  {
    name: "Admin User",
    position: "Nurse",
    email: "john@example.com",
    Rool: "Admin",
    startDate: "2022-10-01",
    status: "Admins",
  },
  {
    name: "Staff Member",
    position: "Care Assistant",
    email: "staff@example.com",
    Rool: "Staff",
    startDate: "2023-01-15",
    status: "Staff",
  },
  {
    name: "Client Person",
    position: "Client",
    email: "client@example.com",
    Rool: "Client",
    startDate: "2023-03-10",
    status: "Clients",
  },
];

const Page = () => {


  const navItems = [
    { icon: <FaThLarge />, label: "Dashboard", href: "/Dashboard" },
    { icon: <FaUser />, label: "Client Management", href: "/Client-Management" },
    { icon: <FaClipboardList />, label: "Care Planning", href: "/Care-Planning" },
    { icon: <FaExclamationTriangle />, label: "Incident Reports", href: "/Incident-Reports" },
    { icon: <FaUsers />, label: "HR Management", href: "/HR-Management" },
    { icon: <FaGraduationCap />, label: "Training", href: "/Training" },
    { icon: <FaShieldAlt />, label: "Compliance", href: "/Compliance" },
    { icon: <FaUserCog />, label: "User Management", href: "/User-Management", active: true },
  ];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [StaffData, setStaffData] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState('All Users');
  const filters = ['All Users', 'admin', 'staff', 'client'];




  // Define your navigation links here with proper routes


  const [showForm6, setShowForm6] = useState(false);
  const [formData6, setFormData6] = useState({
    name: '',
    email: '',
    role: 'Client',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  const handleChange6 = (e) => {
    const { name, value } = e.target;
    setFormData6(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (user) => {
    setFormData6({
      name: user.fullName,
      email: user.email,
      role: user.role,
      password: '',
      confirmPassword: '',
    });
    setShowForm6(true);
    setEditingUserId(user._id); // Set the ID of the user being edited
  };





  const [editingUserId, setEditingUserId] = useState(null); // track if editing

  const handleSubmit6 = (e) => {
    e.preventDefault();
    const { name, email, role, password, confirmPassword } = formData6;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const token = localStorage.getItem('token');
    console.log("Token:", token);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    const payload = {
      fullName: name,
      email: email,
      role: role,
      ...(password && { password }),
    };

    console.log("Sending Payload:", { ...payload, confirmPassword });

    const request = editingUserId
      ? axios.put(`https://control-panel-backend-eta.vercel.app/user/${editingUserId}`, payload, config)
      : axios.post('https://control-panel-backend-eta.vercel.app/user/signup', { ...payload, confirmPassword }, config); // 🟢 Must include config here too

    request
      .then(res => {
        setMessage(editingUserId ? 'User updated successfully' : 'User created successfully');
        setEditingUserId(null);
        setFormData6({ name: '', email: '', role: 'Client', password: '', confirmPassword: '' });
        setShowForm6(false);
        toast.success("Add successfuly")
        return axios.get('https://control-panel-backend-eta.vercel.app/user', config);
      })
      .then(res => {
        setStaffData(res.data);
        setFilteredStaff(res.data);
      })
      .catch(err => {
        console.error("Error:", err.response?.data);
        setError(err.response?.data?.msg || 'An error occurred');
        toast.error(err.response?.data?.msg || 'An error occurred');
      });
  };

  useEffect(() => {
    axios.get('https://control-panel-backend-eta.vercel.app/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(response => {
        console.log('Fetched users:', response.data);
        setStaffData(response.data); // no .users needed, your backend returns an array
        setFilteredStaff(response.data);
        setMessage('Users fetched successfully');
        setError('');
      })
      .catch(error => {
        console.error('Error fetching users:', error.response?.data || error.message);
        setError(error.response?.data?.msg || 'Failed to fetch users');
      });
  }, []);

  // Filter staff whenever searchQuery or selected changes
  useEffect(() => {
    const filtered = StaffData.filter((staff) => {
      const role = staff.role?.toLowerCase(); // in case of undefined
      const matchesStatus =
        selected === 'All Users' || role === selected.toLowerCase();
      const matchesSearch = staff.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    setFilteredStaff(filtered);
  }, [searchQuery, selected, StaffData]);






  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    const token = localStorage.getItem('token');
    axios.delete(`https://control-panel-backend-eta.vercel.app/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => {
        setMessage('User deleted');
        // Remove user from UI
        const updated = StaffData.filter(user => user._id !== id);
        setStaffData(updated);
        setFilteredStaff(updated);
        toast.success("user deleted")
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.msg || 'Failed to delete user');
        toast.error(err.response?.data?.msg || 'Failed to delete user');
      });
  };



  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/Login');
  }, [user, router]);

  if (!user) return null;










  return (
    <div className="bg-[#111827] min-h-screen">
      <Navbar />
     {/* Mobile Navbar Toggle */}
<div className="lg:hidden flex items-center justify-end px-4 py-3 bg-white dark:bg-gray-800 shadow relative">
  <h1 className="text-lg text-gray-900 dark:text-white font-semibold absolute left-4">
    User Management
  </h1>
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
    className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:relative lg:block`}
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


        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 hidden md:block">User Management</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">System Users</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Search staff..."
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <button
                  onClick={() => setShowForm6(!showForm6)}
                  className="bg-[#4a48d4] hover:bg-[#4A49B0] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FaPlus className="mr-2 " /> Add New User
                </button>
              </div>
            </div>
            <div className="mb-6 flex text-white flex-wrap gap-2">
              {filters.map((label, index) => (
                <button
                  key={index}
                  onClick={() => setSelected(label)}
                  className={`px-3 py-1 rounded-full cursor-pointer text-sm font-medium transition-all ${selected === label
                    ? "bg-primary-light text-primary dark:bg-gray-700 dark:text-primary-light shadow-lg"
                    : "bg-gray-100 hover:bg-primary-light dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {["Name", "Email", "Role", "Actions"].map((col, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStaff.map((item, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white text-blue-500 flex items-center justify-center rounded-full border dark:border-gray-600">
                            {item.fullName.split(' ').map(word => word[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{item.fullName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{item.position}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.role}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2 text-gray-900 dark:text-white">
                          {/* <button className="text-blue-500 hover:text-blue-700"><FaEye /></button> */}
                          <button
                            className="hover:text-yellow-500 transition cursor-pointer"
                            onClick={() => handleEdit(item)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="hover:text-red-500 transition    cursor-pointer"
                            onClick={() => handleDelete(item._id)}
                          >
                            <FaTrash />
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
          {/* User Roles Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">User Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Admin */}
              <div className="p-4 bg-primary-light dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-white dark:text-primary-light mb-2">Admin</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Full system access with user management capabilities
                </p>
                <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Manage all users and staff</li>
                  <li>• Create and delete records</li>
                  <li>• Access all system features</li>
                  <li>• Configure system settings</li>
                </ul>
              </div>

              {/* Staff */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Staff</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Basic access for care home employees</p>
                <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• View and create care plans</li>
                  <li>• Report incidents</li>
                  <li>• Update client records</li>
                  <li>• View schedules</li>
                </ul>
              </div>

              {/* Client/Family */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Client/Family</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Limited access for clients and family members</p>
                <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• View care plans</li>
                  <li>• View activities schedule</li>
                  <li>• Submit requests</li>
                  <li>• Complete satisfaction surveys</li>
                </ul>
              </div>
            </div>
          </div>




          {showForm6 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/50 bg-opacity-50">
              <form
                id="add-user-form"
                className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-lg"
                onSubmit={handleSubmit6}
              >
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input

                    id="user-name"
                    name="name"
                    type="text"
                    required
                    value={formData6.name}
                    onChange={handleChange6}
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    id="user-email"
                    name="email"
                    type="email"
                    required
                    value={formData6.email}
                    onChange={handleChange6}
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData6.role}
                    onChange={handleChange6}
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring focus:border-blue-500"
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Administrator</option>
                    <option value="Staff">Staff</option>
                    <option value="Client">Client</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData6.password}
                    onChange={handleChange6}
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData6.confirmPassword}
                    onChange={handleChange6}
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowForm6(false)}
                    className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#4a48d4] hover:bg-[#4A49B0] text-white font-bold py-2 px-4 rounded"
                  >
                    Add User
                  </button>
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
