import React, {useState, useEffect} from "react";
import {db} from "../config/firebase";
import {collection, addDoc, onSnapshot, query} from "firebase/firestore";
import Select from "react-select"; // Import react-select

const FeedbackForm = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [feedback, setFeedback] = useState({
    patientId: "",

    medication_intake: "",
    feedback: "",
  });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      const q = query(collection(db, "patients"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const patientList = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }));
          setPatients(patientList);
        },
        (error) => {
          console.error("Error fetching patients: ", error);
        }
      );

      return () => unsubscribe();
    };

    fetchPatients();
  }, []);

  const handlePatientChange = (selectedOption) => {
    setSelectedPatient(selectedOption);
    setFeedback((prevState) => ({
      ...prevState,
      patientId: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleFeedbackChange = (e) => {
    setFeedback({
      ...feedback,
      [e.target.id]: e.target.value,
    });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    setFeedbackLoading(true);

    try {
      await addDoc(collection(db, "feedbacks"), feedback);
      console.log("Feedback submitted successfully!");

      setFeedback({
        patientId: selectedPatient ? selectedPatient.value : "",

        medication_intake: "",
        feedback: "",
      });
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      setFeedbackError("Failed to submit feedback.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Convert patient list to options for react-select
  const patientOptions = patients.map((patient) => ({
    value: patient.id,
    label: patient.name,
  }));

  return (
    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
      <div className="flex items-center mb-4">
        <label
          htmlFor="patient"
          className="w-1/4 text-gray-700 text-right pr-4"
        >
          Select Patient
        </label>
        <Select
          id="patient"
          options={patientOptions}
          value={selectedPatient}
          onChange={handlePatientChange}
          placeholder="Select a patient"
          className="w-3/4"
        />
      </div>

      <div className="flex items-center mb-4">
        <label
          htmlFor="medication_intake"
          className="w-1/4 text-gray-700 text-right pr-4"
        >
          Time of Intake
        </label>
        <input
          type="datetime-local"
          id="medication_intake"
          value={feedback.medication_intake}
          onChange={handleFeedbackChange}
          className="w-3/4 px-4 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="flex items-start mb-4">
        <label
          htmlFor="feedback"
          className="w-1/4 text-gray-700 text-right pr-4"
        >
          Reported Effects
        </label>
        <textarea
          id="feedback"
          value={feedback.feedback}
          onChange={handleFeedbackChange}
          placeholder="Describe any effects or side effects experienced"
          className="w-3/4 px-4 py-2 border border-gray-300 rounded-md"
          rows="4"
          required
        />
      </div>

      {feedbackError && (
        <div className="text-red-500 mb-4">{feedbackError}</div>
      )}

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-6 rounded-md text-lg hover:bg-blue-600 transition duration-300"
          disabled={feedbackLoading}
        >
          {feedbackLoading ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;
