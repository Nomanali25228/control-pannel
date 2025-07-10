"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../(component)/navbar/Navbar";
import Link from "next/link"; // <-- import Next.js Link
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
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Optional for table format


const Page = () => {


  // Define your navigation links here with proper routes
  const navItems = [
    { icon: <FaThLarge />, label: "Dashboard", href: "/Dashboard" },
    { icon: <FaUser />, label: "Client Management", href: "/Client-Management" },
    { icon: <FaClipboardList />, label: "Care Planning", href: "/Care-Planning" },
    { icon: <FaExclamationTriangle />, label: "Incident Reports", href: "/Incident-Reports" },
    { icon: <FaUsers />, label: "HR Management", href: "/HR-Management" },
    { icon: <FaGraduationCap />, label: "Training", href: "/Training", active: true },
    { icon: <FaShieldAlt />, label: "Compliance", href: "/Compliance" },
    { icon: <FaUserCog />, label: "User Management", href: "/User-Management" },
  ];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [StaffData, setStaffData] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState('All Records');
  const filters = ['All Records', 'Valid', 'Expiring Soon', 'Expired'];

  const [staffMembers, setStaffMembers] = useState([]); // For HR/staff members



  // Define your navigation links here with proper routes
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  const [showForm4, setShowForm4] = useState(false);
  const [formData4, setFormData4] = useState({
    staffName: '',
    trainingType: '',
    completionDate: '',
    expiryDate: '',
    notes: '',
  });


  const handleEdit = (training) => {
    setFormData4({
      staffName: training.staffMember._id, // Make sure you're sending the ID
      trainingType: training.trainingType,
      completionDate: training.completionDate.slice(0, 10),
      expiryDate: training.expiryDate.slice(0, 10),
      notes: training.notes,
    });
    setShowForm4(true);
    setEditingUserId(training._id);
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
    doc.text("Training Records", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Field", "Value"]],
      body: [
        ["StaffName", item.staffMember.fullName],
        ["TrainingType", item.trainingType],
        ["CompletionDate", item.completionDate.slice(0, 10)],
        ["ExpiryDatet", item.expiryDate.slice(0, 10)],
        ["Notes", item.notes],
      ]
    });

    doc.save(`${item.fullName}_details.pdf`);
  };












  const [editingUserId, setEditingUserId] = useState(null); // track if editing



  const handleChange4 = (e) => {
    const { name, value } = e.target;
    setFormData4(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit4 = (e) => {
    e.preventDefault();
    const { staffName, trainingType, completionDate, expiryDate, notes } = formData4;

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    const payload = {
      staffMember: staffName,  // This should be the MongoDB _id of the staff
      trainingType,
      completionDate,
      expiryDate,
      notes,
    };

    const request = editingUserId
      ? axios.put(`https://control-panel-backend-eta.vercel.app/training/${editingUserId}`, payload, config)
      : axios.post(`https://control-panel-backend-eta.vercel.app/training`, payload, config);

    request
      .then(res => {
        setMessage(editingUserId ? 'Training updated successfully' : 'Training added successfully');
        setEditingUserId(null);
        setFormData4({ staffName: '', trainingType: '', completionDate: '', expiryDate: '', notes: '' });
        setShowForm4(false);
        toast.success("Add successfuly")
        return axios.get('https://control-panel-backend-eta.vercel.app/training', config);
      })
      .then(res => {
        setStaffData(res.data); // Add this state to store training records
      })
      .catch(err => {
        console.error("Error:", err.response?.data);
        setError(err.response?.data?.msg || 'An error occurred');
        toast.error(err.response?.data?.msg || 'An error occurred')
      });
  };



  useEffect(() => {
    axios.get('https://control-panel-backend-eta.vercel.app/training', {
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
  {/* Filtering Staff based on selection + searchQuery */ }
  useEffect(() => {
    const now = new Date();

    const filtered = StaffData.filter((staff) => {
      const expiry = staff.expiryDate ? new Date(staff.expiryDate) : null;
      if (!expiry) return false;

      const diffInDays = (expiry - now) / (1000 * 60 * 60 * 24);
      const fullName = staff.staffMember?.fullName?.toLowerCase() || "";

      const matchesSelected =
        selected === "All Records" ||
        (selected === "Valid" && expiry > now && diffInDays > 30) ||
        (selected === "Expiring Soon" && expiry > now && diffInDays <= 30) ||
        (selected === "Expired" && expiry < now);

      const matchesSearch = fullName.includes(searchQuery.toLowerCase());

      return matchesSelected && matchesSearch;
    });

    setFilteredStaff(filtered);
  }, [selected, StaffData, searchQuery]);



  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('https://control-panel-backend-eta.vercel.app/hr', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setStaffMembers(response.data.allHr);  // Staff data set
        setMessage('Staff fetched successfully');
      })
      .catch(error => {
        setError(error.response?.data?.msg || 'Failed to fetch staff');
      });
  }, []);



  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    const token = localStorage.getItem('token');
    axios.delete(`https://control-panel-backend-eta.vercel.app/training/${id}`, {
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
        toast.success("Deleted successfuly")
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


  //  ["StaffName", item.staffMember.fullName],
  //       ["TrainingType", item.trainingType],
  //       ["CompletionDate", item.completionDate.slice(0, 10)],
  //       ["ExpiryDatet", item.expiryDate.slice(0, 10)],
  //       ["Notes", item.notes],


  const [viewName, setViewName] = useState(null);
  const [viewtrainingType, setViewTrainingType] = useState(null);
  const [viewCompletionDate, setViewCompletionDate] = useState(null);
  const [viewExpiryDate, setViewExpiryDate] = useState(null);
  const [viewNotes, setViewNotes] = useState(null);




  const [showModals, setShowModals] = useState(false);

  const handleView = (client) => {
    setViewName(client.staffMember.fullName);
    setViewTrainingType(client.trainingType);
    setViewCompletionDate(client.completionDate.slice(0, 10));
    setViewExpiryDate(client.expiryDate.slice(0, 10));
    setViewNotes(client.notes);
    setShowModals(true);

  };



  const data = {
    "Staff Name": viewName,
    "Training Type": viewtrainingType,
    "Completion Date": viewCompletionDate,
    "Expiry Date": viewExpiryDate,
    "Notes": viewNotes,


  }





  return (
    <div className="bg-[#111827] min-h-screen">
      <Navbar />

      {/* view data /////////////////////////////////////////////// */}
      {showModals && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-[#ffffff57] backdrop-blur-sm p-4 overflow-auto">
          <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 max-h-[90vh] overflow-hidden">

            {/* ❌ Close Button */}
            <button
              onClick={() => setShowModals(false)}
              className="absolute top-4 right-4 w-9 h-9 sm:w-10 sm:h-10 cursor-pointer rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 hover:rotate-90 transition-all duration-300 flex items-center justify-center shadow-md"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Heading */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
              Training Record Details
            </h2>

            {/* Scrollable Content */}
            <div className="space-y-4 sm:space-y-6 overflow-y-auto max-h-[60vh] pr-1 sm:pr-2">
              {Object.entries(data).map(([field, value]) => (
                <div key={field} className="flex justify-between border-b pb-2 sm:pb-3 text-xs sm:text-base md:text-lg">
                  <span className="text-gray-900 font-bold">{field}</span>
                  <span className="text-gray-600 text-right ml-24">{value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      )}

      {/* Mobile Navbar Toggle */}
      <div className="lg:hidden flex items-center justify-end px-4 py-3 bg-white dark:bg-gray-800 shadow relative">
        <h1 className="text-lg text-gray-900 dark:text-white font-semibold absolute left-4">
          Training
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
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
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
                  className={`side-menu-item flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-md transition-colors ${item.active
                    ? "bg-primary-light dark:bg-gray-700 text-primary-light"
                    : "hover:bg-primary-light hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary-light"
                    }`}
                  onClick={() => setSidebarOpen(false)} // close sidebar on mobile after click
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
        <main className="flex-1 p-6 max-h-screen overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 hidden md:block">
            Training
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 h-full overflow-y-auto pr-2 my-scroll">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Training Records</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track staff training and certifications</p>
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
                <button
                  onClick={() => setShowForm4(true)}
                  className="bg-[#4a48d4] hover:bg-[#4A49B0] text-white px-4 py-2 rounded-md text-[10px] font-medium transition-colors flex items-center"
                >
                  <FaPlus className="mr-2" /> Add New Training Record
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
              <table className="min-w-[800px] md:min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {["Staff Member", "Training Type", "Completion Date", "Expiry Date", "Status", "Actions"].map((col, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((item, i) => (
                      <tr key={i}>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white text-blue-500 flex items-center justify-center rounded-full border dark:border-gray-600">
                              {item.staffMember?.fullName?.split(" ").map(word => word[0]).join("").toUpperCase()}
                            </div>
                            <div>
                              <div className="text-[12px] font-medium text-gray-900 dark:text-white">{item.staffMember?.fullName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">{item.trainingType}</td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">{item.completionDate.slice(0, 10)}</td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">{item.expiryDate.slice(0, 10)}</td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">Active</td>
                        <td className="px-4 py-4">
                          <div className="flex space-x-2 text-gray-900 dark:text-white">
                            <button className="hover:text-blue-500 transition cursor-pointer" onClick={() => handleView(item)}>
                              <FaEye />
                            </button>
                            <button className="cursor-pointer hover:text-yellow-500 transition" onClick={() => handleEdit(item)}>
                              <FaEdit />
                            </button>
                            <button className="cursor-pointer hover:text-red-500 transition" onClick={() => handleDelete(item._id)}>
                              <FaTrash />
                            </button>
                            <button className="hover:text-green-600 transition cursor-pointer" onClick={() => handleDownloadPdf(item)}>
                              <FaDownload />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center px-4 sm:px-6 py-24 text-gray-500 dark:text-gray-400 text-sm">
                        No staff found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Form */}
          {showForm4 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto p-4">
              <form
                onSubmit={handleSubmit4}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-lg"
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Add Training Record</h2>

                {/* Staff Member */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Member</label>
                  <select
                    name="staffName"
                    value={formData4.staffName}
                    onChange={handleChange4}
                    required
                    className="w-full rounded border py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  >
                    <option value="">Select Staff Member</option>
                    {staffMembers.map((staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Training Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Training Type</label>
                  <select
                    name="trainingType"
                    value={formData4.trainingType}
                    onChange={handleChange4}
                    required
                    className="w-full rounded border py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  >
                    <option value="">Select Training Type</option>
                    <option value="First Aid">First Aid</option>
                    <option value="Moving & Handling">Moving & Handling</option>
                    <option value="Fire Safety">Fire Safety</option>
                    <option value="Infection Control">Infection Control</option>
                    <option value="Medication Administration">Medication Administration</option>
                    <option value="Dementia Care">Dementia Care</option>
                    <option value="Safeguarding">Safeguarding</option>
                    <option value="GDPR">GDPR</option>
                  </select>
                </div>

                {/* Completion Date */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Completion Date</label>
                  <input
                    type="date"
                    name="completionDate"
                    value={formData4.completionDate}
                    onChange={handleChange4}
                    required
                    className="w-full rounded border py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  />
                </div>

                {/* Expiry Date */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData4.expiryDate}
                    onChange={handleChange4}
                    required
                    className="w-full rounded border py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  />
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                  <textarea
                    name="notes"
                    value={formData4.notes}
                    onChange={handleChange4}
                    rows="4"
                    className="w-full rounded border py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowForm4(false)}
                    className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#4a48d4] hover:bg-[#4A49B0] text-white font-bold py-2 px-4 rounded"
                  >
                    Add Record
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
