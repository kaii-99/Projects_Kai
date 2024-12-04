import java.io.*;
import java.sql.*;
import jakarta.servlet.*;           
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;


@WebServlet("/register")   // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class RegisterServlet extends HttpServlet {

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
      out.println("<head><title>Register</title></head>");
      out.println("<body>");

      try (
            // Step 1: Allocate a database 'Connection' object
            Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/myeshop?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
                "kwshin", "Suigaise99"); // For MySQL
                // The format is: "jdbc:mysql://hostname:port/databaseName", "username", "password"

            // Step 2: Prepare the SQL statement
            PreparedStatement checkStmt = conn.prepareStatement(
            "SELECT * FROM accounts WHERE email = ?");
            PreparedStatement insertStmt = conn.prepareStatement(
                "INSERT INTO accounts (email, password) VALUES (?, ?)");
        ) {
            // Step 3: Set parameter for the PreparedStatement to check email existence
            String email = request.getParameter("email");
            checkStmt.setString(1, email);

            // Step 4: Execute the query to check if email exists
            ResultSet rs = checkStmt.executeQuery();

            if (rs.next()) {
                // Email already exists
                // You can handle this case accordingly, for example, return an error message
                // or redirect the user to a registration page again
                out.println("<p>Email already exists</p>");
            } else {
                // Email does not exist, proceed with insertion
                String password = request.getParameter("psw");
                String repeatPassword = request.getParameter("psw-repeat");
                if(password.equals(repeatPassword)) {
                    // Step 5: Set parameters for the PreparedStatement to insert new record
                    insertStmt.setString(1, email);
                    insertStmt.setString(2, password);
                
                    // Step 6: Execute the insertion query
                    int rowsAffected = insertStmt.executeUpdate();
                
                    if (rowsAffected > 0) {
                        // Insertion successful
                        out.println("<p>Account created successfully</p>");
                    } else {
                        // Insertion failed
                        out.println("<p>Failed to create account</p>");
                    }
                }

                else {
                    out.println("<p>Password does not match</p>");
                }
            }
        } catch (SQLException ex) {
            // Exception handling
            out.println("<p>Error: " + ex.getMessage() + "</p>");
            ex.printStackTrace();
        } // Step 5: Close conn and pstmt - Done automatically by try-with-resources (JDK 7)

        out.println("<button type='submit' onclick='window.location.href=\"http://localhost:9999/myeshop/login.html\"'>Back</button>");
        out.println("</body></html>");
        out.close();
   }
}