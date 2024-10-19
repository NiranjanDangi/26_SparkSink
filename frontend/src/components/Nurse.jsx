import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import nurse_logo from "../assests/nurse_logo.png";
import { toast, Toaster } from "react-hot-toast"; // Import toast and Toaster

function Nurse() {
  const { id } = useParams(); // Get nurse ID from the URL
  const [nurseDetails, setNurseDetails] = useState(null);
  const [activeRequest, setActiveRequest] = useState(null);
  const [nurseStatus, setNurseStatus] = useState("on-duty");
  const [nearbyNurses, setNearbyNurses] = useState([]); // State for nearby nurses
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility

  const nurseLocation = [18.5308, 73.8471]; // Default location (for demo purposes)

  // Fetch nurse details and nearby nurses when the component mounts
  useEffect(() => {
    const fetchNurseDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/nurse/${id}`); // Fetch nurse data from the backend
        if (response.ok) {
          const nurseData = await response.json();
          setNurseDetails({
            name: nurseData.name,
            currentLocation: "Downtown Clinic", // Demo location
            registeredAddress: nurseData.address,
            expertise: ["Emergency Care", "Geriatrics"], // Hardcoded for now
            status: nurseStatus,
          });

          // Fetch nearby nurses after fetching nurse details
          const nearbyResponse = await fetch(`http://127.0.0.1:3001/nurses/nearby`);
          if (nearbyResponse.ok) {
            const nearbyData = await nearbyResponse.json();
            setNearbyNurses(nearbyData); // Set nearby nurses in state
          }
        } else {
          console.error("Failed to fetch nurse data");
        }
      } catch (error) {
        console.error("Error fetching nurse data:", error);
      }
    };

    fetchNurseDetails();
  }, [id, nurseStatus]);

  const requests = [
    {
      id: 1,
      patientName: "John Doe",
      patientLocation: [18.531, 73.847],
      patientDetails: "Heart condition, requires urgent assistance",
      status: "accept",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      patientLocation: [18.533, 73.8465],
      patientDetails: "Fever, needs medication",
      status: "completed",
    },
    // New static request entry
    {
      id: 3,
      patientName: "Niranjan Dangi",
      patientLocation: [18.535, 73.848],
      patientDetails: "Broken leg, needs immediate help",
      status: "pending",
    },
    
  ];

  // Set active request to the new static request (id: 3)
  useEffect(() => {
    setActiveRequest(3);
  }, []); 

  const handleRequestAction = (requestId, action) => {
    if (action === "accept") {
      setActiveRequest(requestId);
      toast.success("Request accepted!", { // Toast for accept action
        style: {
          background: '#4caf50', // Green background
          color: '#fff',
        },
      });
      setShowPopup(false); // Hide popup on acceptance
    } else {
      toast.error("Request rejected.", { // Toast for reject action
        style: {
          background: '#f44336', // Red background
          color: '#fff',
        },
      });
      setShowPopup(false); // Hide popup on rejection
    }
  };

  const toggleDutyStatus = () => {
    setNurseStatus(nurseStatus === "on-duty" ? "off-duty" : "on-duty");
  };

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  if (!nurseDetails) {
    return <div>Loading...</div>; // Loading state while fetching nurse data
  }

  return (
    <div className="flex h-screen relative">
      {/* Toaster for notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Popup for Accept/Reject */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="font-semibold text-lg">Patient: {requests.find(req => req.id === activeRequest).patientName}</h3>
            <div className="flex justify-between mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                onClick={() => handleRequestAction(activeRequest, "accept")}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                onClick={() => handleRequestAction(activeRequest, "reject")}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Side: Nurse Profile */}
      <div className="w-1/4 p-6 rounded-3xl bg-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Nurse Profile</h2>

        {/* Nurse Logo and Name */}
        <div className="flex items-center mb-4 cursor-pointer">
          <img
            src={nurse_logo}
            alt="Nurse Logo"
            className="w-16 h-16 rounded-full shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out transform hover:scale-110 cursor-pointer"
          />
          <p className="font-semibold text-lg ml-4">
            Name: {nurseDetails.name}
          </p>
        </div>

        <p className="mt-4">
          Currently working at: {nurseDetails.currentLocation}
        </p>
        <p className="mt-2">
          Registered Address: {nurseDetails.registeredAddress}
        </p>

        {/* Toggle Switch for On-Duty / Off-Duty */}
        <p className="mt-4">
          Status:{" "}
          <span
            className={`${
              nurseDetails.status === "on-duty"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {nurseDetails.status}
          </span>
        </p>
        <label className="flex items-center mt-4 cursor-pointer">
          <span className="mr-2">Duty:</span>
          <input
            type="checkbox"
            checked={nurseDetails.status === "on-duty"}
            onChange={toggleDutyStatus}
            className="toggle-checkbox hidden"
          />
          <div className="toggle-slot bg-gray-300 border-2 border-gray-200 rounded-full w-12 h-6 flex items-center transition duration-300 ease-in-out">
            <div
              className={`toggle-dot bg-white w-6 h-6 rounded-full shadow-md transform ${
                nurseDetails.status === "on-duty"
                  ? "translate-x-6 bg-green-500"
                  : "translate-x-0 bg-red-500"
              } transition duration-300 ease-in-out`}
            ></div>
          </div>
        </label>

        <p className="mt-4">Expertise:</p>
        <ul className="list-disc ml-4 mt-2">
          {nurseDetails.expertise.map((skill, index) => (
            <li
              key={index}
              className="hover:text-secondary transition-colors duration-300 cursor-pointer"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      {/* Middle: Live Location Map */}
      <div className="w-2/4 p-6 flex-grow bg-white">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Live Location</h2>
        <MapContainer
          center={nurseLocation}
          zoom={13}
          className="h-full w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Nurse Marker */}
          <Marker position={nurseLocation}>
            <Popup>Nurse: {nurseDetails.name}</Popup>
          </Marker>
          {/* Request Markers */}
          {requests
            .filter((req) => req.status === "pending")
            .map((req) => (
              <Marker key={req.id} position={req.patientLocation}>
                <Popup>
                  Patient: {req.patientName}
                  <br />
                  Details: {req.patientDetails}
                </Popup>
              </Marker>
            ))}
          {/* Nearby Nurses Markers */}
          {nearbyNurses.map((nurse) => (
            <Marker key={nurse.id} position={[nurse.latitude, nurse.longitude]}>
              <Popup>Nurse: {nurse.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Right Side: Request History and Current Requests */}
      <div className="w-1/4 p-6 bg-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-3xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Requests</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Current Request:</h3>
          {activeRequest ? (
            <div className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
              <p>
                <strong>Patient:</strong>{" "}
                {requests.find((req) => req.id === activeRequest).patientName}
              </p>
              <p>
                <strong>Details:</strong>{" "}
                {
                  requests.find((req) => req.id === activeRequest)
                    .patientDetails
                }
              </p>
              <div className="flex space-x-2 mt-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 cursor-pointer"
                  onClick={handleShowPopup} // Show the popup on button click
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 cursor-pointer"
                  onClick={() => handleRequestAction(activeRequest, "decline")}
                >
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <p>No current request.</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Request History:</h3>
          {requests
            .filter((req) => req.status === "completed")
            .map((req) => (
              <div
                key={req.id}
                className="p-4 bg-gray-100 rounded-lg shadow-md mb-2 hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
              >
                <p>
                  <strong>Patient:</strong> {req.patientName}
                </p>
                <p>
                  <strong>Details:</strong> {req.patientDetails}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Nurse;
