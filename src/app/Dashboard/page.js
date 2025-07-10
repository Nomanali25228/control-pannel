"use client";
import React, { useState } from 'react';
import Navbar from '../(component)/navbar/Navbar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import OccupancyChart from "@/app/(component)/occupancyChart/OccupancyChart";
import {
  FaThLarge,
  FaUser,
  FaClipboardList,
  FaExclamationTriangle, // ✅ Keep only once
  FaUsers,
  FaGraduationCap,
  FaShieldAlt,
  FaUserCog,
  FaClipboardCheck,
  FaExclamationCircle,
  FaUserPlus,
  FaFileMedical,
  FaUserTie,
  FaCalendarAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { HiUsers } from "react-icons/hi2";
import Link from 'next/link';
import { inc } from 'nprogress';
import { toast } from 'react-toastify';



const Page = () => {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: <FaThLarge />, label: "Dashboard", href: "/Dashboard", active: true },
    { icon: <FaUser />, label: "Client Management", href: "/Client-Management" },
    { icon: <FaClipboardList />, label: "Care Planning", href: "/Care-Planning" },
    { icon: <FaExclamationTriangle />, label: "Incident Reports", href: "/Incident-Reports" },
    { icon: <FaUsers />, label: "HR Management", href: "/HR-Management" },
    { icon: <FaGraduationCap />, label: "Training", href: "/Training" },
    { icon: <FaShieldAlt />, label: "Compliance", href: "/Compliance" },
    { icon: <FaUserCog />, label: "User Management", href: "/User-Management" },
  ];
  // care plane ------------------------------------------------------------------------------------------------
  const [showFormCare, setShowFormCare] = useState(false);
 const [formDataCare, setFormDataCare] = useState({
   client: '',
   planType: '',
   creationDate: '',
   reviewDate: '',
   carePlanDetails: ''
 });
  
   const handleChangeCare = (e) => {
  const { name, value } = e.target;
  setFormDataCare(prev => ({ ...prev, [name]: value }));
};
        const [staffMembers, setStaffMembers] = useState([]); // For HR/staff members

  // Optional: Handle form submit
  const handleSubmitCare = (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  

  axios.post(`https://control-panel-backend-eta.vercel.app/carePlanning`, formDataCare, config)
    .then(res => {
      setFormDataCare({ client: '',
        planType: '',
        creationDate: '',
        reviewDate: '',
        carePlanDetails: ''});
      setShowFormCare(false);
toast.success("Add Suceessfuly")

    })
    
    .catch(err => {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || 'An error occurred');
      toast.error(err.response?.data?.msg || 'An error occurred')
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




// incidient -------------------------------------------------------------------------------------------------------------
const [inci, setinci] = useState([]);
useEffect(() => {
  const token = localStorage.getItem('token');
  axios.get('https://control-panel-backend-eta.vercel.app/client', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  .then(response => {
    setinci(response.data.clients);  // Staff data set
    setMessage('Staff fetched successfully');
  })
  .catch(error => {
    setError(error.response?.data?.msg || 'Failed to fetch staff');
  });
}, []);
 const [sixmont, setsixmont] = useState(0);
 const [open, setopen] = useState(0);
useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://control-panel-backend-eta.vercel.app/incident/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setsixmont(res.data.recentIncidentsCount);
        setopen(res.data.openIncidentsCount);
        setMessage('Incidents fetched successfully');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch incidents');
      }
    };
    fetchIncidents();
  }, []);
  const [incidentData, setIncidentData] = useState([]);

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

const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2((prev) => ({ ...prev, [name]: value }));
  };


  
const handleSubmit2 = (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  

  axios.post(`https://control-panel-backend-eta.vercel.app/incident/`, formData2, config)
    .then(res => {
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
    .then(res => {
      console.log("Updated Client Data:", res.data.incidents);
 setsixmont(res.data.recentIncidentsCount);
        setopen(res.data.openIncidentsCount);

    })
    .catch(err => {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || 'An error occurred');
      toast.error(err.response?.data?.msg || 'An error occurred')
    });
};



// add staf -------------------------------------------------------------------------------------------------------------






const [totalStaffno, setTotalStaffno] = useState(0);
const [error, setError] = useState(null); // optional error state

useEffect(() => {
  const fetchHR0 = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://control-panel-backend-eta.vercel.app/hr", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalStaffno(res.data.totalstaff);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch HR data");
    }
  };
  fetchHR0();
}, []);
     const [StaffData, setStaffData] = useState([]);




 const [showModal3, setShowModal3] = useState(false);
   const [formData3, setFormData3] = useState({
     name: '',
     email: '',
     position: '',
     department: '',
     startDate: '',
   });


  const handleChange3 = (e) => {
    const { name, value } = e.target;
    setFormData3((prev) => ({ ...prev, [name]: value }));
  };


