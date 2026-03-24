import React, { useState, useEffect } from 'react';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Modals
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  // Forms
  const [patientForm, setPatientForm] = useState({ name: '', age: '', gender: '' });
  const [appointmentForm, setAppointmentForm] = useState({ patientId: '', doctorId: '', date: '' });

  const fetchAllData = async () => {
    try {
      const pRes = await fetch('http://localhost:8080/api/patients');
      const pData = await pRes.json();
      setPatients(pData);

      const dRes = await fetch('http://localhost:8080/api/doctors');
      const dData = await dRes.json();
      setDoctors(dData);

      const aRes = await fetch('http://localhost:8080/api/appointments');
      const aData = await aRes.json();
      setAppointments(aData);
    } catch (e) {
      console.error("Failed to fetch data:", e);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const addPatient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientForm)
      });
      if (res.ok) {
        setShowPatientModal(false);
        setPatientForm({ name: '', age: '', gender: '' });
        fetchAllData();
      }
    } catch (e) { alert("Error adding patient"); }
  };

  const deletePatient = async (id) => {
    if (!confirm("Are you sure you want to delete this patient (and all existing appointments)?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/patients/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (e) { alert("Error deleting patient"); }
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentForm)
      });
      const data = await res.json();
      if (data.success) {
        alert("Appointment booked!");
        setShowAppointmentModal(false);
        setAppointmentForm({ patientId: '', doctorId: '', date: '' });
        fetchAllData();
      } else {
        alert("Booking failed: " + data.error);
      }
    } catch (e) { alert("Error booking appointment"); }
  };

  return (
    <div className="container">
      <nav className="sidebar glass">
        <div className="logo">
          <i className="fa-solid fa-notes-medical" style={{fontSize: '32px', color: 'var(--accent)'}}></i>
          <h2>MedCare</h2>
        </div>
        <ul className="nav-links">
          <li><button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fa-solid fa-chart-pie"></i> Dashboard</button></li>
          <li><button className={`nav-btn ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}><i className="fa-solid fa-bed-pulse"></i> Patients</button></li>
          <li><button className={`nav-btn ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}><i className="fa-solid fa-user-doctor"></i> Doctors</button></li>
          <li><button className={`nav-btn ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}><i className="fa-solid fa-calendar-check"></i> Appointments</button></li>
        </ul>
      </nav>

      <main className="content">
        {activeTab === 'dashboard' && (
          <section className="view active">
            <header>
              <h1>Overview</h1>
            </header>
            <div className="stats-grid">
              <div className="stat-card glass-inner">
                <div className="stat-icon"><i className="fa-solid fa-users"></i></div>
                <div className="stat-info">
                  <h3>Total Patients</h3>
                  <h2>{patients.length}</h2>
                </div>
              </div>
              <div className="stat-card glass-inner">
                <div className="stat-icon" style={{color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)'}}><i className="fa-solid fa-user-doctor"></i></div>
                <div className="stat-info">
                  <h3>Specialists</h3>
                  <h2>{doctors.length}</h2>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'patients' && (
          <section className="view active">
            <header>
              <h1>Patients</h1>
              <button className="btn-primary" onClick={() => setShowPatientModal(true)}>
                <i className="fa-solid fa-user-plus"></i> Add Patient
              </button>
            </header>
            <div className="table-container glass-inner">
              <table>
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id}>
                      <td><span style={{color: 'var(--text-muted)'}}>#{p.id}</span></td>
                      <td style={{fontWeight: 500}}>{p.name}</td>
                      <td>{p.age}</td>
                      <td><span style={{background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '6px', fontSize: '12px'}}>{p.gender}</span></td>
                      <td><button onClick={() => deletePatient(p.id)} style={{background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '16px'}}><i className="fa-solid fa-trash"></i></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {patients.length === 0 && <div className="empty-state"><p>No patients found.</p></div>}
            </div>
          </section>
        )}

        {activeTab === 'doctors' && (
          <section className="view active">
            <header>
              <h1>Doctors Directory</h1>
            </header>
            <div className="table-container glass-inner">
              <table>
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Specialization</th></tr>
                </thead>
                <tbody>
                  {doctors.map(d => (
                     <tr key={d.id}>
                       <td><span style={{color: 'var(--text-muted)'}}>#{d.id}</span></td>
                       <td style={{fontWeight: 500}}>{d.name}</td>
                       <td style={{color: 'var(--accent)'}}>{d.specialization}</td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'appointments' && (
          <section className="view active">
            <header>
              <h1>Appointments</h1>
              <button className="btn-primary" onClick={() => setShowAppointmentModal(true)}>
                <i className="fa-solid fa-calendar-plus"></i> Book
              </button>
            </header>
            <div className="table-container glass-inner">
              <table>
                <thead>
                  <tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                     <tr key={a.id}>
                       <td><span style={{color: 'var(--text-muted)'}}>#{a.id}</span></td>
                       <td style={{fontWeight: 500}}>{a.patient.name}</td>
                       <td style={{color: 'var(--accent)'}}>Dr. {a.doctor.name}</td>
                       <td>{a.appointmentDate}</td>
                     </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && <div className="empty-state"><p>No appointments booked yet.</p></div>}
            </div>
          </section>
        )}
      </main>

      {/* Modals */}
      {showPatientModal && (
        <div className="modal show">
          <div className="modal-content glass">
            <div className="modal-header">
              <h2>Register New Patient</h2>
              <button className="close-btn" onClick={() => setShowPatientModal(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={addPatient}>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" required value={patientForm.name} onChange={e => setPatientForm({...patientForm, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Age</label>
                <input type="number" required value={patientForm.age} onChange={e => setPatientForm({...patientForm, age: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Gender</label>
                <select required value={patientForm.gender} onChange={e => setPatientForm({...patientForm, gender: e.target.value})}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '10px'}}>Save Patient</button>
            </form>
          </div>
        </div>
      )}

      {showAppointmentModal && (
        <div className="modal show">
          <div className="modal-content glass">
            <div className="modal-header">
              <h2>Book Appointment</h2>
              <button className="close-btn" onClick={() => setShowAppointmentModal(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={bookAppointment}>
              <div className="input-group">
                <label>Patient ID</label>
                <input type="number" required value={appointmentForm.patientId} onChange={e => setAppointmentForm({...appointmentForm, patientId: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Doctor ID</label>
                <input type="number" required value={appointmentForm.doctorId} onChange={e => setAppointmentForm({...appointmentForm, doctorId: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Date</label>
                <input type="date" required value={appointmentForm.date} onChange={e => setAppointmentForm({...appointmentForm, date: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '10px'}}>Confirm Booking</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
