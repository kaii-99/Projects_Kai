import java.io.*;
import java.sql.*;
import jakarta.servlet.*;           
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;


@WebServlet("/login")   // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class LoginServlet extends HttpServlet {

   // The doGet() runs once per HTTP GET request to this servlet.
   @Override
   public void doGet(HttpServletRequest request, HttpServletResponse response)
               throws ServletException, IOException {
      // Set the MIME type for the response message
      response.setContentType("text/html");
      // Get a output writer to write the response message into the network socket
      PrintWriter out = response.getWriter();

      // Print an HTML page as the output of the query
      out.println("<!DOCTYPE html>");
      out.println("<html>");
      out.println("<head><title>Login</title></head>");
      out.println("<body>");

      try (
            // Step 1: Allocate a database 'Connection' object
            Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/myeshop?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
                "kwshin", "Suigaise99"); // For MySQL
                // The format is: "jdbc:mysql://hostname:port/databaseName", "username", "password"

            // Step 2: Prepare the SQL statement
            PreparedStatement checkAcc = conn.prepareStatement(
                "SELECT * FROM accounts WHERE email = ?");
            PreparedStatement checkStmt = conn.prepareStatement(
                "SELECT * FROM accounts WHERE email = ? AND password = ?");
        ) {
            // Step 3: Set parameter for the PreparedStatement to check email existence
            checkAcc.setString(1, request.getParameter("email"));
            checkStmt.setString(2, request.getParameter("psw"));

            // Step 4: Execute the query to check if email and password exists
            ResultSet rs = checkAcc.executeQuery();

            if (rs.next()) {
                // Email already exists
                // You can handle this case accordingly, for example, return an error message
                // or redirect the user to a registration page again
                checkStmt.setString(1, request.getParameter("email"));
                checkStmt.setString(2, request.getParameter("psw"));
                
                ResultSet ps = checkStmt.executeQuery();
                
                if (ps.next()) {
                    out.println("<script>window.location.href=\"home?email=" + request.getParameter("email") + "\";</script>");
                }
                else {
                    out.println("<p>Wrong password</p>");
                    out.println("<button type='button' onclick='window.location.href=\"http://localhost:9999/myeshop/login.html\"'>Back</button>");
                }
            } else {
                out.println("<p>Account does not exist</p>");
                out.println("<button type='button' onclick='window.location.href=\"http://localhost:9999/myeshop/login.html\"'>Back</button>");
            }
        } catch (SQLException ex) {
            // Exception handling
            out.println("<p>Error: " + ex.getMessage() + "</p>");
            ex.printStackTrace();
        } // Step 5: Close conn and pstmt - Done automatically by try-with-resources (JDK 7)

        out.println("</body></html>");
        out.close();
   }
}
