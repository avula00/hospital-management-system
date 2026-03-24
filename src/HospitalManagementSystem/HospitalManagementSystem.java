package HospitalManagementSystem;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.nio.file.Files;
import java.io.File;

public class HospitalManagementSystem {
    private static final String url = "jdbc:mysql://localhost:3306/hospital";
    private static final String username = "root";
    private static final String password = "(0977_@sunny)";
    static Connection connection;

    public static void main(String[] args) throws Exception {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            connection = DriverManager.getConnection(url, username, password);
            System.out.println("Database connected!");
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        server.createContext("/", new StaticFileHandler());
        
        Patient patient = new Patient(connection);
        Doctor doctor = new Doctor(connection);
        
        server.createContext("/api/patients", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if ("GET".equals(exchange.getRequestMethod())) {
                    String response = patient.viewPatientsJson();
                    sendResponse(exchange, 200, response);
                } else if ("POST".equals(exchange.getRequestMethod())) {
                    InputStream is = exchange.getRequestBody();
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    
                    String[] parts = body.split("&");
                    String name = URLDecoder.decode(parts[0].split("=")[1], StandardCharsets.UTF_8.name());
                    int age = Integer.parseInt(parts[1].split("=")[1]);
                    String gender = URLDecoder.decode(parts[2].split("=")[1], StandardCharsets.UTF_8.name());
                    
                    boolean success = patient.addPatient(name, age, gender);
                    sendResponse(exchange, 200, "{\"success\":" + success + "}");
                } else if ("DELETE".equals(exchange.getRequestMethod())) {
                    String query = exchange.getRequestURI().getQuery();
                    if (query != null && query.startsWith("id=")) {
                        int id = Integer.parseInt(query.split("=")[1]);
                        boolean success = patient.deletePatient(id);
                        sendResponse(exchange, 200, "{\"success\":" + success + "}");
                    } else {
                        sendResponse(exchange, 400, "{\"success\":false}");
                    }
                }
            }
        });

        server.createContext("/api/doctors", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if ("GET".equals(exchange.getRequestMethod())) {
                    String response = doctor.viewDoctorsJson();
                    sendResponse(exchange, 200, response);
                }
            }
        });

        server.createContext("/api/appointments", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                if ("GET".equals(exchange.getRequestMethod())) {
                    String response = viewAppointmentsJson();
                    sendResponse(exchange, 200, response);
                } else if ("POST".equals(exchange.getRequestMethod())) {
                    InputStream is = exchange.getRequestBody();
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    
                    String[] parts = body.split("&");
                    int patientId = Integer.parseInt(parts[0].split("=")[1]);
                    int doctorId = Integer.parseInt(parts[1].split("=")[1]);
                    String date = URLDecoder.decode(parts[2].split("=")[1], StandardCharsets.UTF_8.name());
                    
                    boolean success = bookAppointment(patient, doctor, patientId, doctorId, date);
                    sendResponse(exchange, 200, "{\"success\":" + success + "}");
                }
            }
        });

        server.setExecutor(null);
        server.start();
        System.out.println("Web server started on http://localhost:8080");
        System.out.println("Press Ctrl+C to stop.");
    }

    private static void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(statusCode, response.getBytes(StandardCharsets.UTF_8).length);
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes(StandardCharsets.UTF_8));
        os.close();
    }

    public static String viewAppointmentsJson() {
        StringBuilder json = new StringBuilder("[");
        String query = "SELECT a.id, p.name AS patient_name, d.name AS doctor_name, a.appointment_date FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN doctors d ON a.doctor_id = d.id";
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            ResultSet resultSet = preparedStatement.executeQuery();
            boolean first = true;
            while(resultSet.next()) {
                if(!first) json.append(",");
                int id = resultSet.getInt("id");
                String patientName = resultSet.getString("patient_name");
                String doctorName = resultSet.getString("doctor_name");
                String date = resultSet.getString("appointment_date");
                
                json.append("{")
                    .append("\"id\":").append(id).append(",")
                    .append("\"patient_name\":\"").append(patientName.replace("\"", "\\\"")).append("\",")
                    .append("\"doctor_name\":\"").append(doctorName.replace("\"", "\\\"")).append("\",")
                    .append("\"date\":\"").append(date.replace("\"", "\\\"")).append("\"")
                    .append("}");
                first = false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        json.append("]");
        return json.toString();
    }

    private static boolean bookAppointment(Patient patient, Doctor doctor, int patientId, int doctorId, String appointmentDate) {
        if (patient.getPatientById(patientId) && doctor.getDoctorById(doctorId)) {
            if (checkDoctorAvailability(doctorId, appointmentDate)) {
                String appointmentQuery = "INSERT INTO appointments(patient_id, doctor_id, appointment_date) VALUES(?, ?, ?)";
                try {
                    PreparedStatement preparedStatement = connection.prepareStatement(appointmentQuery);
                    preparedStatement.setInt(1, patientId);
                    preparedStatement.setInt(2, doctorId);
                    preparedStatement.setString(3, appointmentDate);
                    int rowsAffected = preparedStatement.executeUpdate();
                    return rowsAffected > 0;
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return false;
    }

    public static boolean checkDoctorAvailability(int doctorId, String appointmentDate) {
        String query = "SELECT COUNT(*) FROM appointments WHERE doctor_id = ? AND appointment_date = ?";
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setInt(1, doctorId);
            preparedStatement.setString(2, appointmentDate);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                int count = resultSet.getInt(1);
                return count == 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/")) {
                path = "/index.html";
            }
            
            File file = new File("HospitalManagementSystem/static" + path);
            if (!file.exists()) {
                file = new File("static" + path);
            }
            if (!file.exists()) {
                String response = "404 Not Found";
                exchange.sendResponseHeaders(404, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
                return;
            }
            
            String mime = "text/plain";
            if (path.endsWith(".html")) mime = "text/html";
            else if (path.endsWith(".css")) mime = "text/css";
            else if (path.endsWith(".js")) mime = "application/javascript";
            
            exchange.getResponseHeaders().set("Content-Type", mime);
            exchange.sendResponseHeaders(200, file.length());
            OutputStream os = exchange.getResponseBody();
            Files.copy(file.toPath(), os);
            os.close();
        }
    }
}
