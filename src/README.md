# 🏥 Hospital Management System

A modernized Hospital Management System built from scratch with a **Java Backend** and a **Glassmorphism Web UI Frontend**. This project is lightweight natively uses Java's Embedded HTTP Server to parse HTTP requests, requiring no complex build tools like Maven/Gradle, and interacts directly with a single MySQL Database via custom REST APIs.

## ✨ Features
- **🩺 Dashboard Overview:** Real-time statistics of total registered patients and doctors.
- **⚕️ Patient Management:** Add new patients to the registry, view all dynamically populated patients, and safely delete patient records (with automatically cascading SQL deletion for existing active appointments).
- **🧑‍⚕️ Doctor Directory:** View available medical staff and their specialized departments via Database fetching.
- **📅 Appointment Scheduling:** Book appointments dynamically using verified Patient and Doctor ID pairings mapping database primary keys.
- **🎨 Modern Web UI:** Fully customized frontend featuring Glassmorphism styling natively designed in CSS, blurred transparent active backgrounds, animated ambient gradients (blobs), and real-time asynchronous JavaScript integration without demanding page refreshes.

## 🛠️ Tech Stack
- **Backend:** Java (Core Java + `HttpServer` embedded REST API server)
- **Frontend:** Vanilla HTML5, CSS3 (Glassmorphism aesthetics & Animations), JavaScript (`fetch` promises & DOM Manipulation)
- **Database:** MySQL
- **Connectivity:** JDBC (`mysql-connector-j`)

## 🚀 How to Run Locally

### Prerequisites
1. **Java JDK 8+** installed configuration paths integrated cleanly.
2. **MySQL Server** installed and actively running on local port `3306`.
3. Valid `mysql-connector-j-9.6.0.jar` driver placed inside inner directory.

### Database Setup
Open your MySQL terminal or GUI (MySQL Workbench) and run the following queries to initialize the target schemas:
```sql
CREATE DATABASE hospital;
USE hospital;

CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL
);

CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL
);

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Insert arbitrary dummy doctors since the API focuses primarily on patients.
INSERT INTO doctors (name, specialization) VALUES
('Dr. Smith', 'Cardiologist'),
('Dr. John Doe', 'Neurologist'),
('Dr. Sarah', 'Orthopedic');
```

### Starting the Embedded Server
*(Ensure you modify the Database connection string URL, User, and Pass inside `HospitalManagementSystem.java` if your local SQL schema requires auth overriding!)*

1. Clone this target repository.
2. Open your standard terminal inside the main root `/src` directory workspace containing `.java` sources.
3. **Compile the runtime executable logic:**
   ```powershell
   javac -cp ".;HospitalManagementSystem\mysql-connector-j-9.6.0.jar" HospitalManagementSystem\*.java
   ```
4. **Boot up the Java Application Server Context:**
   ```powershell
   java -cp ".;HospitalManagementSystem\mysql-connector-j-9.6.0.jar" HospitalManagementSystem.HospitalManagementSystem
   ```
5. Open your desired Web browser and launch the interface at:
   **[http://localhost:8080](http://localhost:8080)**

## 📸 Interface Display
*(You can upload a screenshot of your dashboard here locally through GitHub's web interface and replace this text snippet!)*

---
*Created by avula00*
