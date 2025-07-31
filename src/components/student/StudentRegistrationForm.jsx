import React, { useState, useEffect } from 'react';
import { TextField, Button, Snackbar, Alert, Box, CircularProgress,IconButton,InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const StudentRegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

    const initialRegNo = location.state?.registrationNumber || '';
  const initialInstituteCode = location.state?.instituteCode || '';

  const [formData, setFormData] = useState({
    registrationNumber: initialRegNo || '',
    instituteCode: initialInstituteCode || '',
    username: initialRegNo,
    password: '',
    email: initialRegNo,
    full_name: '',
  address: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  // const [usernameAvailable, setUsernameAvailable] = useState(true);
  // const [usernameChecking, setUsernameChecking] = useState(false);

  // const handleCloseSnackbar = () => {
  //   setSnackbar({ ...snackbar, open: false });
  // };

const handleChange = (e) => {
  const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validateForm = () => {
    if (!formData.password) {
      throw new Error('Password is required');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validateForm();

      const payload = { ...formData };


//   if (name === 'username') {
//     const sanitized = value.replace(/[^a-zA-Z0-9]/g, '');
//     const email = `${sanitized}@smartbus360.com`;
//     setFormData((prev) => ({
//       ...prev,
//       username: sanitized,
//       email,
//     }));
//   } else if (name === 'password') {
//     const sanitized = value.replace(/[^a-zA-Z0-9]/g, '');
//     setFormData((prev) => ({
//       ...prev,
//       password: sanitized,
//     }));
//   } else {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }
// };

  // useEffect(() => {
  //   const checkUsername = async () => {
  //     const username = formData.username.trim();
  //     if (!username || username.length < 3) {
  //       setUsernameAvailable(true);
  //       return;
  //     }

  //     setUsernameChecking(true);

  //     try {
// const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/check-username?username=${username}`);
//         const data = await res.json();
//         setUsernameAvailable(!data.exists);
//       } catch (err) {
//         console.error('Username check failed:', err);
//         setUsernameAvailable(true); // Fail open
//       }

//       setUsernameChecking(false);
//     };

//     const debounce = setTimeout(() => {
//       checkUsername();
//     }, 500);

//     return () => clearTimeout(debounce);
//   }, [formData.username]);

//   const validateForm = async () => {
// const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

//     if (!regex.test(formData.username)) {
// throw new Error('Username must include uppercase, lowercase, number & be 8+ characters.');
//     }

//     if (!regex.test(formData.password)) {
// throw new Error('Password must include uppercase, lowercase, number & be 8+ characters.');
//     }

//     if (!usernameAvailable) {
//       throw new Error('Username already exists. Choose another.');
//     }
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     await validateForm();

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/self-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (res.ok) {
      setSnackbar({
        open: true,
        message: `
          You have successfully registered with SMART BUS 360.\n
          Username: ${formData.username}\nPassword: ${formData.password}`,
          Note: Please verify this in the 3rd step.
        `,
        severity: 'success',
      });
      setTimeout(() => navigate('/verify'), 4000);
    } else {
      throw new Error(result.message || 'Registration failed');
    }

  } catch (err) {
    setSnackbar({ open: true, message: err.message, severity: 'error' });
  }
};

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <TextField
        fullWidth
        label="Registration Number"
        name="registrationNumber"
        value={formData.registrationNumber}
        disabled
        margin="normal"
      />

      <TextField
        fullWidth
        label="Institute Code"
        name="instituteCode"
        value={formData.instituteCode}
        disabled
        margin="normal"
      />

      // <TextField
      //   fullWidth
      //   label="Username"
      //   name="username"
      //   value={formData.username}
      //   onChange={handleChange}
      //   margin="normal"
      //   required
      //   error={!usernameAvailable && formData.username !== ''}
      //   helperText={
      //     usernameChecking ? (
      //       <span><CircularProgress size={14} sx={{ mr: 1 }} />Checking...</span>
      //     ) : !usernameAvailable ? (
      //       '❌ Username already taken'
      //     ) : (
      //       '✅ Must include uppercase, lowercase, number, special character (8+ chars)'
      //     )
      //   }
      // />

      <TextField
        fullWidth
        label="Username"
        name="username"
        value={formData.username}
        disabled
        margin="normal"
      />
      <TextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
        required
        helperText="Enter a password of Your own choice."
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        disabled
        margin="normal"
      />

<TextField
  fullWidth
  label="Full Name(optional)"
  name="full_name"
  value={formData.full_name}
  onChange={handleChange}
  margin="normal"
  required
/>

<TextField
  fullWidth
  label="Address(optional)"
  name="address"
  value={formData.address}
  onChange={handleChange}
  margin="normal"
  required
/>

      <TextField
        fullWidth
        label="Phone (optional)"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        margin="normal"
      />

      <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
        Register
      </Button>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
<Alert
  onClose={handleCloseSnackbar}
  severity={snackbar.severity}
  sx={{ width: '100%', whiteSpace: 'pre-line' }}
>
  {snackbar.message}
</Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentRegistrationForm;
