package utility;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class DBConnection {

    static Connection connection = null;


    public static Connection getConnection() {

        if (connection != null)
            return connection;
        else {
            try {
                Class.forName("com.mysql.jdbc.Driver");
                connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/tasklist", "root", "");
            } catch (Exception e2) {
                System.out.println(e2);
            }
            return connection;
        }
    }
}
