import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import StudentRegistrationForm from './components/student/StudentRegistrationForm';
import LoginForm from './components/student/Loginform';

import AdminLayout from "./layouts/admin/index";
import AuthLayout from "./layouts/auth/index";
import SearchLayout from "./layouts/search/index";
import HomeLayout from "./layouts/home/index";
import PrivateRoute from "./PrivateRoute";
import SignIn from "./views/auth/SignIn";
import PrivacyPolicy from "./views/home/PrivacyPolicy";
import TermsAndConditions from "./views/home/TermsAndConditions";
import About from "./views/home/About";
import JoinUs from "./views/home/JoinUs";
import LandingPage from "./views/home/LandingPage";
import CoreValues from "./views/home/CoreValues";
import FounderMessage from "./views/home/FounderMessage";
import MissionAndVision from "./views/home/MissionAndVision";
import WhySmartBus from "./views/home/WhySmartbus";
import UniversityDetails from "./views/search/UniversityDetails";
import VerificationPage from './components/student/UserVerification';

const App = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Home Routes */}
      <Route path="home/*" element={<HomeLayout />}>
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="about" element={<About />} />
        <Route path="core-values" element={<CoreValues />} />
        <Route path="founder-mesage" element={<FounderMessage />} />
        <Route path="mission-vision" element={<MissionAndVision />} />
        <Route path="why-smartbus360" element={<WhySmartBus />} />
        <Route path="join-us" element={<JoinUs />} />
        <Route path="student-login" element={<LoginForm />} />

      </Route>

      {/* Auth Routes */}
      <Route path="auth/*" element={<AuthLayout />}>
        <Route path="sign-in" element={<SignIn />} />
      </Route>
  {/* other routes */}
  <Route path="/register" element={<StudentRegistrationForm />} />


      {/* Admin Dashboard */}
      <Route
        path="admin/*"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      />
      <Route
        path="search/*"
        element={
          <PrivateRoute>
            <SearchLayout />
          </PrivateRoute>
        }
      >
        <Route path=":institute" element={<UniversityDetails />} />
      </Route>

      {/* <Route path="/admin/university-details/:institute" element={<UniversityDetails />} /> */}

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/verify" element={<VerificationPage />} />

    </Routes>
  );
};

export default App;
