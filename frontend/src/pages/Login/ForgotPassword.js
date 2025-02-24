import { useState } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "70vh" }}>
            <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <h3 className="text-center mb-3">Forgot Password</h3>
                <p className="text-center">Enter your email and we'll send you a reset link.</p>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                        <span className="input-group-text"><FaEnvelope /></span>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
