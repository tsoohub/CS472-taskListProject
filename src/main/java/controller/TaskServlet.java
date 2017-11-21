package controller;

import com.google.gson.Gson;
import model.Task;
import model.Team;
import model.User;
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

        Connection db =  DBConnection.getConnection();
        String type = request.getParameter("type");
        String name = request.getParameter("name");
        String due = request.getParameter("due");
        String category = request.getParameter("category");
        int userid = Integer.parseInt(request.getParameter("userid")) ;
        String priority = request.getParameter("priority");
        int team = Integer.parseInt(request.getParameter("team"));

        System.out.println(type+" "+name+" "+due+" "+category+ " "+userid+" "+priority+" "+team);

        String query = "";
        if(type != null && type.equals("add")) {
            query = "INSERT INTO task(name, due, category, user_id, priority, team_id) VALUES ('" +name +"', '" + due + "', '" +category +"'," + userid + ",'" + priority +"'," + team+")";
            try {
                PreparedStatement preparedStmt = db.prepareStatement(query);
                preparedStmt.execute();

            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        Connection db =  DBConnection.getConnection();

        String query = "";
        String JSONtasks = "";
        String param = request.getParameter("reqtype");

        if(param != null && param.equals("usercombo")) {

           List<User> userList = new ArrayList<>();
           query = "SELECT * FROM user";

            try {
                Statement st = db.createStatement();
                ResultSet rs = st.executeQuery(query);
                while(rs.next()) {
                    User user = new User(rs.getInt("id"), rs.getString("name"));
                    userList.add(user);
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            JSONtasks = new Gson().toJson(userList);
        }
        else if(param != null && param.equals("team")) {

            List<Team> teamList = new ArrayList<>();
            query = "SELECT * FROM team";

            try {
                Statement st = db.createStatement();
                ResultSet rs = st.executeQuery(query);
                while(rs.next()) {
                    Team user = new Team(rs.getInt("id"), rs.getString("name"));
                    teamList.add(user);
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            JSONtasks = new Gson().toJson(teamList);
        }
        else {
            String userid = request.getParameter("user");

            List<Task> taskList = new ArrayList<>();

            if (userid == null || userid=="") {
                query = "SELECT task.id,task.name,task.due,task.category,task.user_id,user.name as username,task.priority FROM task left join user on task.user_id = user.id";
            }
            else
                query = "SELECT task.id,task.name,task.due,task.category,task.user_id,user.name as username,task.priority FROM task left join user on task.user_id = user.id where task.user_id = "+userid;
            try {
                Statement st = db.createStatement();
                ResultSet rs = st.executeQuery(query);
                while(rs.next()) {
                    Task task = new Task(rs.getInt("id"),
                            rs.getString("name"),
                            rs.getString("due"),
                            rs.getString("category"),
                            rs.getInt("user_id"),
                            rs.getString("username"),
                            rs.getString("priority"));

                    taskList.add(task);
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            JSONtasks = new Gson().toJson(taskList);
        }


        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        out.write(JSONtasks);
    }
}
