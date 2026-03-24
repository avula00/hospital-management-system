# 🏥 Enterprise Hospital Management System

A production-ready Hospital Management platform completely upgraded from a legacy Java console application into a full-scale **Spring Boot MVC** backend and a **React Single-Page Application (SPA)** interface.

## ✨ Key Features
- **Interactive React Dashboard**: Beautiful glassmorphism UI providing instant state-loads without browser refreshing.
- **RESTful API**: Complete MVC CRUD operations linking seamlessly via `/api/patients`, `/api/doctors`, and `/api/appointments`.
- **JWT Security**: Hardened stateless endpoints mapping using Spring Security and JSON Web Tokens via `BCrypt`.
- **Smart Validations**: Custom Global Exception Handlers stopping Appointment Date/Conflict collisions locally.
- **Pagination & Search**: Native Spring Data JPA repository queries enabling high-scale dynamic search.
- **Event Driven Actions**: Simulated native SMS/Email notification hook structures on successful bookings.

## 🛠️ Technology Stack
- **Backend:** Java 17, Spring Boot 3.2.4, Spring Security, Hibernate (JPA), Maven
- **Database:** MySQL 8 Native
- **Frontend:** React 18, Babel, Pure Vanilla CSS (Zero-Dependency Zero-Build injection deployment)

## 🚀 How to Run Locally

### 1. Database Setup
Make sure you have your MySQL service actively running on port `3306` with the `hospital` database initialized.
* Username: `root`
* *Credentials configured natively inside `src/main/resources/application.properties`*

### 2. Start the Backend
Open your terminal inside this primary project folder and execute the backend bootloader:
```bash
mvn spring-boot:run
```
*(The Spring Boot Application Server will map natively to `http://localhost:8080`)*

### 3. Open the Frontend
Because the React UI was built as a highly-optimized unpkg CDN dependency layout, you **do not need Node.js or Vite natively built**! 
Simply open your File Explorer and **double-click the `react-frontend.html` file**, and your complete Dashboard will load instantly in any modern web browser.

---
*Architected and Upgraded to a Product-Level Codebase standard.*
