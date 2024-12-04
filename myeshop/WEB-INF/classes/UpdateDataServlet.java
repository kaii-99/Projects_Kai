import java.io.*;
import java.sql.*;
import jakarta.servlet.*;           
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;


@WebServlet("/updatedata")   // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class UpdateDataServlet extends HttpServlet {

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
            PreparedStatement insertStmt = conn.prepareStatement(
                "UPDATE shopping_cart set qty = ? WHERE email = ? AND id = ?");
            PreparedStatement dstmt = conn.prepareStatement(
                "DELETE FROM shopping_cart WHERE email = ? AND id = ?;");
        ) {
            // Step 3: Set parameter for the PreparedStatement to check email existence

            String[] ids = request.getParameterValues("id");
            String[] emails = request.getParameterValues("email");
            String[] qtys = request.getParameterValues("qty");

            // Loop through each item and update the quantity
            for (int i = 0; i < ids.length; i++) {
                // Set parameters for the PreparedStatement to update quantity
                if (qtys[i].equals("0")) {
                    dstmt.setString(1, emails[i]);
                    dstmt.setString(2, ids[i]);
                    dstmt.executeUpdate();
                }
                else {
                    insertStmt.setString(1, qtys[i]);
                    insertStmt.setString(2, emails[i]);
                    insertStmt.setString(3, ids[i]);
                    insertStmt.executeUpdate();
                }
            }
        
        } catch (SQLException ex) {
            // Exception handling
            out.println("<p>Error: " + ex.getMessage() + "</p>");
            ex.printStackTrace();
        } // Step 5: Close conn and pstmt - Done automatically by try-with-resources (JDK 7)

        out.println("<script>window.location.href=\"queryeqs?email=" + request.getParameter("email") + "\";</script>");
        out.println("</body></html>");
        out.close();
   }
}
