import React, { useState } from 'react';
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const UserVerificationPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Predefined hidden credentials
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          clientId,
          clientSecret,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setSnackbar({
          open: true,
          message: '✅ You are connected with smartbus360.com',
          severity: 'success',
        });
          // Redirect after 3 seconds
  setTimeout(() => {
    navigate('/'); // change '/home' to your actual route if different
  }, 3000);


      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 6, p: 3, border: '1px solid #ccc', borderRadius: 2 }}
    >
      <Typography variant="h5" textAlign="center" mb={2}>
        Verify Your Login
      </Typography>

      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
        type="email"
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
        required
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserVerificationPage;
