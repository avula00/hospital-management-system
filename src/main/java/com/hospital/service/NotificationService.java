package com.hospital.service;

import com.hospital.model.Doctor;
import com.hospital.model.Patient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class NotificationService {
    public void sendAppointmentConfirmation(Patient patient, Doctor doctor, LocalDate date) {
        System.out.println("======================================================");
        System.out.println("📧 EMAIL SENT TO: " + patient.getName());
        System.out.println("📱 SMS SENT TO: " + patient.getName());
        System.out.println("💬 MESSAGE: Your appointment with Dr. " + doctor.getName() + " on " + date + " is confirmed.");
        System.out.println("======================================================");
    }
}
