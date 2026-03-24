package com.hospital.service;

import com.hospital.model.Patient;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public PatientService(PatientRepository patientRepository, AppointmentRepository appointmentRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Page<Patient> searchPatients(String name, int page, int size) {
        return patientRepository.findByNameContainingIgnoreCase(name, PageRequest.of(page, size));
    }

    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    @Transactional
    public void deletePatient(Long id) {
        appointmentRepository.deleteByPatientId(id);
        patientRepository.deleteById(id);
    }
}
