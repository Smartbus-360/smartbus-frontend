import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  Typography,
  Container,
  Paper
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OneTimeLoginForm = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    registrationNumber: '',
    instituteCode: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleOneTimeLogin = async () => {
    try {
const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/one-time-login`, credentials);

      const { token } = res.data;
      localStorage.setItem('accessToken', token);
      setSnackbar({ open: true, message: 'One-time login successful!', severity: 'success' });

      // Navigate to register page or dashboard
      navigate('/register',{
          state: {
    registrationNumber: credentials.registrationNumber,
    instituteCode: credentials.instituteCode
  }
});
// or wherever the student should go
    } catch (err) {
      const message = err?.response?.data?.message || 'One-time login failed';
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          One-Time Student Login
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Registration Number"
          name="registrationNumber"
          value={credentials.registrationNumber}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Institute Code"
          name="instituteCode"
          value={credentials.instituteCode}
          onChange={handleChange}
          required
        />
        <Box mt={4} textAlign="right">
          <Button variant="contained" onClick={handleOneTimeLogin}>
            One-Time Login
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OneTimeLoginForm;
