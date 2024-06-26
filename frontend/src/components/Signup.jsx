import { useState } from 'react';
import axios from 'axios';
import Footer from '../partials/Footer';
import Header from '../partials/Header';
import srmuLogo2 from '../assets/srmu-logo2.webp';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {
  const [singleUserFormData, setSingleUserFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const userData = JSON.parse(localStorage.getItem('user'));
  
  const [multipleUsersFormData, setMultipleUsersFormData] = useState({
    userDataFile: null,
  });
  const [error, setError] = useState(null);
  const [isSingleUser, setIsSingleUser] = useState(true);
  const navigate = useNavigate();

  const handleSingleUserChange = (e) => {
    const { name, value } = e.target;
    setSingleUserFormData({ ...singleUserFormData, [name]: value });
  };
  
  const handleMultipleUsersFileChange = (e) => {
    const file = e.target.files[0];
    setMultipleUsersFormData({ ...multipleUsersFormData, userDataFile: file });
  };

  const handleSubmitSingleUser = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/signup', singleUserFormData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        });

        toast.success('User created', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });

        navigate('/edit-profile');

        console.log(response.data);
    } catch (error) {
      console.error('Error in signup:', error);
      setError('Failed to signup. Please try again later.');
    }
  };

  const handleSubmitMultipleUsers = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('userDataFile', multipleUsersFormData.userDataFile);
  
      console.log('FormData:', multipleUsersFormData.userDataFile);
  
      const response = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/api/bulk-user-upload', data, {
        withCredentials: true,
        headers: {
          'content-type': 'multipart/form-data',
          'Access-Control-Allow-Credentials': true,
        },
      });
  
      toast.success('Users created', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
  
      navigate('/');
  
      console.log(response.data);
    } catch (error) {
      console.error('Error in bulk user upload:', error);
      setError('Failed to upload users. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col">
            <div className="m-3 top-0 left-0 right-0 mx-auto rounded-full overflow-hidden -mt-10" style={{ height: "200px", width: "200px" }}>
              <img src={srmuLogo2} alt="SRMU Logo" className="object-cover min-h-full min-w-full" style={{ borderRadius: '100%' }} />
            </div>
            <h2 className="text-2xl mb-4 font-semibold text-center">Signup</h2>
            {error && <div className="text-red-500 text-sm mb-4 mx-auto">{error}</div>}
            {userData.role === 'admin' || userData.role === 'teacher' ? (
              <div className="mb-4 flex justify-center items-center">
                <button
                  className={`py-2 px-4 rounded mr-4 focus:outline-none ${isSingleUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setIsSingleUser(true)}
                >
                  Single User
                </button>
                <button
                  className={`py-2 px-4 rounded focus:outline-none ${!isSingleUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setIsSingleUser(false)}
                >
                  Multiple Users
                </button>
              </div>
            ) : (
              <p className="text-red-500 text-sm mb-4 mx-auto">You do not have permission to upload multiple users.</p>
            )}
            {isSingleUser ? (
              <form onSubmit={handleSubmitSingleUser} id="signupFormSingleUser">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                  <input type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" id='emain' value={singleUserFormData.email} onChange={handleSingleUserChange} required />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                  <input type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="password" id='password' value={singleUserFormData.password} onChange={handleSingleUserChange} required />
                </div>
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                  <input type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="confirmPassword" id='confirmPassword' value={singleUserFormData.confirmPassword} onChange={handleSingleUserChange} required />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Signup</button>
              </form>
            ) : (
              <form onSubmit={handleSubmitMultipleUsers} id="signupFormMultipleUsers" encType="multipart/form-data">
                {/* Multiple users upload form */}
                <div className="mb-4">
                  <label htmlFor="userDataFile" className="block text-gray-700 text-sm font-semibold mb-2">Upload User Data (Excel file)</label>
                  <input type="file" className="form-input" name="userDataFile" id='userDataFile' onChange={handleMultipleUsersFileChange} required />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Upload Users</button>
              </form>
            )}
            <p className="mt-3 text-center text-sm">Already have an account? <a href="/login" className="text-blue-500 hover:text-blue-700">Login Here!</a></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;