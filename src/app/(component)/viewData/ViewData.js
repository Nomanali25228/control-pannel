import { useAuth } from '@/app/context/AuthContext';
import React, { useContext, useState } from 'react'

const data = {
  Name: 'Noman',
  Email: 'noman@example.com',
  Phone: '+92 300 1234567',
  Address: 'Lahore, Pakistan',
  Profession: 'Web Developer',
  s: 'Noman',
  sw: 'noman@example.com',
  d: '+92 300 1234567',
  f: 'Lahore, Pakistan',
  h: 'Web Developer',
  extra1: 'More info 1',
  extra2: 'More info 2',
  extra3: 'More info 3',
  extra4: 'More info 4',
  extra5: 'More info 5',
  extra6: 'More info 6',
}

const ViewData = () => {
const {showmodal, setShowModal} = useAuth(); // Get showmodal and setShowModal from AuthContext
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-[#ffffff57] backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-xl p-10 max-h-[90vh] overflow-hidden">

        {/* ❌ Close Button */}
        <button
  onClick={() => setShowModal(false)}
  className="absolute top-4 right-4 w-10 h-10 cursor-pointer rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 hover:rotate-90 transition-all duration-300 flex items-center justify-center shadow-md"
  aria-label="Close"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>


        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">User Details</h2>

        {/* Scrollable content box */}
        <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
          {Object.entries(data).map(([field, value]) => (
            <div key={field} className="flex justify-between border-b pb-3 text-lg">
              <span className="text-gray-600 font-semibold">{field}</span>
              <span className="text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ViewData
