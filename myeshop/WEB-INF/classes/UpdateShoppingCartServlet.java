import java.io.*;
import java.sql.*;
import java.util.Arrays;

import jakarta.servlet.*;           
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;


@WebServlet("/updatesc")   // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class UpdateShoppingCartServlet extends HttpServlet {

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
      out.println("<head><title>Adding_To_Shopping_Cart</title></head>");
      out.println("<body>");

      System.out.println("Email: " + Arrays.toString(request.getParameterValues("email")));
      System.out.println("IDs: " + Arrays.toString(request.getParameterValues("ID")));
      System.out.println("Prices: " + Arrays.toString(request.getParameterValues("price")));
      System.out.println("Models: " + Arrays.toString(request.getParameterValues("model")));
      System.out.println("Qtys: " + Arrays.toString(request.getParameterValues("qty")));

      try (
            // Step 1: Allocate a database 'Connection' object
            Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/myeshop?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
                "kwshin", "Suigaise99"); // For MySQL
                // The format is: "jdbc:mysql://hostname:port/databaseName", "username", "password"

            // Step 2: Prepare the SQL statement
            PreparedStatement updateStmt = conn.prepareStatement(
                "UPDATE shopping_cart set qty = qty + ? WHERE email = ? AND id = ?");
            PreparedStatement insertStmt = conn.prepareStatement(
                "INSERT INTO shopping_cart values (?, ?, ?, ?, ?)");
            PreparedStatement checkStmt = conn.prepareStatement(
                "SELECT * FROM shopping_cart WHERE email = ?");
        ) {
            // Step 3: Set parameter for the PreparedStatement to check email existence

            String[] idStrings = request.getParameterValues("ID");
            int[] ids = Arrays.stream(idStrings)
                 .mapToInt(Integer::parseInt)
                 .toArray();
            String[] emails = request.getParameterValues("email");
            String[] prices = request.getParameterValues("price");
            String[] models = request.getParameterValues("model");
            String[] qtys = request.getParameterValues("qty");
            checkStmt.setString(1, emails[0]);
            ResultSet cs = checkStmt.executeQuery();

            // Loop through each item and update the quantity
            for (int i = 0; i < ids.length; i++) {
                int qty = Integer.parseInt(qtys[i]); // Parse qty to an integer
                if (qty > 0) {
                    boolean found = false;
                    while (cs.next()){
                        var checkid = cs.getString("id");
                        if(ids[i]== Integer.parseInt(checkid)) {
                            updateStmt.setString(1, qtys[i]);
                            updateStmt.setString(2, emails[i]);
                            updateStmt.setString(3, idStrings[i]);
                            updateStmt.executeUpdate();
                            found = true;
                            break;
                        }
                    }
                    if (!found){
                        insertStmt.setString(1, emails[i]);
                        insertStmt.setInt(2, ids[i]);
                        insertStmt.setString(3, models[i]);
                        insertStmt.setString(4, prices[i]);
                        insertStmt.setString(5, qtys[i]);
                        insertStmt.executeUpdate();
                    }
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
