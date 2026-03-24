package HospitalManagementSystem;

import java.sql.*;

public class Patient {
    private Connection connection;

    public Patient(Connection connection){
        this.connection = connection;
    }

    public boolean addPatient(String name, int age, String gender){
        try{
            String query = "INSERT INTO patients(name, age, gender) VALUES(?, ?, ?)";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, name);
            preparedStatement.setInt(2, age);
            preparedStatement.setString(3, gender);
            int affectedRows = preparedStatement.executeUpdate();
            return affectedRows > 0;
        }catch (SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public boolean deletePatient(int id){
        try{
            // Cascade delete any appointments to avoid SQL constraints
            String apptQuery = "DELETE FROM appointments WHERE patient_id = ?";
            PreparedStatement psAppt = connection.prepareStatement(apptQuery);
            psAppt.setInt(1, id);
            psAppt.executeUpdate();

            String query = "DELETE FROM patients WHERE id = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setInt(1, id);
            int affectedRows = preparedStatement.executeUpdate();
            return affectedRows > 0;
        }catch (SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public String viewPatientsJson(){
        StringBuilder json = new StringBuilder("[");
        String query = "select * from patients";
        try{
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            ResultSet resultSet = preparedStatement.executeQuery();
            boolean first = true;
            while(resultSet.next()){
                if(!first) json.append(",");
                int id = resultSet.getInt("id");
                String name = resultSet.getString("name");
                int age = resultSet.getInt("age");
                String gender = resultSet.getString("gender");
                
                json.append("{")
                    .append("\"id\":").append(id).append(",")
                    .append("\"name\":\"").append(name.replace("\"", "\\\"")).append("\",")
                    .append("\"age\":").append(age).append(",")
                    .append("\"gender\":\"").append(gender.replace("\"", "\\\"")).append("\"")
                    .append("}");
                first = false;
            }
        }catch (SQLException e){
            e.printStackTrace();
        }
        json.append("]");
        return json.toString();
    }

    public boolean getPatientById(int id){
        String query = "SELECT * FROM patients WHERE id = ?";
        try{
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            return resultSet.next();
        }catch (SQLException e){
            e.printStackTrace();
        }
        return false;
    }
}
