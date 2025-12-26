import React, { useState, useEffect } from 'react';
import { TextField, Button, Snackbar, Alert, Box,IconButton,InputAdornment,Collapse } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StudentRegistrationForm = () => {
  const navigate = useNavigate();
  

  const [formData, setFormData] = useState({
   registrationNumber: '',
    instituteCode: '',
    username: '',
    password: '',
   email: '',
    full_name: '',
    address: '',
    phone: '',
  });
  const [ready, setReady] = useState(false);
  useEffect(() => {
  (async () => {
    try {
      const token = localStorage.getItem('studentToken');
      if (!token) return navigate('/home/student-login');

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/auth/me/basic`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 401) return navigate('/home/student-login');

      const me = await res.json();
      const uname = me.username || me.registrationNumber || '';

      setFormData(prev => ({
        ...prev,
        username: uname,
        email: uname, // email = username
        registrationNumber: me.registrationNumber || '',
        instituteCode: me.instituteCode || ''
      }));
      setReady(true);
    } catch {
      // optional toast/snackbar
      setReady(true);

    }
  })();
}, [navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

    const [pwOpen, setPwOpen] = useState(false);
  const [pwFields, setPwFields] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);


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
      if (!formData.username || !formData.registrationNumber || !formData.instituteCode) {
       throw new Error('Missing required fields. Please refresh or login again.');
     }


      // const payload = { ...formData };



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
Password: ${formData.password}`);
        setPopupVisible(true);
      setTimeout(() => navigate('/'), 10000);
    } else {
      throw new Error(result.message || 'Registration failed');
    }

  } catch (err) {
    setSnackbar({ open: true, message: err.message, severity: 'error' });
  }
};
  const handlePasswordUpdate = async () => {
    try {
      if (!formData.username) throw new Error('Session expired. Please login again.');
      if (!pwFields.oldPassword || !pwFields.newPassword || !pwFields.confirmNewPassword) {
        throw new Error('Please fill all password fields');
      }
      if (pwFields.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters');
      }
      if (pwFields.newPassword !== pwFields.confirmNewPassword) {
        throw new Error('New password and confirmation do not match');
      }

      setPwLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/auth/change-student-password`, {
        method: 'PUT',
        headers: {
   'Content-Type': 'application/json',
   Authorization: `Bearer ${localStorage.getItem('studentToken') || ''}`
 },
        body: JSON.stringify({
          username: formData.username,
          oldPassword: pwFields.oldPassword,
          newPassword: pwFields.newPassword,
          confirmNewPassword: pwFields.confirmNewPassword,
        }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Password update failed');

      setSnackbar({ open: true, message: 'Password updated successfully', severity: 'success' });
      setPwFields({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      setPwOpen(false);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setPwLoading(false);
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
            whiteSpace: 'pre-line',
            fontSize : '18px',
            fontWeight:'bold'
            
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

      <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }} disabled={!ready || !formData.username}>
        Register
      </Button>

              <Box sx={{ mt: 4 }}>
          <Button variant="outlined" fullWidth onClick={() => setPwOpen((o) => !o)}>
            {pwOpen ? 'Hide Password Update' : 'Update Password'}
          </Button>
          <Collapse in={pwOpen}>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Old Password"
                type={showOldPw ? 'text' : 'password'}
                value={pwFields.oldPassword}
                onChange={(e) => setPwFields((p) => ({ ...p, oldPassword: e.target.value }))}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowOldPw((v) => !v)} edge="end">
                        {showOldPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="New Password"
                type={showNewPw ? 'text' : 'password'}
                value={pwFields.newPassword}
                onChange={(e) => setPwFields((p) => ({ ...p, newPassword: e.target.value }))}
                margin="normal"
                helperText="Min 6 characters"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNewPw((v) => !v)} edge="end">
                        {showNewPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmPw ? 'text' : 'password'}
                value={pwFields.confirmNewPassword}
                onChange={(e) => setPwFields((p) => ({ ...p, confirmNewPassword: e.target.value }))}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPw((v) => !v)} edge="end">
                        {showConfirmPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handlePasswordUpdate}
                disabled={pwLoading}
              >
                {pwLoading ? 'Updating…' : 'Update Password'}
              </Button>
            </Box>
          </Collapse>
        </Box>


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
