import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            await signup(email, password);
            navigate("/dashboard");
        } catch (error) {
            console.error("Sign-up failed", error);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
            <div className="card shadow-lg overflow-hidden" style={{ maxWidth: '600px' }}>
                <div className="row g-0">

                    <div className="col-md-7 p-4 d-flex flex-column justify-content-center">
                        <div className="text-center mb-3">
                            <FaUser size={40} className="text-primary" />
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaEnvelope /></span>
                                <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaLock /></span>
                                <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaLock /></span>
                                <input type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                        </form>
                        <p className="mt-2 text-center">
                            Already have an account? <a href="/login" className="text-decoration-none">Login</a>
                        </p>
                    </div>

                    <div className="col-md-5 d-none d-md-block">
                        <img src="/login.jpg" alt="Sign Up Banner" className="img-fluid h-100" />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignUp;
