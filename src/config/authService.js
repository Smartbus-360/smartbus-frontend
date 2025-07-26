import axios from 'axios';

// const API_URL = 'http://localhost:3000//api/admin/';
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/admin`;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

// Store the JWT token and user information in sessionStorage
export const setTokenAndUser = ({ token, user }) => {
  const expiresAt = Date.now() + 60 * 60 * 1000; // Set expiration to 60 mins from now
  sessionStorage.setItem('authToken', token);
  sessionStorage.setItem('userId', user.id);
  sessionStorage.setItem('expiresAt', expiresAt.toString()); // Store expiration timestamp
  sessionStorage.setItem('instituteId', user.instituteId || '');
  sessionStorage.setItem('userEmail', user.email || '');
  sessionStorage.setItem('userUsername', user.username || '');
  sessionStorage.setItem('instituteName', user.instituteName || '');
  sessionStorage.setItem('isAdmin', user.isAdmin || '');
  sessionStorage.setItem('userProfilePic', user.profilePicture || '');
  sessionStorage.setItem('phone_number', user.phone || ''); 
  sessionStorage.setItem('full_name', user.full_name || '');
  sessionStorage.setItem('role', user.role || '');
  // console.log('Stored token and expiresAt:', sessionStorage.getItem('authToken'), sessionStorage.getItem('expiresAt'));
};


// Get the stored token from sessionStorage and check expiration
export const getToken = () => {
  const token = sessionStorage.getItem('authToken');
  const expiresAt = parseInt(sessionStorage.getItem('expiresAt'), 10);

  // Check if the token has expired
  if (Date.now() > expiresAt) {
    removeTokenAndUser();
    return null;
  }
  return token;
};

// Get user information from sessionStorage
export const getUser = () => {
  return {
    userId: sessionStorage.getItem('userId'),
    instituteId: sessionStorage.getItem('instituteId'),
    email: sessionStorage.getItem('userEmail'),
    username: sessionStorage.getItem('userUsername'),
    instituteName: sessionStorage.getItem('instituteName'),
    isAdmin: sessionStorage.getItem('isAdmin'),
    profile_picture: sessionStorage.getItem('userProfilePic'),
    phone_number: sessionStorage.getItem('phone_number'),
    full_name: sessionStorage.getItem('full_name'),
    role: sessionStorage.getItem('role')
  };
};

// Remove the token and user info from sessionStorage on logout
export const removeTokenAndUser = () => {
  sessionStorage.clear();
  localStorage.clear();

};

// Check if the user is authenticated by verifying the token exists and is not expired
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Authenticate the user by sending credentials to the server
// export const login = async (email, password) => {
//   try {
//       const response = await axiosInstance.post('signin', {
//           email, password, client_id: CLIENT_ID, client_secret: CLIENT_SECRET
//       });
//       console.log('Login response:', response);
//       const data = response.data;
//       if (!response.status === 200) return { message: data.error || 'Login failed' };

//       const { accessToken, user } = data;
//       setTokenAndUser({ token: accessToken, user });
//       return { ok: true, message: 'Login successful', token: accessToken };
//   } catch (error) {
//       return { ok: false, message: error.message };
//   }
// };
export const login = async (email, password) => {
  try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/signin`, {
          email, password, client_id: CLIENT_ID, client_secret: CLIENT_SECRET
      });

      const data = response.data;

      if (response.status !== 200) {
          return { ok: false, message: data.message || 'Login failed' };
      }

      const { accessToken, user } = data;
      setTokenAndUser({ token: accessToken, user });
      return { ok: true, message: 'Login successful', token: accessToken };

  } catch (error) {
      console.error('Login error:', error);
      
      return { 
          ok: false, 
          message: error.response?.data?.message || 'An unexpected error occurred' 
      };
  }
};
  
export const logoutUser = () => {
  sessionStorage.removeItem("authToken");

  // Remove refresh token cookie (only if NOT HttpOnly)
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  alert("Your session has expired. Please log in again.");
  // Redirect to login page
  window.location.href = "/";
};

