import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './pages/Layout';
import Landing from './pages/landing/Landing';
import Home from './pages/Home/home';
import Profiler from './pages/profiler/Profiler';
import AuthLayout from './pages/auth/AuthLayout';
import Login from './pages/auth/login/login';
import LandingLayout from './pages/landing/LandingLayout';
import AddNormalMan from './pages/register/AddNormalMan/AddNormalMan';
import AddNormalWoman from './pages/register/AddNormalWoman/AddNormalWoman';
import AddDisabled from './pages/register/AddDisabled/AddDisabled';
import AddNormalChild from './pages/register/AddNormalChild/AddNormalChild';
import Identification from './pages/Identification/identification';
import Search from './pages/Search/search';
import Userdata from './pages/users/userdata';
import NotFound from './pages/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { TranslationProvider } from './contexts/TranslationContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <TranslationProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route path="/" element={<Landing />} />
          </Route>
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="search" element={<Search />} />
            <Route path="identification" element={<Identification />} />
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profiler />} />
            <Route path="profile/:id" element={<Profiler />} />
            <Route path="users/:id" element={<Userdata />} />
            <Route path="register">
              <Route path="man" element={<AddNormalMan />} />
              <Route path="woman" element={<AddNormalWoman />} />
              <Route path="disabled" element={<AddDisabled />} />
              <Route path="child" element={<AddNormalChild />} />
            </Route>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* 404 Page - Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TranslationProvider>
  );
}

export default App;
