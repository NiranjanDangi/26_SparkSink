import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Sending login request to the server
      const result = await axios.post(
        "http://localhost:3001/login",
        { email, password },
        { withCredentials: true } // Ensure cookies are sent
      );

      if (result.data.status === "Success") {
        alert("Login successful!");

        // Get the userId from cookies
        const userId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userId"))
          ?.split("=")[1];

        // Redirect based on user role and ID
        if (result.data.role === "nurse") {
          navigate(`/nurse/${userId}`); // Redirect nurse to nurse page with their ID
        } else if (result.data.role === "patient") {
          navigate(`/patients/${userId}`); // Redirect patient to patient page with their ID
        }
      } else {
        alert(result.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Invalid Username or Password !!");
    }
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center text-center vh-100"
        style={{
          backgroundImage:
            "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))",
        }}
      >
        <div className="bg-white p-3 rounded" style={{ width: "40%" }}>
          <h2 className="mb-3 text-primary">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label htmlFor="exampleInputEmail1" className="form-label">
                <strong>Email Id</strong>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                className="form-control"
                id="exampleInputEmail1"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="exampleInputPassword1" className="form-label">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                className="form-control"
                id="exampleInputPassword1"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
          <p className="container my-2">Don't have an account?</p>
          <Link to="/register" className="btn btn-secondary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;