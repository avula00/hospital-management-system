document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(btn.dataset.target).classList.add('active');
        
        if(btn.dataset.target === 'patients') fetchPatients();
        if(btn.dataset.target === 'doctors') fetchDoctors();
        if(btn.dataset.target === 'appointments') fetchAppointments();
        if(btn.dataset.target === 'dashboard') updateDashboard();
    });
});

async function deletePatient(id) {
    if(!confirm('Are you sure you want to delete this patient (and all their appointments)?')) return;
    try {
        const res = await fetch('/api/patients?id=' + id, { method: 'DELETE' });
        const ans = await res.json();
        if(ans.success) updateDashboard();
        else alert('Failed to delete patient.');
    } catch(e) {
        console.error(e);
        alert('Server error while deleting.');
    }
}

function showModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

async function fetchPatients() {
    try {
        const res = await fetch('/api/patients');
        const data = await res.json();
        const tbody = document.querySelector('#patientsTable tbody');
        tbody.innerHTML = '';
        data.forEach(p => {
            tbody.innerHTML += `<tr>
                <td><span style="color:var(--text-muted)">#${p.id}</span></td>
                <td style="font-weight:500;">${p.name}</td>
                <td>${p.age}</td>
                <td><span style="background:rgba(255,255,255,0.1); padding:5px 10px; border-radius:6px; font-size:12px">${p.gender}</span></td>
                <td><button onclick="deletePatient(${p.id})" style="background:none;border:none;color:var(--error);cursor:pointer;font-size:16px"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`;
        });
        document.getElementById('dash-patient-cnt').innerText = data.length;
    } catch (e) { console.error('Failed to fetch patients', e); }
}

async function fetchDoctors() {
    try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        const tbody = document.querySelector('#doctorsTable tbody');
        tbody.innerHTML = '';
        data.forEach(d => {
            tbody.innerHTML += `<tr>
                <td><span style="color:var(--text-muted)">#${d.id}</span></td>
                <td style="font-weight:500;">Dr. ${d.name}</td>
                <td><span style="color:var(--accent)">${d.specialization}</span></td>
            </tr>`;
        });
        document.getElementById('dash-doctor-cnt').innerText = data.length;
    } catch (e) { console.error('Failed to fetch doctors', e); }
}

async function fetchAppointments() {
    try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        const tbody = document.querySelector('#appointmentsTable tbody');
        const container = document.getElementById('appointmentsContainer');
        const emptyState = document.getElementById('appointmentsEmpty');
        
        tbody.innerHTML = '';
        if(data.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            container.style.display = 'block';
            emptyState.style.display = 'none';
            data.forEach(a => {
                tbody.innerHTML += `<tr>
                    <td><span style="color:var(--text-muted)">#${a.id}</span></td>
                    <td style="font-weight:500;">${a.patient_name}</td>
                    <td style="color:var(--accent)">Dr. ${a.doctor_name}</td>
                    <td>${a.date}</td>
                </tr>`;
            });
        }
    } catch (e) { console.error('Failed to fetch appointments', e); }
}

async function updateDashboard() {
    await fetchPatients();
    await fetchDoctors();
    await fetchAppointments();
}

updateDashboard();

document.getElementById('addPatientForm').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const params = new URLSearchParams(fd).toString();
    
    const btn = e.target.querySelector('.btn-submit');
    const originalText = btn.innerText;
    btn.innerText = 'Saving...';
    
    try {
        const res = await fetch('/api/patients', {
            method: 'POST', body: params,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
        const ans = await res.json();
        if(ans.success) {
            closeModal('addPatientModal');
            fetchPatients();
            e.target.reset();
        } else alert('Failed to add patient.');
    } catch (e) {
        console.error(e);
        alert('Server Error.');
    } finally {
        btn.innerText = originalText;
    }
};

document.getElementById('bookAppointmentForm').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const params = new URLSearchParams(fd).toString();
    
    const btn = e.target.querySelector('.btn-submit');
    const originalText = btn.innerText;
    btn.innerText = 'Processing...';

    try {
        const res = await fetch('/api/appointments', {
            method: 'POST', body: params,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
        const ans = await res.json();
        if(ans.success) {
            alert('Appointment Booked Successfully!');
            closeModal('bookAppointmentModal');
            fetchAppointments();
            e.target.reset();
        } else {
            alert('Booking failed! Check if doctor is available on this date, and ensure Patient/Doctor IDs exist.');
        }
    } catch (e) {
        console.error(e);
        alert('Server Error.');
    } finally {
        btn.innerText = originalText;
    }
};
