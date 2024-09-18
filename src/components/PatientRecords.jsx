// src/components/PatientRecords.js
import React, {useState, useEffect} from "react";
import {db} from "../config/firebase";
import {collection, onSnapshot} from "firebase/firestore";

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("Failed to load patient records.");
        console.error("Error fetching patient records:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  if (loading) {
    return <p className="text-center">Loading patient records...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Patient Records</h2>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Age</th>
                <th className="border px-4 py-2 text-left">Prescription</th>
                <th className="border px-4 py-2 text-left">Medical History</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{patient.name}</td>
                  <td className="border px-4 py-2">{patient.age}</td>
                  <td className="border px-4 py-2">
                    {patient.prescriptions.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {patient.prescriptions
                          .slice()
                          .sort(
                            (a, b) =>
                              new Date(b.datePrescribed) -
                              new Date(a.datePrescribed)
                          ) // Sort by date descending
                          .map((prescription, index) => (
                            <li key={index} className="mb-1">
                              <strong>Medication:</strong>{" "}
                              {prescription.medicationName},{" "}
                              <strong>Dosage:</strong> {prescription.dosage},{" "}
                              <strong>Frequency:</strong>{" "}
                              {prescription.frequency}, <strong>Date:</strong>{" "}
                              {prescription.datePrescribed}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      "No prescriptions"
                    )}
                  </td>
                  <td className="border px-4 py-2">{patient.history}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
