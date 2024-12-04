import java.io.*;
import java.sql.*;
import jakarta.servlet.*;           
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;


@WebServlet("/changepass")   // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class ChangePassServlet extends HttpServlet {

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
      out.println("<head><title>Register</title>");
      out.println("<link rel=\"stylesheet\" href=\"css/login.css\">");
      out.println("<link rel=\"stylesheet\" href=\"./bootstrap/css/bootstrap.min.css\">");
      out.println("<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css\" integrity=\"sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N\" crossorigin=\"anonymous\">");
      out.println("<script src=\"https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js\" integrity=\"sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj\" crossorigin=\"anonymous\"></script>");
      out.println("<script src=\"https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js\" integrity=\"sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN\" crossorigin=\"anonymous\"></script>");
      out.println("<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js\" integrity=\"sha384-+sLIOodYLS7CIrQpBjl+C7nPvqq+FbNUBDunl/OZv93DB7Ln/533i8e/mZXLi/P+\" crossorigin=\"anonymous\"></script></head>");
      out.println("<body style=\"background-image: url(image/neon.png);\" >\r\n" + //
                    "\r\n" + //
                    "    <nav class=\"navbar bg-dark navbar-dark navbar-expand-sm sticky-top\">\r\n" + //
                    "        <div class=\"dropdown\">\r\n" + //
                    "            <a class=\"nav-item nav-link dropdown-toggle\" \r\n" + //
                    "            data-toggle = \"dropdown\" id=\"accountDropdown\"\r\n" + //
                    "            aria-haspopup=\"true\" aria-expanded=\"false\" \r\n" + //
                    "            href=\"#\">Account</a>\r\n" + //
                    "            <div class=\"dropdown-menu\" aria-labelledby=\"serviceDropDown\">\r\n" + //
                    "                <a class=\"dropdown-item\" id=\"ChangePass\" href=\"http://localhost:9999/myeshop/ChangePass.html\">Change Password</a>\r\n" + //
                    "                <a class=\"dropdown-item\" href=\"http://localhost:9999/myeshop/login.html\">Log Out</a>\r\n" + //
                    "            </div>\r\n" + //
                    "        </div>\r\n" + //
                    "        <button class=\"navbar-toggler\" type=\"button\"\r\n" + //
                    "        data-toggle=\"collapse\" data-target=\"#toggleNavbar\"\r\n" + //
                    "        aria-controls=\"toggleNavbar\" aria-expanded=\"false\"\r\n" + //
                    "        aria-label=\"toggleNavbar\">\r\n" + //
                    "            <span class=\"navbar-toggler-icon\"></span>\r\n" + //
                    "        </button>\r\n" + //
                    "        <div class=\"collapse navbar-collapse\" id=\"toggleNavbar\">\r\n" + //
                    "            <div class=\"navbar-nav mr-sm-auto\">\r\n" + //
                    "                <a class=\"nav-item nav-link\" id=\"home\" href=\"http://localhost:9999/myeshop/homepage_actual.html\">Home</a>\r\n" + //
                    "                \r\n" + //
                    "                <div class=\"dropdown\">\r\n" + //
                    "                    <a class=\"nav-item nav-link dropdown-toggle\" \r\n" + //
                    "                    data-toggle = \"dropdown\" id=\"serviceDropDown\"\r\n" + //
                    "                    aria-haspopup=\"true\" aria-expanded=\"false\" \r\n" + //
                    "                    href=\"#\">Brand</a>\r\n" + //
                    "\r\n" + //
                    "                    <div class=\"dropdown-menu\" aria-labelledby=\"serviceDropDown\">\r\n" + //
                    "                        <form method=\"get\" action=\"brandquery\">\r\n" + //
                    "                            <input type=\"hidden\" name=\"email\" id=\"hiddenEmail\">\r\n" + //
                    "                            <a class=\"dropdown-item\" href=\"#\" >\r\n" + //
                    "                                <input type=\"checkbox\" name=\"brand\" value=\"Apple\"> APPLE\r\n" + //
                    "                            </a>\r\n" + //
                    "                            <a class=\"dropdown-item\" href=\"#\" >\r\n" + //
                    "                                <input type=\"checkbox\" name=\"brand\" value=\"MSI\"> MSI\r\n" + //
                    "                            </a>\r\n" + //
                    "                            <a class=\"dropdown-item\" href=\"#\" >\r\n" + //
                    "                                <input type=\"checkbox\" name=\"brand\" value=\"Acer\"> ACER\r\n" + //
                    "                            </a>\r\n" + //
                    "                            <a class=\"dropdown-item\" href=\"#\" >\r\n" + //
                    "                                <input type=\"submit\" value=\"Search\" />\r\n" + //
                    "                            </a>\r\n" + //
                    "                        </form>\r\n" + //
                    "                    </div>\r\n" + //
                    "               \r\n" + //
                    "                </div>\r\n" + //
                    "                <a class=\"nav-item nav-link\" id=\"Contact\" href=\"http://localhost:9999/myeshop/Contactus.html\">Contact Us</a>\r\n" + //
                    "                <a class=\"nav-item nav-link\" id=\"Payment\" href=\"queryeqs\">Payment</a>\r\n" + //
                    "                <a class=\"nav-item nav-link\" id=\"Purchase\" href=\"orderquery\">My Order</a>\r\n" + //
                    "                \r\n" + //
                    "            </div>\r\n" + //
                    "        </div>\r\n" + //
                    "        <form class=\"form-inline\" method=\"get\" action=\"querysearch\">\r\n" + //
                    "            <div class=\"input-group\" role=\"group\">\r\n" + //
                    "                <input type=\"hidden\" name=\"email\" id=\"hiddenEmail1\">\r\n" + //
                    "                <input type=\"text\" class=\"form-control\" name=\"searchword\" placeholder=\"Keyword\">\r\n" + //
                    "                <button class=\"btn btn-outline-light\" type=\"submit\">Search</button>\r\n" + //
                    "            </div>\r\n" + //
                    "        </form>\r\n" + //
                    "    </nav>");
      out.println("    <div>\r\n" + //
                "        <div class=\"form-container\">\r\n" + //
                "            <div class=\"form-box\">");


      try (
            // Step 1: Allocate a database 'Connection' object
            Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/myeshop?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
                "kwshin", "Suigaise99"); // For MySQL
                // The format is: "jdbc:mysql://hostname:port/databaseName", "username", "password"

            // Step 2: Prepare the SQL statement
            PreparedStatement updateStmt = conn.prepareStatement(
                "UPDATE accounts SET password = ? WHERE email = ?");
        ) {
            // Step 3: Set parameter for the PreparedStatement to check email existence
            String email = request.getParameter("email");
            String password = request.getParameter("psw");
            String repeatPassword = request.getParameter("psw-repeat");
            if(password.equals(repeatPassword)) {
                // Step 5: Set parameters for the PreparedStatement to insert new record
                updateStmt.setString(1, password);
                updateStmt.setString(2, email);
            
                // Step 6: Execute the insertion query
                int rowsAffected = updateStmt.executeUpdate();
            
                if (rowsAffected > 0) {
                    // Insertion successful
                    out.println("<h1>Password changed successfully</h1>");
                } else {
                    // Insertion failed
                    out.println("<h1>Failed to changed password</h1>");
                }
            }
            else {
                out.println("<h1>Password does not match</h1>");
            }
            
        } catch (SQLException ex) {
            // Exception handling
            out.println("<h1>Error: " + ex.getMessage() + "</h1>");
            ex.printStackTrace();
        } // Step 5: Close conn and pstmt - Done automatically by try-with-resources (JDK 7)
        out.println("</div></div></div>");
        out.println("<script>\r\n" + //
                    "    document.addEventListener(\"DOMContentLoaded\", function() {\r\n" + //
                    "        console.log(\"Before updating dropdown\");\r\n" + //
                    "        const urlParams = new URLSearchParams(window.location.search);\r\n" + //
                    "        const email = urlParams.get('email');\r\n" + //
                    "        document.getElementById(\"accountDropdown\").textContent = email;\r\n" + //
                    "        document.getElementById(\"home\").href = \"home?email=\"+email;\r\n" + //
                    "        document.getElementById(\"Payment\").href = \"queryeqs?email=\"+email;\r\n" + //
                    "        document.getElementById(\"Purchase\").href = \"orderquery?email=\"+email;\r\n" + //
                    "        document.getElementById(\"hiddenEmail\").value = email;\r\n" + //
                    "        document.getElementById(\"hiddenEmail1\").value = email;\r\n" + //
                    "        document.getElementById(\"ChangePass\").href = \"http://localhost:9999/myeshop/ChangePass.html?email=\"+email;\r\n" + //
                    "        document.getElementById(\"Contact\").href = \"http://localhost:9999/myeshop/Contactus.html?email=\"+email;\r\n" + //
                    "        console.log(\"After updating dropdown\");\r\n" + //
                    "    });\r\n" + //
                    "</script>");
        out.println("</body></html>");
        out.close();
   }
}