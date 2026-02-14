import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
   <div className="sticky top-0 z-10 w-full bg-gray-100 py-3 mb-6">
     <p className="text-sm text-gray-600 text-center px-4">
       You searched for :{" "}
       <span className="text-blue-600 font-medium break-all">
         {location.pathname}
       </span>
     </p>
   </div>
      <h1 className="text-9xl font-bold ">404</h1>
      <h2 className="text-3xl font-semibold mt-4 text-gray-800">Page Not Found</h2>
      <p className="text-gray-500 mt-2 mb-6">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition duration-200"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;