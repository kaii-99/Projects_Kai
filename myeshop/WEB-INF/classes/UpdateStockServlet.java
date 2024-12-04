import java.io.*;
import java.sql.*;
import java.util.Arrays;

import jakarta.servlet.*;           
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;


@WebServlet("/updatestock")   // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class UpdateStockServlet extends HttpServlet {

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
      out.println("<head><title>Update_Stock</title></head>");
      out.println("<body>");

      try (
            // Step 1: Allocate a database 'Connection' object
            Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/myeshop?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
                "kwshin", "Suigaise99"); // For MySQL
                // The format is: "jdbc:mysql://hostname:port/databaseName", "username", "password"

            // Step 2: Prepare the SQL statement
            PreparedStatement updateStmt = conn.prepareStatement(
                "UPDATE laptops set qty = ? WHERE id = ?");
        ) {
            // Step 3: Set parameter for the PreparedStatement to check email existence

            String[] idStrings = request.getParameterValues("ID");
            String[] qtys = request.getParameterValues("qty");
            // Loop through each item and update the quantity
            for (int i = 0; i < idStrings.length; i++) {
                updateStmt.setString(1, qtys[i]);
                updateStmt.setString(2, idStrings[i]);
                updateStmt.executeUpdate();
            }
        
        } catch (SQLException ex) {
            // Exception handling
            out.println("<p>Error: " + ex.getMessage() + "</p>");
            ex.printStackTrace();
        } // Step 5: Close conn and pstmt - Done automatically by try-with-resources (JDK 7)

        out.println("<script>window.location.href=\"checkstock?email=" + request.getParameter("email") + "\";</script>");
        out.println("</body></html>");
        out.close();
   }
}
