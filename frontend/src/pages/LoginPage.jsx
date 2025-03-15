import React from 'react';
import { useNavigate } from 'react-router-dom';
import family from '../assets/family.png';
import customer from '../assets/customers.png';
import insurer from '../assets/guidance.jpg'; // Import the insurer image

function LoginPage() {
  const navigate = useNavigate();

  const handlePatientLogin = () => {
    localStorage.setItem('user', 'patient'); // Mock login
    navigate('/signup'); // Redirect after login
  };

  const handleInsurerLogin = () => {
    localStorage.setItem('user', 'insurer'); // Mock login
    navigate('/signup'); // Redirect after login
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center p-0 m-0">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center w-full max-w-7xl mt-10 rounded-lg">
        {/* Logo Section */}
        <div className="text-2xl font-bold">MyInsure</div>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-500">
            Home
          </a>
          <a href="#" className="hover:text-blue-500">
            About
          </a>
          <a href="#" className="hover:text-blue-500">
            Services
          </a>
          <a href="#" className="hover:text-blue-500">
            Contact
          </a>
        </div>

        {/* Contact Now Button */}
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 border border-black">
          Contact Now
        </button>
      </nav>

      {/* Main Content Section */}
      <div className="flex flex-wrap md:flex-nowrap justify-center items-center px-10 py-12 gap-6 max-w-7xl w-full">
        {/* Div1 */}
        <div className="w-full md:w-1/2 space-y-4">
          {/* First Div inside Div1 */}
          <div className="h-[280px] bg-white p-8 rounded-lg shadow-md h-[270px] flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold ml-10 text-gray-800 leading-tight">
              Top <span className="text-gray-500">Insurance</span> <br />
              Solutions
            </h1>
            <button
  onClick={handlePatientLogin}
  className="mt-6 px-4 py-3 w-full text-lg font-semibold bg-white text-black border border-black rounded-[20px] transition-colors duration-300 hover:bg-black hover:text-white"
>
  Login as Patient
</button>


          </div>

          {/* Second Div inside Div1 - Customer Image and Text */}
          <div className=" h-[230px] bg-white p-6 rounded-lg shadow-md flex flex-col items-center h-[220px] justify-center">
            <img
              src={customer}
              alt="Customer"
              className="w-full h-full object-contain rounded-lg shadow-md mb-4"
            />
            <p className="text-lg font-semibold">
              <span className="text-gray-500 text-xl">20K+</span>{' '}
              <span className="text-black text-xl">customers worldwide</span>
            </p>
          </div>
        </div>

        {/* Div2 with Background Image */}
        <div
          className="h-[560px] w-[500px] rounded-lg shadow-md bg-cover bg-center flex-shrink-0"
          style={{ backgroundImage: `url(${family})` }}
        ></div>
      </div>

      {/* Insurer Section */}
      <div className="flex flex-wrap md:flex-nowrap justify-center items-center px-10 py-12 gap-6 max-w-7xl w-full">
        {/* Image Div */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={insurer}
            alt="Insurer"
            className="rounded-lg shadow-md w-full h-[400px] object-cover"
          />
        </div>

        {/* Text Div */}
        <div className="w-full md:w-1/2 space-y-4 bg-white p-6 rounded-lg shadow-md h-[400px] flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Ensuring You Receive{' '}
            <span className="text-gray-500">Expert Guidance</span>
          </h2>
          <p className="text-gray-700 text-lg">
            Our team of experienced professionals is dedicated to providing you
            with personalized insurance solutions tailored to your unique needs.
            We strive to offer expert guidance to help you make informed
            decisions and secure the best coverage possible.
          </p>
        </div>
      </div>

      {/* Manage Insurance Section */}
      <div className="w-full max-w-7xl px-10 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold text-gray-800">
            Manage Insurance <span className="text-gray-500">Effortlessly</span>
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Access claims, verify details, and support policyholders
            efficiently.
          </p>
          <button
            onClick={handleInsurerLogin}
            className="mt-6 px-6 py-3 text-lg font-semibold bg-black text-white rounded-[20px] border border-black hover:bg-gray-800 hover:border-gray-700 transition"
          >
            Login as Insurer
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