const handleSubmit3 = (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
    const { name,  email, position, department, startDate, } = formData3;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
    const payload = { fullName:name, email:email, position:position, department:department, startDate:startDate };


  axios.post(`https://control-panel-backend-eta.vercel.app/hr`, payload, config)
    .then(res => {
     setFormData2({
          incidentDate: '',
          incidentType: '',
          severity: '',
          reportedBy: '',
          incidentDetails:'',
          client:"",
          status: 'Open',
        });
      setShowModal3(false);
            setFormData3({ name: '', department: '', email:"", position: '', startDate: '' });

toast.success("Add successfuly")
      return axios.get('hhttps://control-panel-backend-eta.vercel.app/hr', config);
    })
    .then(res => {
      setStaffData(res.data.allHr);
 setTotalStaffno(res.data.totalstaff);
    })
    .catch(err => {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || 'An error occurred');
      toast.error(err.response?.data?.msg || 'An error occurred')
    });
};









// add client  --------------------------------------------------------------------------------------------------------------

  const [showModal, setShowModal] = useState(false);
const [totalClients, setTotalClients] = useState(0);
const [availableRooms, setAvailableRooms] = useState(0);
const [occupiedRooms0, setOccupiedRooms0] = useState(0);
const [occupancyPercentage,setOccupancyPercentage] = useState(0)
 useEffect(() => {
   const fetchHR = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("https://control-panel-backend-eta.vercel.app/client", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTotalClients(res.data.totalClients);
    setAvailableRooms(res.data.totalAvailableRooms);
    setOccupiedRooms0(res.data.currentOccupancy);
    setOccupancyPercentage(res.data.occupancyPercentage)
    
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch HR data");
    }
  };
  fetchHR();
  }, []);









  // Form data state
  
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

  // Optional: Handle form submit
  const handleSubmit = (e) => {
  e.preventDefault();
  const { name, age, room, careType, admitDate } = formData;

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const payload = {
    fullName: name,
    age: age,
    roomNumber: room,
    careType: careType,
    admissionDate: admitDate
  };

  axios.post(`https://control-panel-backend-eta.vercel.app/client`, payload, config)
    .then(res => {
      setFormData({ name: '', age: '', room: "", careType: '', admitDate: '' });
      setShowModal(false);
toast.success("Add successfuly")

      return axios.get('https://control-panel-backend-eta.vercel.app/client', config);
    })
    .then(res => {
      console.log("Updated Client Data:", res.data.clients);
      setTotalClients(res.data.totalClients);
      setAvailableRooms(res.data.totalAvailableRooms);
      setOccupiedRooms0(res.data.currentOccupancy);
      setOccupancyPercentage(res.data.occupancyPercentage);
    })
    .catch(err => {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || 'An error occurred');
      toast.error(err.response?.data?.msg || 'An error occurred')
    });
};

  // shedule staff-------------------------------------------------------------------------------------------------------------------

     const [StaffData2, setStaffData2] = useState([]);


const [showForm4, setShowForm4] = useState(false);
  const [formData4, setFormData4] = useState({
    staffName: '',
    trainingType: '',
    completionDate: '',
    expiryDate: '',
    notes: '',
  });

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
    },
  };

  const payload = {
    staffMember: staffName,  // This should be the MongoDB _id of the staff
    trainingType,
    completionDate,
    expiryDate,
    notes,
  };

  axios.post(`https://control-panel-backend-eta.vercel.app/training`, payload, config)
    .then(res => {
      setFormData4({ staffName: '', trainingType: '', completionDate: '', expiryDate: '', notes: '' });
      setShowForm4(false);
toast.success("Add successfuly")
    })
 
    .catch(err => {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || 'An error occurred');
      toast.error(err.response?.data?.msg || 'An error occurred')
    });
};



        const [staffMembers2, setStaffMembers2] = useState([]); // For HR/staff members

