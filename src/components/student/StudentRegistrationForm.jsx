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
  
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

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



    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/self-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

      if (res.ok) {
        // ✅ Show top popup
        setPopupMessage(`✅ You have successfully registered with SMART BUS 360.
Username: ${formData.username}
Password: ${formData.password}
Note: Please verify this in the 3rd step.`);
        setPopupVisible(true);
      setTimeout(() => navigate('/verify'), 4000);
    } else {
      throw new Error(result.message || 'Registration failed');
    }

  } catch (err) {
    setSnackbar({ open: true, message: err.message, severity: 'error' });
  }
};

  return (
    <>
      {/* ✅ Top Popup */}
      {popupVisible && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#4caf50',
            color: '#fff',
            padding: '15px 20px',
            borderRadius: '0 0 8px 8px',
            width: '100%',
            maxWidth: '500px',
            textAlign: 'center',
            zIndex: 9999,
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            whiteSpace: 'pre-line'
          }}
        >
          <IconButton
            onClick={() => setPopupVisible(false)}
            sx={{ position: 'absolute', right: 10, top: 10, color: '#fff' }}
          >
            ✖
          </IconButton>
          {popupMessage}
        </Box>
    
      
      )}

      
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

/>

<TextField
  fullWidth
  label="Address(optional)"
  name="address"
  value={formData.address}
  onChange={handleChange}
  margin="normal"

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
    </>
  );
};

export default StudentRegistrationForm;
