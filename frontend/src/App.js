import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header/Header";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import ProtectedRoute from "./routes/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer/Footer";

import Promotion from "./pages/Promotion/Promotion";
import PromotionDetail from "./pages/Promotion/PromotionDetail";

import MovieDetail from "./pages/Movie/DetailMovie";

import SignUp from "./pages/Login/Signup";
import VerifyOtp from "./pages/Login/verifyOtp";
import Showtime from "./pages/Movie/Showtime";
import Movies from "./pages/Movie/Movies";
import ManagerMovies from "./pages/AdminPanel/ManagerMoives";


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/managermovies" element={<ManagerMovies />} />
          <Route path="/detail/:movieId" element={<MovieDetail />} />
          <Route path="/showtime/:movieId" element={<Showtime />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/promotion/:id" element={<PromotionDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="user">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