useEffect(() => {
  const token = localStorage.getItem('token');
  axios.get('https://control-panel-backend-eta.vercel.app/hr', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  .then(response => {
    setStaffMembers2(response.data.allHr);  // Staff data set
  })
  .catch(error => {
    setError(error.response?.data?.msg || 'Failed to fetch staff');
  });
}, []);

// user management-----------------------------------------------------------------------------------------------

 const [StaffData6, setStaffData6] = useState([]);


const [showForm6, setShowForm6] = useState(false);
  const [formData6, setFormData6] = useState({
    name: '',
    email: '',
    role: 'Client',
    password: '',
    confirmPassword: '',
  });


  const handleChange6 = (e) => {
    const { name, value } = e.target;
    setFormData6(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  const [error6, setError6] = useState('');


const handleSubmit6 = (e) => {
  e.preventDefault();
  const { name, email, role, password, confirmPassword } = formData6;
  if (password !== confirmPassword) {
    setError6('Passwords do not match');
    return;
  }
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const payload = {
    fullName: name,
    email:email,
    role:role,
    ...(password && { password }),
  };

  axios.post('https://control-panel-backend-eta.vercel.app/user/signup', { ...payload, confirmPassword }, config)
    .then(res => {
       setFormData6({ name: '', email: '', role: 'Client', password: '', confirmPassword: '' });
      setShowForm6(false);
toast.success("Add successfuly")

    })
 
    .catch(err => {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || 'An error occurred');
            set(err.response?.data?.msg || 'An error occurred');
            toast.error(err.response?.data?.msg || 'An error occurred')

    });
};





































    //  ---------------------------------------------------------------------------------------------------------
      const { user, logout } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (!user) router.push('/Login');
    }, [user,router]);
  
    if (!user) return null;
  return (
<div className="bg-[#111827] min-h-screen">
      <Navbar />

    {/* Mobile Header - visible only on screens < lg */}
<div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow">
  <h1 className="text-lg text-gray-900 dark:text-white font-semibold">Dashboard</h1>
  <button
    onClick={() => setSidebarOpen(!sidebarOpen)}
    className="text-gray-800 dark:text-white text-2xl"
  >
    {sidebarOpen ? <FaTimes /> : <FaBars />}
  </button>
</div>

<div className="flex flex-1">
  {/* Sidebar - responsive behavior */}
  <aside
    className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:block`}
  >
    <nav className="flex flex-col h-full">
      {/* Navigation Title */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center lg:block">
        <p className="text-sm text-gray-500 dark:text-gray-400">Navigation</p>
      </div>

      {/* Nav Items */}
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
            onClick={() => setSidebarOpen(false)} // close on mobile
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#EEEEFF] flex items-center justify-center text-[#4A49B0] font-medium">
            {user.fullName
              .split(" ")
              .map(word => word[0])
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

  
        {/* Main Dashboard Content */}
        <main className="flex-1 bg-gray-100 overflow-y-hidden dark:bg-gray-900 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 hidden md:block">Dashboard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary-light dark:bg-gray-700 text-primary dark:text-primary-light">
                  <HiUsers className="text-xl text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</p>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{totalClients}</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary-light dark:bg-gray-700 text-primary dark:text-primary-light">
                  <FaUsers className="text-xl text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff Members</p>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{totalStaffno}</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                  <FaExclamationCircle className="text-xl text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Open Incidents</p>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{open}</p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
                  <FaClipboardCheck className="text-xl text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Due Today</p>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">0</p>
                </div>
              </div>
            </div>
          </div>


          {/* Quick Actions */}


          {/* <div className="mt-8"> */}
          <div className="bg-white mt-8 dark:bg-gray-800 p-6 mb-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Add Client */}
            <button
        onClick={() => setShowModal(true)}
        className="cursor-pointer flex flex-col items-center p-4  p\ bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-primary-light dark:hover:bg-gray-600 transition-colors"
      >
        <div className="p-2 rounded-full bg-primary-light dark:bg-gray-600 text-primary dark:text-primary-light mb-2">
          <FaUserPlus className="text-xl text-white" />
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">Add Client</span>
      </button>
              
              {/* New Care Plan */}
              <button
        onClick={() => setShowFormCare(true)}
        className="cursor-pointer flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-primary-light dark:hover:bg-gray-600 transition-colors"
      >
        <div className="p-2 rounded-full bg-primary-light dark:bg-gray-600 text-primary dark:text-primary-light mb-2">
          <FaFileMedical className="text-xl text-white" />
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">New Care Plan</span>
      </button>

              {/* Report Incident */}
 <button
        onClick={() => setShowModal2(true)}
        className="cursor-pointer flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-primary-light dark:hover:bg-gray-600 transition-colors"
      >
        <div className="p-2 rounded-full bg-primary-light dark:bg-gray-600 text-primary dark:text-primary-light mb-2">
          <FaExclamationTriangle className="text-xl text-white" />
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">Report Incident</span>
      </button>

              {/* Add Staff */}
             <button
        onClick={() => setShowModal3(true)}
        className="cursor-pointer flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-primary-light dark:hover:bg-gray-600 transition-colors"
      >
        <div className="p-2 rounded-full bg-primary-light dark:bg-gray-600 text-primary dark:text-primary-light mb-2">
          <FaUserTie className="text-xl text-white" />
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">Add Staff</span>
      </button>
              {/* Staff Schedule */}
              <button onClick={() => setShowForm4(true)} className=" cursor-pointer flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-primary-light dark:hover:bg-gray-600 transition-colors" data-module="hr">
                <div className="p-2 rounded-full bg-primary-light dark:bg-gray-600 text-primary dark:text-primary-light mb-2">
                  <FaCalendarAlt size={20} className=' text-xl text-white' />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Staff Schedule</span>
              </button>
              {/* User Management */}
              <button onClick={()=>setShowForm6(true)} className=" cursor-pointer flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-primary-light dark:hover:bg-gray-600 transition-colors" data-module="users">
                <div className="p-2 rounded-full bg-primary-light dark:bg-gray-600 text-primary dark:text-primary-light mb-2">
                  <FaUserCog size={20} className=' text-xl text-white' />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">User Management</span>
              </button>
            </div>
          </div>
<div>
      {/* Add Client Button */}
      

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0   bg-black/50  flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-8">
            <form onSubmit={handleSubmit} className="p-2">
              <div className="mb-2">
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



   {/* Modal care plane form */}
     {showFormCare && (
        <div className="fixed inset-0  bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-lg">
            <form id="add-care-plan-form" className="p-4" onSubmit={handleSubmitCare}>
              {/* Client ID */}
              <div className="mb-4">
                <label htmlFor="clientId" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Client
                </label>
                <select
                  id="client"
                  name="client"
                  value={formDataCare.client}
                  onChange={handleChangeCare}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Client</option>
                    {staffMembers  // Staff data set
.map((client) => (
      <option key={client._id} value={client._id}>
        {client.fullName} 
      </option>
    ))}
                 
                </select>
                <input type="hidden" name="clientName" id="clientName" value={formDataCare.client.fullName} />
              </div>

              {/* Plan Type */}
              <div className="mb-4">
                <label htmlFor="planType" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Plan Type
                </label>
                <select
                  id="planType"
                  name="planType"
                  value={formDataCare.planType}
                  onChange={handleChangeCare}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Plan Type</option>
                  <option value="Nursing">Nursing</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Mobility">Mobility</option>
                  <option value="Medication">Medication</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Social">Social</option>
                </select>
              </div>

              {/* Creation Date */}
              <div className="mb-4">
                <label htmlFor="createDate" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Creation Date
                </label>
                <input
                  id="creationDate"
                  name="creationDate"
                  type="date"
                  value={formDataCare.creationDate}
                  onChange={handleChangeCare}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Review Date */}
              <div className="mb-4">
                <label htmlFor="reviewDate" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Review Date
                </label>
                <input
                  id="reviewDate"
                  name="reviewDate"
                  type="date"
                  value={formDataCare.reviewDate
                  }
                  onChange={handleChangeCare}
                  required
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Care Plan Details */}
              <div className="mb-4">
                <label htmlFor="details" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Care Plan Details
                </label>
                <textarea
                  id="carePlanDetails"
                  name="carePlanDetails"
                  rows="4"
                  value={formDataCare.carePlanDetails}
                  onChange={handleChangeCare}
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowFormCare(false)}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Create Care Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    {inci.map((client) => (
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
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowModal3(false)}
                className="modal-close bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
              >
                Add Staff Member
              </button>
            </div>
          </form>
        </div>
      )}
 {/* training----------------------------------------------------------------------------- */}

{showForm4 && (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/50 bg-opacity-50">
        <form
          onSubmit={handleSubmit4}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-lg"
        >
          {/* Staff Member */}
         <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Staff Member
  </label>
  <select
  name="staffName"
  value={formData4.staffName}
  onChange={handleChange4}
  required
  className="w-full rounded border py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
>
  <option value="">Select Staff Member</option>
  {staffMembers2.map((staff) => (
    <option key={staff._id} value={staff._id}>
      {staff.fullName}
    </option>
  ))}
</select>

</div>


          {/* Training Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Training Type
            </label>
            <select
              name="trainingType"
              value={formData4.trainingType}
              onChange={handleChange4}
              required
              className="w-full rounded border py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            >
              <option value="">Select Training Type</option>
              <option  value="First Aid">First Aid</option>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Completion Date
            </label>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Expiry Date
            </label>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData4.notes}
              onChange={handleChange4}
              rows="4"
              className="w-full rounded border py-2 px-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setShowForm4(false)}
              className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2"
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
    
{/* user management -------------------- */}
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







    </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
            {/* Facility Occupancy */}
            <div className="bg-white dark:bg-[#1c2434] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Facility Occupancy
              </h3>
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary dark:text-white">{occupancyPercentage}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Occupancy</p>
                </div>
                <OccupancyChart occupancyPercentage={occupancyPercentage} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="text-center p-2 bg-gray-100 dark:bg-[#273142] rounded">
                  <p className="text-2xl font-semibold text-gray-800 dark:text-white">{occupiedRooms0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Occupied Rooms</p>
                </div>
                <div className="text-center p-2 bg-gray-100 dark:bg-[#273142] rounded">
                  <p className="text-2xl font-semibold text-gray-800 dark:text-white">{availableRooms}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Available Rooms</p>
                </div>
              </div>
            </div>

            {/* Incident Trends */}
            <div className="bg-white dark:bg-[#1c2434] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Incident Trends</h3>
              <div className="h-48">
                <canvas id="incidentsChart"></canvas>
              </div>
              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Total: <span id="total-incidents">{sixmont}</span> incidents in last 6 months
                </span>
                <Link href="/Incident-Reports" className="text-primary dark:text-white font-medium" data-module="incident">
                  View details
                </Link>
              </div>
            </div>

            {/* Staff Training Status */}
            <div className="bg-white dark:bg-[#1c2434] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Staff Training Status</h3>
              <div className="h-48">
                <canvas id="trainingChart"></canvas>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded bg-green-500 inline-block"></span>
                    <span className="text-white">Up to date</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded bg-yellow-400 inline-block"></span>
                    <span className="text-white">Expiring soon</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded bg-red-500 inline-block"></span>
                    <span className="text-white">Expired</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <a href="#" className="text-sm text-primary dark:text-white font-medium" data-module="training">
                  View all certifications
                </a>
              </div>
            </div>
          </div>
          {/* Core Modules///////////// */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 my-6">Core Modules</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Client Management */}
              <Link href="/Client-Management">
              <div className=" hover:border-white module-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-primary dark:hover:border-primary-light" data-module="client">
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary-light dark:bg-gray-700 rounded-lg">
                    <FaUser className="text-lg text-primary dark:text-primary-light text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Client Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage client records and information</p>
                  </div>
                </div>
              </div>
</Link>
              {/* Care Planning */}
              <Link href="/Care-Planing">
              <div className=" hover:border-white module-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-primary dark:hover:border-primary-light" data-module="care">
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary-light dark:bg-gray-700 rounded-lg">
                    <FaClipboardList className="text-lg text-primary dark:text-primary-light text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Care Planning</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage care plans</p>
                  </div>
                </div>
              </div>
</Link>

              {/* Incident Reports */}
              <Link href="/Incident-Reports">
              <div className=" hover:border-white module-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-primary dark:hover:border-primary-light" data-module="incident">
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary-light dark:bg-gray-700 rounded-lg">
                    <FaExclamationTriangle className="text-lg text-primary dark:text-primary-light text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Incident Reports</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Record and track incidents</p>
                  </div>
                </div>
              </div>
</Link>

<Link href="/HR-management">
              {/* HR Management */}
              <div className="hover:border-white module-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-primary dark:hover:border-primary-light" data-module="hr">
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary-light dark:bg-gray-700 rounded-lg">
                    <FaUsers className="text-lg text-primary dark:text-primary-light text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">HR Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage staff and schedules</p>
                  </div>
                </div>
              </div>
</Link>
              {/* Training */}
              <Link  href="Training">
              <div className=" hover:border-white module-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-primary dark:hover:border-primary-light" data-module="training">
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary-light dark:bg-gray-700 rounded-lg">
                    <FaGraduationCap className="text-lg text-primary dark:text-primary-light text-white" />
                  </div>
                  <div className="ml-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Training</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track staff training and certifications</p>
                  </div>
                </div>
              </div>
</Link>
              {/* Compliance */}
              <Link href="Compliance">
              <div className=" hover:border-white module-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-primary dark:hover:border-primary-light" data-module="compliance">
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary-light dark:bg-gray-700 rounded-lg">
                    <FaShieldAlt className="text-lg text-primary dark:text-primary-light text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Compliance</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monitor regulatory compliance</p>
                  </div>
                </div>
              </div>
              </Link>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Page;
