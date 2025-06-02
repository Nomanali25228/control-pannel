import React from 'react'

const Footer = () => {
  return (
    <>
    <div>
    <footer className="bg-[#111827] shadow ">
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 ">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {/* Care Home Management System © 2023 */}
        </p>
    </div>
</footer>
</div>
    <div>
        <footer className="bg-white dark:bg-gray-800 shadow ">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Care Home Management System © 2023
            </p>
        </div>
    </footer>
    </div>
    </>
  )
}

export default Footer
