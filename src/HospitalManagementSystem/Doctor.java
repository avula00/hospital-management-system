package HospitalManagementSystem;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Doctor {
    private Connection connection;

    public Doctor(Connection connection){
        this.connection = connection;
    }

    public String viewDoctorsJson(){
        StringBuilder json = new StringBuilder("[");
        String query = "select * from doctors";
        try{
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            ResultSet resultSet = preparedStatement.executeQuery();
            boolean first = true;
            while(resultSet.next()){
                if(!first) json.append(",");
                int id = resultSet.getInt("id");
                String name = resultSet.getString("name");
                String specialization = resultSet.getString("specialization");
                
                json.append("{")
                    .append("\"id\":").append(id).append(",")
                    .append("\"name\":\"").append(name.replace("\"", "\\\"")).append("\",")
                    .append("\"specialization\":\"").append(specialization.replace("\"", "\\\"")).append("\"")
                    .append("}");
                first = false;
            }
        }catch (SQLException e){
            e.printStackTrace();
        }
        json.append("]");
        return json.toString();
    }

    public boolean getDoctorById(int id){
        String query = "SELECT * FROM doctors WHERE id = ?";
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
