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
import { FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Optional for table format
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const StaffData = [
  {
    requirement: "Patient Monitoring",
    category: "Nursing",
    lastReview: "2024-12-01",
    nextReview: "2025-06-01",
    status: "Active",
    actions: "Edit",
  },
  {
    requirement: "Wound Care",
    category: "Nursing",
    lastReview: "2024-11-15",
    nextReview: "2025-05-15",
    status: "Action Required",
    actions: "Edit",
  },
];

const Page = () => {

  // Define your navigation links here with proper routes
  const navItems = [
    { icon: <FaThLarge />, label: "Dashboard", href: "/Dashboard" },
    { icon: <FaUser />, label: "Client Management", href: "/Client-Management" },
    { icon: <FaClipboardList />, label: "Care Planning", href: "/Care-Planning" },
    { icon: <FaExclamationTriangle />, label: "Incident Reports", href: "/Incident-Reports" },
    { icon: <FaUsers />, label: "HR Management", href: "/HR-Management" },
    { icon: <FaGraduationCap />, label: "Training", href: "/Training" },
    { icon: <FaShieldAlt />, label: "Compliance", href: "/Compliance", active: true },
    { icon: <FaUserCog />, label: "User Management", href: "/User-Management" },
  ];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [StaffData, setStaffData] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState("All Records");
  const filters = ["All Records", "Compliant", "Action Required", "Upcoming"];
  const [showForm5, setShowForm5] = useState(false);
  
  // Define your navigation links here with proper routes
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData5, setFormData5] = useState({
    requirement: '',
    category: '',
    lastReviewDate: '',
    nextReview: '',
    status: '',
    notes: ''
  });
  const [viewrequirement, setViewRequirement] = useState(null);
   const [viewcategory, setViewCategory] = useState(null);   
  const [viewlastReviewDate, setViewLastReviewDate] = useState(null);
  const [viewnextReviewDate, setViewNextReviewDate] = useState(null);
  const [viewstatus, setViewStatus] = useState(null);
  const [viewnotes, setViewNotes] = useState(null);
  const [showModals, setShowModals] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null); // track if editing
  const handleEdit = (comp) => {
    setFormData5({
      requirement: comp.requirement,
      category: comp.category,
      lastReviewDate: comp.lastReviewDate.slice(0, 10), // Format date to YYYY-MM-DD
      nextReview: comp.nextReviewDate.slice(0, 10), // Format date to YYYY-MM-DD
      status: comp.status,
      notes: comp.notes
    });
    setShowForm5(true); // ✅ FIXED HERE
    setEditingUserId(comp._id);
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
  doc.text("Compliance Records", 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [["Field", "Value"]],
    body: [
      ["Requirement", item.requirement],
      ["Category", item.category],
      ["LastReviewDate", item.lastReviewDate.slice(0, 10)],
      ["NextReview", item.nextReviewDate.slice(0, 10)],
      ["Status", item.status],
      ["Notes", item.notes],
    ]
  });

  doc.save(`${item.fullName}_details.pdf`);
};






  const handleChange5 = (e) => {
    const { name, value } = e.target;
    setFormData5((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleToggleForm5 = () => {
    setShowForm5(!showForm5);
  };


  const handleCancel5 = () => {
    setShowForm5(false);
    setFormData5({
      requirement: '',
      category: '',
      lastReviewDate: '',
      nextReview: '',
      status: '',
      notes: ''
    });
  };

  const handleSubmit5 = (e) => {
    e.preventDefault();

    const { requirement, category, lastReviewDate, nextReview, status, notes } = formData5;
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User not authenticated');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const payload = {
      requirement,
      category,
      lastReviewDate,
      nextReviewDate: nextReview,
      status,
      notes,
    };
    const request = editingUserId
      ? axios.put(`https://control-panel-backend-eta.vercel.app/compliance/${editingUserId}`, payload, config)
      : axios.post(`https://control-panel-backend-eta.vercel.app/compliance`, payload, config);

    request
      .then(res => {
        setMessage(editingUserId ? 'Staff updated successfully' : 'Staff added successfully');
        setEditingUserId(null);
        setFormData5({
          requirement: '',
          category: '',
          lastReviewDate: '',
          nextReview: '',
          status: '',
          notes: ''
        });
        setShowForm5(false);
        toast.success("Add successfuly")
        console.log("Fetching updated compliance data...");
        return axios.get('https://control-panel-backend-eta.vercel.app/compliance', config);
      })
      .then(res => {
        console.log("Fetched data:", res.data);
        setStaffData(res.data);
      })
      .catch(err => {
        console.error("Full Error:", err);
        console.error("Response Data:", err.response?.data);
        setError(err.response?.data?.error || err.response?.data?.msg || err.message || 'An error occurred');
        toast.error(err.response?.data?.msg)
      });
  };


  useEffect(() => {
    let filtered = StaffData;

    // First filter based on selected status
    if (selected !== "All Records") {
      filtered = filtered.filter((staff) => staff.status === selected);
    }

    // Then filter based on search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((staff) =>
        staff.requirement?.toLowerCase().includes(query) ||
        staff.category?.toLowerCase().includes(query) ||
        staff.status?.toLowerCase().includes(query) ||
        staff.lastReviewDate?.toLowerCase().includes(query) ||
        staff.nextReviewDate?.toLowerCase().includes(query)
      );
    }

    setFilteredStaff(filtered);
  }, [selected, searchQuery, StaffData]);



  useEffect
    (() => {
      const fetchHR = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get("https://control-panel-backend-eta.vercel.app/compliance", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStaffData(res.data); // no .users needed, your backend returns an array
          setFilteredStaff(res.data);
          setMessage('Users fetched successfully');
          setError('');
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch HR data");
        }
      };
      fetchHR();
    }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    const token = localStorage.getItem('token');
    axios.delete(`https://control-panel-backend-eta.vercel.app/compliance/${id}`, {
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

  







const handleView = (client) => {

  setViewRequirement(client.requirement);
  setViewCategory(client.category);
  setViewLastReviewDate(client.lastReviewDate.slice(0, 10)); // Format date to YYYY-MM-DD
  setViewNextReviewDate(client.nextReviewDate.slice(0,  10)); // Format date to YYYY-MM-DD  
  setViewStatus(client.status);
  setViewNotes(client.notes); 
  setShowModals (true);
  
};



const data = {

  "Requirement": viewrequirement,
  "Category": viewcategory,
  "Last Review Date": viewlastReviewDate,       
  "Next Review Date": viewnextReviewDate,
  "Status": viewstatus,
  "Notes": viewnotes,
  
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
      Compliance Details
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
          Compliance
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
                  className={`side-menu-item flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-md transition-colors ${item.active
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
    {/* <div className="h-full overflow-y-auto pr-2"></div> */}
  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 hidden md:block">
    Compliance
  </h2>

  <div className="bg-white dark:bg-gray-800 rounded-lg  shadow-md p-6 mb-8 h-full overflow-y-auto pr-2 my-scroll">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Compliance Records</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Monitor regulatory compliance</p>
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
          onClick={handleToggleForm5}
          className="bg-[#4a48d4] hover:bg-[#4A49B0] text-white px-2 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
        >
          <FaPlus className="mr-2" /> Add Compliance Record
        </button>
      </div>
    </div>

    {/* Filters */}
    <div className="mb-6 flex text-white flex-wrap gap-2">
      {filters.map((label, index) => (
        <button
          key={index}
          onClick={() => setSelected(label)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all cursor-pointer backdrop-blur-sm ${
            selected === label
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
            {["Requirement", "Category", "Last Review", "Next Review", "Status", "Actions"].map((col, i) => (
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
                <td className="px-2 py-2 text-sm text-gray-900 dark:text-white">{item.requirement}</td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">{item.category}</td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">{item.lastReviewDate.slice(0, 10)}</td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">{item.nextReviewDate.slice(0, 10)}</td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">{item.status}</td>
                <td className="px-4 py-4">
                  <div className="flex space-x-2 text-gray-900 dark:text-white">
                    <button className="hover:text-blue-500 transition cursor-pointer" onClick={() => handleView(item)} >
                  <FaEye />
                    </button>
                    <button className="hover:text-yellow-500 transition cursor-pointer" onClick={() => handleEdit(item)}>
                      <FaEdit />
                    </button>
                    <button className="hover:text-red-500 transition cursor-pointer" onClick={() => handleDelete(item._id)}>
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
  {showForm5 && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto p-4">
      <form onSubmit={handleSubmit5} className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="requirement">
            Requirement
          </label>
          <input
            id="requirement"
            name="requirement"
            type="text"
            required
            value={formData5.requirement}
            onChange={handleChange5}
            className="shadow-sm border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData5.category}
            onChange={handleChange5}
            className="shadow-sm border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          >
            <option value="">Select Category</option>
            <option value="Health & Safety">Health & Safety</option>
            <option value="Clinical">Clinical</option>
            <option value="HR">HR</option>
            <option value="Documentation">Documentation</option>
            <option value="Environment">Environment</option>
            <option value="Quality">Quality</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="lastReviewDate">
            Last Review Date
          </label>
          <input
            id="lastReviewDate"
            name="lastReviewDate"
            type="date"
            required
            value={formData5.lastReviewDate}
            onChange={handleChange5}
            className="shadow-sm border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="nextReview">
            Next Review Date
          </label>
          <input
            id="nextReview"
            name="nextReview"
            type="date"
            required
            value={formData5.nextReview}
            onChange={handleChange5}
            className="shadow-sm border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData5.status}
            onChange={handleChange5}
            className="shadow-sm border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          >
            <option value="">Select Status</option>
            <option value="Compliant">Compliant</option>
            <option value="Action Required">Action Required</option>
            <option value="Non-Compliant">Non-Compliant</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="4"
            value={formData5.notes}
            onChange={handleChange5}
            className="shadow-sm border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          ></textarea>
        </div>

        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setShowForm5(false)}
            className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#4a48d4] hover:bg-[#4A49B0] text-white font-bold py-2 px-4 rounded"
          >
            Add Staff Member
          </button>
        </div>
      </form>
    </div>
  )}
</main>

      </div >
    </div >
  );
};

export default Page;
