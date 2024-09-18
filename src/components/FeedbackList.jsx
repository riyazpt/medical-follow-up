// src/components/FeedbackList.js
import React, {useState, useEffect} from "react";
import {db} from "../config/firebase";
import {collection, query, onSnapshot, where} from "firebase/firestore";

const FeedbackList = ({patientId}) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) {
      setError("No patient ID provided.");
      setLoading(false);
      return;
    }

    console.log("Fetching feedback for patient ID:", patientId); // Debugging log

    const feedbackCollectionRef = collection(db, "feedbacks");
    const q = query(feedbackCollectionRef, where("patientId", "==", patientId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          console.log("No feedback found for this patient."); // Debugging log
          setFeedbacks([]);
        } else {
          const feedbackList = snapshot.docs.map((doc) => doc.data());
          console.log("Feedback data:", feedbackList); // Debugging log
          setFeedbacks(feedbackList);
        }
        setLoading(false);
      },
      (error) => {
        setError("Failed to load feedback.");
        console.error("Error fetching feedback:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, [patientId]);

  if (loading) {
    return <p className="text-center">Loading feedback...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Patient Feedback</h3>
      {feedbacks.length > 0 ? (
        <ul className="list-disc pl-5">
          {feedbacks.map((feedback, index) => (
            <li key={index} className="mb-2">
              <strong>Intake Time:</strong>{" "}
              {feedback.medication_intake || "N/A"}, <strong>Effects:</strong>{" "}
              {feedback.feedback || "N/A"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No feedback available.</p>
      )}
    </div>
  );
};

export default FeedbackList;
