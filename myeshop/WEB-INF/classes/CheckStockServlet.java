import java.io.*;
import java.sql.*;
import jakarta.servlet.*;           
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;


@WebServlet("/checkstock")   // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class CheckStockServlet extends HttpServlet {

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
      out.println("<head><title>Query Response</title>");
      out.println("<meta charset=\"UTF-8\">\r\n" + //
                  "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n" + //
                  "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n" + //
                  "    <title>Payment</title>\r\n" + //
                  "    <link rel=\"stylesheet\" href=\"css/style.css\">\r\n" + //
                  "    <link rel=\"stylesheet\" href=\"css/table.css\">\r\n" + //
                  "    <link rel=\"stylesheet\" href=\"./bootstrap/css/bootstrap.min.css\">\r\n" + //
                  "    <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css\" integrity=\"sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N\" crossorigin=\"anonymous\">\r\n" + //
                  "    <script src=\"https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js\" integrity=\"sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj\" crossorigin=\"anonymous\"></script>\r\n" + //
                  "    <script src=\"https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js\" integrity=\"sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN\" crossorigin=\"anonymous\"></script>\r\n" + //
                  "    <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js\" integrity=\"sha384-+sLIOodYLS7CIrQpBjl+C7nPvqq+FbNUBDunl/OZv93DB7Ln/533i8e/mZXLi/P+\" crossorigin=\"anonymous\"></script></head>");
      out.println("<body>\r\n" + //
                  "\r\n" + //
                  "<nav class=\"navbar bg-dark navbar-dark navbar-expand-sm sticky-top\">\r\n" + //
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
                  "                <a class=\"nav-item nav-link\" id=\"home\" href=\"home\">Home</a>\r\n" + //
                  "                \r\n" + //
                  "                <div class=\"dropdown\">\r\n" + //
                  "                    <a class=\"nav-item nav-link dropdown-toggle\" \r\n" + //
                  "                    data-toggle = \"dropdown\" id=\"serviceDropDown\"\r\n" + //
                  "                    aria-haspopup=\"true\" aria-expanded=\"false\" \r\n" + //
                  "                    href=\"#\">Brand</a>\r\n" + //
                  "\r\n" + //
                  "                    <div class=\"dropdown-menu\" aria-labelledby=\"serviceDropDown\">\r\n" + //
                  "                        <form method=\"get\" action=\"brandquery\">\r\n" + //
                  "                            <input type=\"hidden\" name=\"email\" id=\"hiddenEmail\" value=\""+request.getParameter("email")+"\">\r\n" + //
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
                  "                 <input type=\"hidden\" name=\"email\" id=\"hiddenEmail\" value=\""+request.getParameter("email")+"\">\r\n" + //
                  "                <input type=\"text\" class=\"form-control\" name=\"searchword\" placeholder=\"Keyword\">\r\n" + //
                  "                <button class=\"btn btn-outline-light\" type=\"submit\">Search</button>\r\n" + //
                  "            </div>\r\n" + //
                  "        </form>\r\n" + //
                  "    </nav>\r\n" + //
                  "<div class=\"payment-container\">\r\n" + //
                  "    <div class=\"table\">\r\n" + //
                  "        <form action=\"updatestock\">\r\n" + //
                  "            <table>\r\n");

      try (
         // Step 1: Allocate a database 'Connection' object
         Connection conn = DriverManager.getConnection(
               "jdbc:mysql://localhost:3306/myeshop?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
               "kwshin", "Suigaise99");   // For MySQL
               // The format is: "jdbc:mysql://hostname:port/databaseName", "username", "password"

         // Step 2: Allocate a 'Statement' object in the Connection
         PreparedStatement searchstmt = conn.prepareStatement(
            "SELECT * FROM laptops");
      ) {
         // Step 3: Execute a SQL SELECT query
         ResultSet rset = searchstmt.executeQuery();

         if (rset.next()) {
            String checkbrand = null;
             out.println("<form method='get' action=''>");
             // Process the ResultSet and print the products
             do {
               if (rset.getString("brand").equals(checkbrand)) {
                  out.println("<tr>\r\n" +//
                              "<td><img src=\"image/"+rset.getString("id")+".png\" name=\"ID\" value=\""+rset.getString("id")+"\"></td>\r\n" +//
                              "<td name=\"model\" value=\""+rset.getString("model")+"\">"+rset.getString("model")+"</td>\r\n" +//
                              "<td name=\"price\" value=\""+rset.getString("price")+"\">$"+rset.getString("price")+"</td>\r\n" +//
                              "<td>Stock: "+rset.getString("qty")+"</td>\r\n" +//
                              "<td><input type=\"hidden\" name=\"email\" value=\""+request.getParameter("email")+"\">\r\n" +//
                              "<input type=\"hidden\" name=\"ID\" value=\""+rset.getString("id")+"\">\r\n" +//
                              "Qty: <input type=\"number\" name=\"qty\" value=\""+rset.getString("qty")+"\" min=\"0\"></td>\r\n" +//
                              "</tr>");
               }
               else {
                  checkbrand = rset.getString("brand");
                  out.println("<tr>\r\n" +//
                              "<th colspan=\"5\">"+ rset.getString("brand") +"</th>\r\n" +//
                              "</tr>\r\n" +//
                              "<tr>\r\n" +//
                              "<td><img src=\"image/"+rset.getString("id")+".png\" name=\"ID\" value=\""+rset.getString("id")+"\"></td>\r\n" +//
                              "<td name=\"model\" value=\""+rset.getString("model")+"\">"+rset.getString("model")+"</td>\r\n" +//
                              "<td name=\"price\" value=\""+rset.getString("price")+"\">$"+rset.getString("price")+"</td>\r\n" +//
                              "<td>Stock: "+rset.getString("qty")+"</td>\r\n" +//
                              "<td><input type=\"hidden\" name=\"email\" value=\""+request.getParameter("email")+"\">\r\n" +//
                              "<input type=\"hidden\" name=\"ID\" value=\""+rset.getString("id")+"\">\r\n" +//
                              "Qty: <input type=\"number\" name=\"qty\" value=\""+rset.getString("qty")+"\" min=\"0\"></td>\r\n" +//
                              "</tr>");
               }
            } while (rset.next());
            out.println("</table>\r\n" + //
                            "<button type=\"submit\" class=\"save-btn\">Save</button>\r\n" + //
                            "</form>\r\n" + //
                            "</div>\r\n" + //
                            "</div>\r\n");
         } else {
             // No products found
             out.println("<p>No products found.</p>");
         }

      } catch(Exception ex) {
         out.println("<p>Error: " + ex.getMessage() + "</p>");
         out.println("<p>Check Tomcat console for details.</p>");
         ex.printStackTrace();
      }  // Step 5: Close conn and stmt - Done automatically by try-with-resources (JDK 7)
      out.println("<script src=\"https://code.jquery.com/jquery-3.6.0.min.js\"></script>\r\n" + //
                  "<script>\r\n" + //
                  "document.addEventListener(\"DOMContentLoaded\", function() {\r\n" + //
                  "console.log(\"Before updating dropdown\");\r\n" + //
                  "const urlParams = new URLSearchParams(window.location.search);\r\n" + //
                  "const email = urlParams.get('email');\r\n" + //
                  "document.getElementById(\"accountDropdown\").textContent = email;\r\n" + //
                  "document.getElementById(\"home\").href = \"home?email=\"+email;\r\n" + //
                  "document.getElementById(\"Payment\").href = \"queryeqs?email=\"+email;\r\n"+ //
                  "document.getElementById(\"Purchase\").href = \"orderquery?email=\"+email;\r\n"+ //
                  "document.getElementById(\"ChangePass\").href = \"http://localhost:9999/myeshop/ChangePass.html?email=\"+email;\r\n" + //
                  "document.getElementById(\"Contact\").href = \"http://localhost:9999/myeshop/Contactus.html?email=\"+email;\r\n" + //
                  "document.getElementById(\"hiddenEmail\").value = email;\r\n"+ //
                  "document.getElementById(\"hiddenEmail1\").value = email;\r\n"+ //
                  "document.getElementById(\"Updatedata\").href = \"updatedata?email=\"+email;\r\n" + //
                  "console.log(\"After updating dropdown\");\r\n" + //
                  "});\r\n" + //
                  "$(document).ready(function() {\r\n" + //
                  "// Function to calculate total price\r\n" + //
                  "function calculateTotalPrice() {\r\n" + //
                  "var total = 0;\r\n" + //
                  "$('table tr:not(:last-child)').each(function() {\r\n" + //
                  "var subtotal = 0;\r\n" + //
                  "var quantity = parseInt($(this).find('.quantity-input').val());\r\n" + //
                  "var price = parseFloat($(this).find('td:nth-child(4)').text()); // Adjusted to target the price column\r\n" + //
                  "if (!isNaN(quantity) && !isNaN(price)) { // Check if quantity and price are valid numbers\r\n" + //
                  "total += quantity * price;\r\n" + //
                  "subtotal = quantity * price;\r\n" + //
                  "$(this).find('.subtotal').text(subtotal.toFixed(2));\r\n" + //
                  "} else {\r\n" + //
                  "console.log('Invalid quantity or price:', quantity, price);\r\n" + //
                  "}\r\n" + //
                  "});\r\n" + //
                  "$('#totalPrice').text(total.toFixed(2));\r\n" + //
                  "}\r\n" + //
                  "// Call calculateTotalPrice on page load\r\n" + //
                  "calculateTotalPrice();\r\n" + //
                  "// Call calculateTotalPrice whenever quantity changes\r\n" + //
                  "$('.quantity-input').on('input', function() {\r\n" + //
                  "calculateTotalPrice();\r\n" + //
                  "});\r\n" + //
                  "});\r\n" + //
                  "</script>");

      out.println("</body></html>");
      out.close();
   }
}

