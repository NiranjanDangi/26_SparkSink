import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, Marker, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import toast, { Toaster } from "react-hot-toast";
import patient_logo from "../assests/patient_logo.png";

const nurseIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1534/1534103.png",
  iconSize: [32, 32],
});

const shivajinagarCoords = [18.5196, 73.8551];
const nursesCoords = [
  { id: 1, coords: [18.4802, 73.879], name: "Priya Sharma", experience: 5, contact: "9876567896", specialty: "Cardiology", emergencyType: "severe" },
  { id: 2, coords: [18.55, 73.9], name: "Sneha Patil", experience: 3, contact: "9322851793", specialty: "Pediatrics", emergencyType: "mild" },
  { id: 3, coords: [18.53, 73.86], name: "Anjali Kulkarni", experience: 7, contact: "9876543210", specialty: "Geriatrics", emergencyType: "moderate" },
  { id: 4, coords: [18.5, 73.87], name: "Neha Verma", experience: 4, contact: "8798765436", specialty: "Orthopedics", emergencyType: "moderate" },
];

const NurseDetailsModal = ({ nurse, onClose }) => {
  const handleConnectClick = () => {
    alert("Your details have been sent to the nurse successfully.");
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(75, 85, 99, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
        width: '50%',
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1D4ED8' }}>
          {nurse.name}'s Details
        </h2>
        <p><strong>Experience:</strong> {nurse.experience} years</p>
        <p><strong>Contact:</strong> {nurse.contact}</p>
        <p><strong>Specialty:</strong> {nurse.specialty}</p>
        <p><strong>Distance:</strong> {nurse.distance} km</p>
        <button onClick={handleConnectClick} style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          marginTop: '1rem',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s',
        }}>
          Connect
        </button>
        <button onClick={onClose} style={{
          backgroundColor: '#DC2626',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          marginTop: '1rem',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s',
        }}>
          Close
        </button>
      </div>
    </div>
  );
};

const Patients = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(shivajinagarCoords);
  const [nearbyNurses, setNearbyNurses] = useState([]);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [isNurseAvailable, setIsNurseAvailable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientData, setPatientData] = useState(null);

  const fetchPatientData = async () => {
    if (id) {
      try {
        const response = await fetch(`http://127.0.0.1:3001/patient/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch patient data");
        }

        const data = await response.json();
        setPatientData(data);
      } catch (error) {
        console.error("Error fetching patient data:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const haversineDistance = (coords1, coords2) => {
    const R = 6371; // Radius of the Earth in km
    const latDiff = (coords2[0] - coords1[0]) * (Math.PI / 180);
    const lonDiff = (coords2[1] - coords1[1]) * (Math.PI / 180);

    const a =
      Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
      Math.cos(coords1[0] * (Math.PI / 180)) *
      Math.cos(coords2[0] * (Math.PI / 180)) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
  };

  const findNearestNurses = () => {
    const nearby = nursesCoords.map((nurse) => {
      const distanceToNurse = haversineDistance(location, nurse.coords);
      return { ...nurse, distance: distanceToNurse.toFixed(2) }; // Calculate distance
    });

    // Sort nurses by distance in ascending order
    nearby.sort((a, b) => a.distance - b.distance);

    setNearbyNurses(nearby);
    setIsNurseAvailable(nearby.length > 0);
    if (nearby.length > 0) {
      toast.success(`${nearby.length} nearby nurses found!`);
    } else {
      toast.error("No nurses found nearby.");
    }
  };

  const handleEmergencyClick = () => {
    toast.success("Emergency raised! Finding nearby nurses...");
    findNearestNurses();
  };

  const handleNurseSelection = (nurse) => {
    setSelectedNurse(nurse);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side - Profile Details */}
      <div className="w-full md:w-1/4 p-4 bg-blue-100 rounded-2xl shadow-2xl flex flex-col">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-600 flex items-center">
          <img src={patient_logo} alt="Patient Logo" className="w-10 h-10 rounded-full mr-2" />
          Patient Profile
        </h2>
        {patientData ? (
          <>
            <p className="text-lg"><strong>Name:</strong> {patientData.name}</p>
            <p className="text-lg"><strong>Current Location:</strong> Shivajinagar, Pune</p>
            <p className="text-lg"><strong>Registered Address:</strong> {patientData.address}</p>
          </>
        ) : (
          <p>Loading patient data...</p>
        )}
      </div>

      {/* Middle Section - Emergency Actions & Map */}
      <div className="w-full md:w-1/2 p-4 flex flex-col items-center relative">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">Emergency Actions</h2>

        {/* Single Raise Emergency Button */}
        <button
          className="bg-red-500 text-white rounded-lg px-4 py-2 mb-4"
          onClick={handleEmergencyClick}
        >
          Raise Emergency
        </button>

        {/* Map Section */}
        <MapContainer center={location} zoom={14} style={{ width: "100%", height: "400px", zIndex: 0 }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy;< a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={location} />
          {nearbyNurses.map((nurse) => (
            <Marker
              key={nurse.id}
              position={nurse.coords}
              icon={nurseIcon}
              eventHandlers={{ click: () => handleNurseSelection(nurse) }}
            />
          ))}
          {nearbyNurses.map((nurse) => (
            <Polyline key={nurse.id} positions={[location, nurse.coords]} color="blue" />
          ))}
        </MapContainer>
      </div>

      {/* Right Side - Nurses List */}
      <div className="w-full md:w-1/4 p-4 bg-green-100 rounded-2xl shadow-2xl flex flex-col">
        <h2 className="text-3xl font-bold mb-4 text-center text-green-600">Nearby Nurses</h2>
        {isNurseAvailable ? (
          nearbyNurses.map((nurse) => (
            <div
              key={nurse.id}
              className="bg-white p-4 rounded-lg mb-2 shadow-md cursor-pointer"
              onClick={() => handleNurseSelection(nurse)}
            >
              <h3 className="text-xl font-semibold text-blue-700">{nurse.name}</h3>
              <p><strong>Experience:</strong> {nurse.experience} years</p>
              <p><strong>Distance:</strong> {nurse.distance} km</p>
            </div>
          ))
        ) : (
          <p>No nearby nurses available.</p>
        )}
      </div>

      {/* Nurse Details Modal */}
      {isModalOpen && selectedNurse && (
        <NurseDetailsModal nurse={selectedNurse} onClose={() => setIsModalOpen(false)} />
      )}
      <Toaster />
    </div>
  );
};

export default Patients;
