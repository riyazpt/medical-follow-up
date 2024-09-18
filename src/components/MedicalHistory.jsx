// src/components/MedicalHistory.js
import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {FaPrescriptionBottleAlt, FaCalendarDay} from "react-icons/fa";

import FeedbackList from "./FeedbackList";
const MedicalHistory = ({medicalHistory, patientName}) => {
  const {
    id,
    appointments = [],
    history = "",
    prescriptions = [],
  } = medicalHistory;

  // Group prescriptions by date
  const groupedPrescriptions = prescriptions.reduce((acc, prescription) => {
    const {datePrescribed, medicationName, dosage, frequency} = prescription;
    if (!acc[datePrescribed]) {
      acc[datePrescribed] = {
        date: datePrescribed,
        medications: [],
      };
    }
    acc[datePrescribed].medications.push({
      medicationName,
      dosage,
      frequency,
    });
    return acc;
  }, {});

  // Combine and sort events by date
  const events = [
    ...appointments.map((appointment) => ({
      type: "appointment",
      date: appointment.appointmentDate,
      title: `Doctor: ${appointment.doctorName}`,
      description: `Appointment Date: ${appointment.appointmentDate}`,
      icon: <FaCalendarDay />,
      iconStyle: {background: "rgb(33, 150, 243)", color: "#fff"},
    })),
    ...Object.values(groupedPrescriptions).map(({date, medications}) => ({
      type: "prescription",
      date,
      title: "Medications",
      description: medications.map((med) => (
        <div key={med.medicationName}>
          <strong>{med.medicationName}</strong>, Dosage: {med.dosage},
          Frequency: {med.frequency}
        </div>
      )),
      icon: <FaPrescriptionBottleAlt />,
      iconStyle: {background: "rgb(33, 150, 243)", color: "#fff"},
    })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        Medical History for {patientName}
      </h2>
      <VerticalTimeline>
        {events.map((event, index) => (
          <VerticalTimelineElement
            key={index}
            className={`vertical-timeline-element--${event.type}`}
            date={event.date}
            icon={event.icon}
            iconStyle={event.iconStyle}
          >
            <h3 className="vertical-timeline-element-title">{event.title}</h3>
            <div>{event.description}</div>
          </VerticalTimelineElement>
        ))}
        {history && (
          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="Medical History"
            icon={<FaPrescriptionBottleAlt />}
            iconStyle={{background: "rgb(233, 30, 99)", color: "#fff"}}
          >
            <h3 className="vertical-timeline-element-title">Medical History</h3>
            <p>{history}</p>
          </VerticalTimelineElement>
        )}
      </VerticalTimeline>
      <FeedbackList patientId={id} />
    </div>
  );
};

export default MedicalHistory;
