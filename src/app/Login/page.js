'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  FaThLarge,
  FaUser,
  FaClipboardList,
  FaExclamationTriangle,
  FaUsers,
  FaGraduationCap,
  FaShieldAlt,
  FaUserCog,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loader immediately

    try {
      const res = await axios.post('https://control-panel-backend-eta.vercel.app/user/login', {
        email,
        password,
      });

      if (res.status === 200) {
        const { token, user } = res.data;
        login(token, user);
        setMsg('Login successful!');
        toast.success(res.data.msg);

        setTimeout(() => {
          router.push('/Dashboard');
        }, );
      }
    } catch (err) {
      setLoginError(true);
      setMsg(err.response?.data?.msg || 'Login failed');
      toast.error(err.response?.data?.msg || 'Login failed');
      setIsLoading(false); // Stop loader on error
    }
  };

  return (
    <div className="flex bg-[#111827]">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 shadow h-screen sticky top-0">
        <nav className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Navigation</p>
          </div>
          <div className="flex-1 px-2 py-4 overflow-y-auto">
            <SidebarItem icon={<FaThLarge />} label="Dashboard" />
            <SidebarItem icon={<FaUser />} label="Client Management" />
            <SidebarItem icon={<FaClipboardList />} label="Care Planning" />
            <SidebarItem icon={<FaExclamationTriangle />} label="Incident Reports" />
            <SidebarItem icon={<FaUsers />} label="HR Management" />
            <SidebarItem icon={<FaGraduationCap />} label="Training" />
            <SidebarItem icon={<FaShieldAlt />} label="Compliance" />
            <SidebarItem icon={<FaUserCog />} label="User Management" />
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#EEEEFF] flex items-center justify-center text-[#4A49B0] font-medium">A</div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@carehome.com</p>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-[#111827] dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white dark:text-primary-light">Care Home Management</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {loginError && (
                <div className="mb-4 text-red-500 text-sm">{msg}</div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="cursor-pointer h-4 w-4 text-primary border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Remember me</label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center cursor-pointer items-center bg-[#4b4aac] hover:bg-[#474588] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
                <p>Hint: Use email "butt60902@gmail.com" and password "Test@123"</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label }) => (
  <a href="#" className="side-menu-item flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-light hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary-light rounded-md transition-colors">
    <span className="mr-3 text-gray-500 dark:text-gray-400">{icon}</span>
    {label}
  </a>
);

export default Page;
