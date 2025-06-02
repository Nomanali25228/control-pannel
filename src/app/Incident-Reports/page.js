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

const CarePlans = [
    {
        Date: "02/21/2222",
        Client: "Noman Developer",
        Type: "Medication Error",
        Severity: "Medium",
        ReportedBy: "Dr. Khan",
        Status: "Open",
    },
];

const Page = () => {
   

   

        // Define your navigation links here with proper routes
            const navItems = [
                { icon: <FaThLarge />, label: "Dashboard", href: "/Dashboard" },
                { icon: <FaUser />, label: "Client Management", href: "/Client-Management" },
                { icon: <FaClipboardList />, label: "Care Planning", href: "/Care-Planning" },
                { icon: <FaExclamationTriangle />, label: "Incident Reports", href: "/Incident-Reports", active: true  },
                { icon: <FaUsers />, label: "HR Management", href: "/HR-Management" },
                { icon: <FaGraduationCap />, label: "Training", href: "/Training" },
                { icon: <FaShieldAlt />, label: "Compliance", href: "/Compliance" },
                { icon: <FaUserCog />, label: "User Management", href: "/User-Management"},
            ];
            const [sidebarOpen, setSidebarOpen] = useState(false);
  const [incidentData, setIncidentData] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState('All Incidents');
  const filters = ['All Incidents', 'Open', 'Under Investigation', 'Resolved'];
        const [staffMembers, setStaffMembers] = useState([]); // For HR/staff members

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [showModal2, setShowModal2] = useState(false);
  const [formData2, setFormData2] = useState({
    incidentDate: '',
    incidentType: '',
    severity: '',
    reportedBy: '',
    client:'',
    incidentDetails: '',
    status: 'Open',
  });
  const [editingIncidentId, setEditingIncidentId] = useState(null);

  const router = useRouter();
  const { user, logout } = useAuth();

  // Redirect to login if not authenticated
  
  // Fetch incidents
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://control-panel-backend-eta.vercel.app/incident/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIncidentData(res.data.incidents);
        setFilteredIncidents(res.data.incidents);
        setMessage('Incidents fetched successfully');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch incidents');
      }
    };
    fetchIncidents();
  }, []);

  // Filter incidents by status
  useEffect(() => {
    let filtered = [];

    if (selected === 'All Incidents') {
      filtered = incidentData;
    } else {
      filtered = incidentData.filter((item) => item.status === selected);
    }

    setFilteredIncidents(filtered);
  }, [selected, incidentData]);

  const handleEdit = (incident) => {
    setFormData2({
      incidentDate: incident.incidentDate.slice(0,10),
      incidentType: incident.incidentType,
      severity: incident.severity,
      reportedBy: incident.reportedBy,
      incidentDetails: incident.incidentDetails,
      status: incident.status,
      client:incident.client
    });
    setShowModal2(true);
    setEditingIncidentId(incident._id);
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const request = editingIncidentId
      ? axios.put(`https://control-panel-backend-eta.vercel.app/incident/update/${editingIncidentId}`, formData2, config)
      : axios.post(`https://control-panel-backend-eta.vercel.app/incident/`, formData2, config);

    request
      .then((res) => {
        setMessage(editingIncidentId ? 'Incident updated' : 'Incident added');
        setEditingIncidentId(null);
        setFormData2({
          incidentDate: '',
          incidentType: '',
          severity: '',
          reportedBy: '',
          incidentDetails:'',
          client:"",
          status: 'Open',
        });
        setShowModal2(false);
        toast.success("Add successfuly")
        return axios.get('https://control-panel-backend-eta.vercel.app/incident/all', config);
      })
      .then((res) => {
        setIncidentData(res.data.incidents);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.msg || 'Error occurred');
        toast.error(err.response?.data?.msg || 'Error occurred')
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this incident?')) return;

    const token = localStorage.getItem('token');
    axios
      .delete(`https://control-panel-backend-eta.vercel.app/incident/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        const updated = incidentData.filter((i) => i._id !== id);
        setIncidentData(updated);
        setFilteredIncidents(updated);
        setMessage('Incident deleted');
        toast.success("Deleted successfuly")
      })
      .catch((err) => {
        setError(err.response?.data?.msg || 'Failed to delete incident');
        toast.error(err.response?.data?.msg || 'Failed to delete incident')
      });
  };



useEffect(() => {
  const token = localStorage.getItem('token');
  axios.get('https://control-panel-backend-eta.vercel.app/client', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  .then(response => {
    setStaffMembers(response.data.clients);  // Staff data set
    setMessage('Staff fetched successfully');
  })
  .catch(error => {
    setError(error.response?.data?.msg || 'Failed to fetch staff');
  });
}, []);

const handleStatusChange = async (id, newStatus) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.put(
      `https://control-panel-backend-eta.vercel.app/incident/update/${id}`,
      { status: newStatus },
      config
    );

    // ✅ Just like handleSubmit2
    const response = await axios.get('https://control-panel-backend-eta.vercel.app/incident/all', config);
    setIncidentData(response.data.incidents);
    
  } catch (err) {
    console.error('Error updating status:', err);
  }
};




  useEffect(() => {
    if (!user) router.push('/Login');
  }, [user,router]);

  if (!user) return null;

    return (
        <div className="bg-[#111827] min-h-screen">
            <Navbar />
         {/* Mobile Navbar Toggle */}
<div className="lg:hidden flex items-center justify-end px-4 py-3 bg-white dark:bg-gray-800 shadow relative">
  <h1 className="text-lg text-gray-900 dark:text-white font-semibold absolute left-4">Incident Reports</h1>
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
    className={`w-64 h-screen z-40 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
      fixed top-0 left-0
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
        <main className="flex-1 p-4 sm:p-6">
    {/* Title - Hide on mobile, show from md and up */}
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 md:mb-6 hidden md:block">
        Incident Reports
    </h2>

    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-6 mb-6 sm:mb-8">
  {/* Header Section */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-4">
    <div>
      <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">Incidents</h3>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Record and track incidents</p>
    </div>

    {/* Search & Add Button */}
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 pr-4 py-2 focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light dark:bg-gray-700 dark:text-white text-xs sm:text-sm"
          placeholder="Search clients..."
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400 dark:text-gray-500 text-sm" />
        </div>
      </div>
      <button
        onClick={() => setShowModal2(true)}
        className="bg-[#4a48d4] hover:bg-[#4A49B0] text-white px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center"
      >
        <FaPlus className="mr-2" /> Report New Incident
      </button>
    </div>
  </div>

  {/* Filter Tags */}
  <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
    {filters.map((label, index) => (
      <button
        key={index}
        onClick={() => setSelected(label)}
        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer backdrop-blur-sm ${
          selected === label
            ? "bg-primary-light text-primary dark:bg-gray-700 dark:text-white shadow-lg"
            : "bg-gray-100 hover:bg-primary-light dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light"
        }`}
      >
        {label}
      </button>
    ))}
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          {["Date", "Client", "Type", "Severity", "Reported By", "Status", "Actions"].map((col, i) => (
            <th
              key={i}
              className="px-3 sm:px-2 py-2 text-left text-[12px] sm:text-[12px] font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map((item, i) => (
            <tr key={i}>
              <td className="px-1 sm:px-1 py-3  text-gray-900 dark:text-white">
                {new Date(item.incidentDate).toLocaleDateString()}
              </td>
              <td className="px-1 sm:px-1 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white text-blue-500 flex items-center justify-center rounded-full text-xs font-bold">
                    {
                      (staffMembers.find(staff => staff._id === item.client?._id)?.fullName || "U")
                        .split(" ")
                        .map(word => word[0])
                        .join("")
                        .toUpperCase()
                    }
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    {staffMembers.find(staff => staff._id === item.client?._id)?.fullName || "Unknown"}
                  </div>
                </div>
              </td>
              <td className="px-2 sm:px-2 py-3 text-gray-900 dark:text-white">{item.incidentType}</td>
              <td className="px-2 sm:px-2 py-3 text-gray-900 dark:text-white">{item.severity}</td>
              <td className="px-2 sm:px-2 py-3 text-gray-900 dark:text-white">{item.reportedBy}</td>
              <td className="px-1 sm:px-1 py-3 text-gray-900 dark:text-white">
                <select
                  className="border lg:text-[10px] text-[8px] px-1 sm:px-1 py-1 rounded dark:bg-gray-700 dark:text-white"
                  value={item.status}
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                >
                  <option className=" lg:text-[12px] text-[8px] " value="Open">Open</option>
                  <option className=" lg:text-[12px] text-[8px] " value="Under Investigation">Under Investigation</option>
                  <option className=" lg:text-[12px] text-[8px] " value="Resolved">Resolved</option>
                </select>
              </td>
              <td className="px-2 sm:px-2 py-3 text-gray-900 dark:text-white">
                <div className="flex space-x-1 sm:space-x-2 text-sm">
                  <button className="hover:text-blue-500 transition cursor-pointer">
                    <FaEye />
                  </button>
                  <button className="hover:text-yellow-500 transition cursor-pointer">
                    <FaEdit onClick={() => handleEdit(item)} />
                  </button>
                  <button className="hover:text-red-500 cursor-pointer">
                    <FaTrash onClick={() => handleDelete(item._id)} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="text-center px-4 sm:px-6 py-24 sm:py-36 text-gray-500 dark:text-gray-400 text-sm">
              No incidents found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


{/* Modal incident  */}
      {showModal2 && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black/50 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full shadow-lg">
            <form id="add-incident-form" className="p-4" onSubmit={handleSubmit2}>
              {/* Date */}
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Incident Date
                </label>
                <input
                  type="date"
                  id="incidentDate"
                  name="incidentDate"
                  value={formData2.incidentDate}
                  onChange={handleChange2}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:outline-none"
                />
              </div>

              {/* Client */}
              <div className="mb-4">
  <label
    htmlFor="clientId"
    className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
  >
    Client
  </label>
  <select
    id="client"
    name="client"
    value={formData2.client}
    onChange={handleChange2}
    required
    className="shadow-sm border rounded w-full py-2 px-3 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:outline-none"
  >
    <option value="">Select Client</option>
    {staffMembers.map((client) => (
      <option key={client._id} value={client._id}>
        {client.fullName} 
      </option>
    ))}
  </select>

  <input
    type="hidden"
    name="clientName"
    id="incident-clientName"
    value={formData2.fullName}
  />
</div>


              {/* Incident Type */}
              <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Incident Type
                </label>
                <select
                 id="incidentType"
  name="incidentType" // ✅ Must match the state key exactly
                  value={formData2.incidentType}
                  onChange={handleChange2}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:outline-none"
                >
                  <option value="">Select Incident Type</option>
                  <option value="Fall">Fall</option>
                  <option value="Medication Error">Medication Error</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Property Damage">Property Damage</option>
                  <option value="Injury">Injury</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Severity */}
              <div className="mb-4">
                <label htmlFor="severity" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Severity
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={formData2.severity}
                  onChange={handleChange2}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:outline-none"
                >
                  <option value="">Select Severity</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Reported By */}
              <div className="mb-4">
                <label htmlFor="reportedBy" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Reported By
                </label>
                <input
                  type="text"
                  id="reportedBy"
                  name="reportedBy"
                  value={formData2.reportedBy}
                  onChange={handleChange2}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:outline-none"
                />
              </div>

              {/* Details */}
              <div className="mb-4">
                <label htmlFor="details" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Incident Details
                </label>
                <textarea
                  id="incidentDetails"
                  name="incidentDetails"
                  rows="4"
                  value={formData2.incidentDetails}
                  onChange={handleChange2}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:outline-none"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal2(false)}
                  className="modal-close bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Report Incident
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
