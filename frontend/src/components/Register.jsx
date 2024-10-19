import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('patient');
    const [age, setAge] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Sending the form data to the backend
        axios.post('http://localhost:3001/register', { name, email, password, userType, age, contact, address })
            .then(result => {
                console.log(result);
                if (result.data === "Already registered") {
                    alert("E-mail already registered! Please Login to proceed.");
                    navigate('/login');
                } else {
                    alert("Registered successfully! Please Login to proceed.");
                    navigate('/login');
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center text-center vh-100" style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))" }}>
                <div className="bg-white p-3 rounded" style={{ width: '40%', overflowY: 'auto', maxHeight: '90vh' }}>
                    <h2 className='mb-3 text-primary text-center'>Register</h2> {/* Centered heading */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputName" className="form-label">
                                <strong>Name</strong>
                            </label>
                            <input 
                                type="text"
                                placeholder="Enter Name"
                                className="form-control" 
                                id="exampleInputName" 
                                onChange={(event) => setName(event.target.value)}
                                required
                            /> 
                        </div>
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
                        <div className="mb-3 text-start">
                            <label htmlFor="age" className="form-label">
                                <strong>Age</strong>
                            </label>
                            <input 
                                type="number" 
                                placeholder="Enter Age"
                                className="form-control" 
                                id="age" 
                                onChange={(event) => setAge(event.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="contact" className="form-label">
                                <strong>Contact</strong>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter Contact"
                                className="form-control" 
                                id="contact" 
                                onChange={(event) => setContact(event.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="address" className="form-label">
                                <strong>Address</strong>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter Address"
                                className="form-control" 
                                id="address" 
                                onChange={(event) => setAddress(event.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="userType" className="form-label">
                                <strong>User Type</strong>
                            </label>
                            <select 
                                id="userType" 
                                className="form-select" 
                                value={userType}
                                onChange={(event) => setUserType(event.target.value)}
                                required
                            >
                                <option value="patient">Patient</option>
                                <option value="nurse">Nurse</option>
                            </select>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">Register</button>
                        </div>
                    </form>

                    <p className='container my-2'>Already have an account?</p>
                    <div className="d-flex justify-content-center">
                        <Link to='/login' className="btn btn-secondary">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;