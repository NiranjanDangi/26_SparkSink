import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Nurse from "./Nurse";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../index.css";
import Patients from "./Patients";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/nurse/:id" element={<Nurse />} />
          <Route path="/patients/:id" element={<Patients />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;