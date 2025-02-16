import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      <br></br>
      {user ? (
        <>
          <span>Welcome, {user.userId} ({user.role})</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Header;