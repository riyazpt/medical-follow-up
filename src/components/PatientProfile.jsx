import React, {useState, useEffect} from "react";
import {db} from "../config/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import PatientRecords from "./PatientRecords";

const PatientProfile = () => {
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    history: "",
    prescriptions: [],
    appointment: {
      doctorName: "",
      appointmentDate: "",
    },
  });
  const [newPrescription, setNewPrescription] = useState([
    {
      medicationName: "",
      dosage: "",
      frequency: "",
      datePrescribed: new Date().toISOString().split("T")[0], // Default to today's date
    },
  ]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState("");
  const [formError, setFormError] = useState(""); // Form validation error

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

    return () => unsubscribe();
  }, []);

  const handlePrescriptionChange = (index, e) => {
    const updatedPrescriptions = newPrescription.map((prescription, i) =>
      i === index
        ? {...prescription, [e.target.id]: e.target.value}
        : prescription
    );
    setNewPrescription(updatedPrescriptions);
  };

  const addNewPrescriptionRow = () => {
    setNewPrescription([
      ...newPrescription,
      {
        medicationName: "",
        dosage: "",
        frequency: "",
        datePrescribed: new Date().toISOString().split("T")[0], // Default to today's date
      },
    ]);
  };

  const removePrescriptionRow = (index) => {
    setNewPrescription(newPrescription.filter((_, i) => i !== index));
  };

  const handleAppointmentChange = (e) => {
    setPatientData({
      ...patientData,
      appointment: {
        ...patientData.appointment,
        [e.target.id]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !patientData.name ||
      !patientData.age ||
      !patientData.history ||
      newPrescription.length === 0 ||
      !patientData.appointment.doctorName ||
      !patientData.appointment.appointmentDate
    ) {
      setFormError(
        "Please fill in all required fields, add at least one prescription, and provide appointment details."
      );
      return;
    }

    setFormError(""); // Clear previous form errors
    setLoading(true); // Show loading indicator

    try {
      // Check if the patient already exists
      const q = query(
        collection(db, "patients"),
        where("name", "==", patientData.name)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If the patient exists, update their history
        const existingPatient = querySnapshot.docs[0];
        const existingData = existingPatient.data();

        // Append new history and prescriptions
        const updatedHistory = `${existingData.history}\n${patientData.history}`;
        const updatedPrescriptions = [
          ...existingData.prescriptions,
          ...newPrescription,
        ];

        const updatedAppointment = patientData.appointment;

        await updateDoc(doc(db, "patients", existingPatient.id), {
          history: updatedHistory,
          prescriptions: updatedPrescriptions,
          appointment: updatedAppointment,
        });

        console.log("Patient updated successfully!");
      } else {
        // If the patient doesn't exist, add a new record
        await addDoc(collection(db, "patients"), {
          ...patientData,
          prescriptions: newPrescription,
        });
        console.log("Patient added successfully!");
      }

      // Reset form fields after successful submission
      setPatientData({
        name: "",
        age: "",
        history: "",
        prescriptions: [],
        appointment: {
          doctorName: "",
          appointmentDate: "",
        },
      });
      setNewPrescription([
        {
          medicationName: "",
          dosage: "",
          frequency: "",
          datePrescribed: new Date().toISOString().split("T")[0], // Default to today's date
        },
      ]); // Reset prescriptions
    } catch (error) {
      console.error("Error saving patient data: ", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Add/Update Patient Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center mb-4">
          <label htmlFor="name" className="w-1/4 text-gray-700 text-right pr-4">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter patient name"
            value={patientData.name}
            onChange={(e) =>
              setPatientData({...patientData, name: e.target.value})
            }
            className="w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="age" className="w-1/4 text-gray-700 text-right pr-4">
            Age
          </label>
          <input
            type="number"
            id="age"
            placeholder="Enter patient age"
            value={patientData.age}
            onChange={(e) =>
              setPatientData({...patientData, age: e.target.value})
            }
            className="w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div className="flex items-start mb-4">
          <label
            htmlFor="history"
            className="w-1/4 text-gray-700 text-right pr-4"
          >
            Medical History
          </label>
          <textarea
            id="history"
            placeholder="Enter medical history"
            value={patientData.history}
            onChange={(e) =>
              setPatientData({...patientData, history: e.target.value})
            }
            className="w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            rows="4"
          />
        </div>

        {/* Prescription Section */}
        {newPrescription.map((prescription, index) => (
          <div key={index} className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              id="medicationName"
              placeholder="Medication Name"
              value={prescription.medicationName}
              onChange={(e) => handlePrescriptionChange(index, e)}
              className="w-1/4 px-2 py-1 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              id="dosage"
              placeholder="Dosage"
              value={prescription.dosage}
              onChange={(e) => handlePrescriptionChange(index, e)}
              className="w-1/4 px-2 py-1 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              id="frequency"
              placeholder="Frequency"
              value={prescription.frequency}
              onChange={(e) => handlePrescriptionChange(index, e)}
              className="w-1/4 px-2 py-1 border border-gray-300 rounded-md"
            />
            {/* Removed Date Input Field */}
            <button
              type="button"
              onClick={() => removePrescriptionRow(index)}
              className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addNewPrescriptionRow}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Add Prescription
        </button>

        {/* Appointment Section */}
        <div className="flex items-center mb-4 mt-6">
          <label
            htmlFor="doctorName"
            className="w-1/4 text-gray-700 text-right pr-4"
          >
            Doctor Name
          </label>
          <input
            type="text"
            id="doctorName"
            placeholder="Enter doctor's name"
            value={patientData.appointment.doctorName}
            onChange={handleAppointmentChange}
            className="w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div className="flex items-center mb-4">
          <label
            htmlFor="appointmentDate"
            className="w-1/4 text-gray-700 text-right pr-4"
          >
            Next Appointment Date
          </label>
          <input
            type="date"
            id="appointmentDate"
            value={patientData.appointment.appointmentDate}
            onChange={handleAppointmentChange}
            className="w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        {formError && <p className="text-red-500 text-center">{formError}</p>}

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Patient Profile"}
          </button>
        </div>
      </form>

      <PatientRecords patients={patients} />

      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default PatientProfile;
