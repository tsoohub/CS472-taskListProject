package controller;

import com.google.gson.Gson;
import model.Task;
import utility.DBConnection;
import utility.MockData;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/TaskServlet")
public class TaskServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        List<Task> taskList = new ArrayList<>();


        Connection db =  DBConnection.getConnection();

        String query = "SELECT * FROM task";
        try {
            Statement st = db.createStatement();
            ResultSet rs = st.executeQuery(query);
            while(rs.next()) {
                Task task = new Task(rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("due"),
                        rs.getString("category"),
                        rs.getInt("user_id"),
                        rs.getString("priority"));

                taskList.add(task);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        String JSONtasks = new Gson().toJson(taskList);



        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        out.write(JSONtasks);
    }
}
