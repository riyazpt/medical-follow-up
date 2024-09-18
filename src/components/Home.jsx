// src/components/Home.js
import React, {useState, useEffect} from "react";
import MedicalHistory from "./MedicalHistory";
import {db} from "../config/firebase";
import {collection, onSnapshot} from "firebase/firestore";

const Home = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "patients"),
      (snapshot) => {
        const patientList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPatients(patientList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching patient records:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSearchTerm(""); // Clear the search term
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patient Records</h1>
      <input
        type="text"
        placeholder="Search patient name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="p-2 border border-gray-300 rounded mb-4 w-full"
      />
      {searchTerm && filteredPatients.length > 0 && (
        <ul className="border border-gray-300 rounded p-2 max-h-60 overflow-auto">
          {filteredPatients.map((patient) => (
            <li
              key={patient.id}
              onClick={() => handlePatientSelect(patient)}
              className="cursor-pointer p-2 hover:bg-gray-100"
            >
              {patient.name}
            </li>
          ))}
        </ul>
      )}
      {selectedPatient ? (
        <MedicalHistory
          medicalHistory={selectedPatient}
          patientName={selectedPatient.name} // Pass the selected patient's name
        />
      ) : (
        <p className="text-center mt-4">
          Select a patient to view their medical history.
        </p>
      )}
    </div>
  );
};

export default Home;
