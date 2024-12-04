import java.io.*;
import java.sql.*;
import jakarta.servlet.*;           
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;


@WebServlet("/orderquery")   // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class OrderQueryServlet extends HttpServlet {

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
                  "    <link rel=\"stylesheet\" href=\"css/table2.css\">\r\n" + //
                  "    <link rel=\"stylesheet\" href=\"./bootstrap/css/bootstrap.min.css\">\r\n" + //
                  "    <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css\" integrity=\"sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N\" crossorigin=\"anonymous\">\r\n" + //
                  "    <script src=\"https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js\" integrity=\"sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj\" crossorigin=\"anonymous\"></script>\r\n" + //
                  "    <script src=\"https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js\" integrity=\"sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN\" crossorigin=\"anonymous\"></script>\r\n" + //
                  "    <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js\" integrity=\"sha384-+sLIOodYLS7CIrQpBjl+C7nPvqq+FbNUBDunl/OZv93DB7Ln/533i8e/mZXLi/P+\" crossorigin=\"anonymous\"></script></head>");
      out.println("<body style=\"background-image: url(image/neon.png);\" >\r\n" + //
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
                  "    </nav>");
      try (
         // Step 1: Allocate a database 'Connection' object
         Connection conn = DriverManager.getConnection(
               "jdbc:mysql://localhost:3306/myeshop?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
               "kwshin", "Suigaise99");   // For MySQL
               // The format is: "jdbc:mysql://hostname:port/databaseName", "username", "password"

         // Step 2: Allocate a 'Statement' object in the Connection
         Statement stmt = conn.createStatement();
         
      ) {
         String AccStr = "SELECT * FROM customers_order WHERE email = ?";
         PreparedStatement checkAcc = conn.prepareStatement(AccStr);
         checkAcc.setString(1, request.getParameter("email"));
         // Step 3: Execute a SQL SELECT query
         ResultSet rs = checkAcc.executeQuery();
   
         out.println("<div class=\"payment-container\">\r\n");
         out.println("<div class=\"table\">\r\n");
         out.println("<h1 style=\"color: orange\">Order Summary</h1>\r\n");
         out.println("<table class=\"product-table\">");
         if (rs.next()) {
            String sqlStr = "SELECT customers_order.date, customers_order.email, customers_order.id, customers_order.qty_ordered, laptops.id, laptops.model, laptops.price "+ 
                            "FROM customers_order, laptops "+
                            "WHERE customers_order.id = laptops.id " +
                            "AND customers_order.email = ?";
            PreparedStatement pstmt = conn.prepareStatement(sqlStr);
            pstmt.setString(1, request.getParameter("email"));
            ResultSet rset = pstmt.executeQuery();
            String checkdate = null;
            int i =0;
            int num = 1;
            while(rset.next()) {
               if(rset.getString("customers_order.date").equals(checkdate)){
                  out.println("<tr>\r\n"+ //
                  "<td>"+ rset.getString("customers_order.id") +"</td>\r\n"+ //
                  "<td>"+ rset.getString("laptops.model") +"</td>\r\n"+ //
                  "<td>"+ rset.getString("customers_order.qty_ordered") +"</td>\r\n"+ //
                  "<td>"+ String.format("%.2f", rset.getDouble("laptops.price")) +"</td>\r\n"+ //
                  "<td class=\"subtotal\"></td>\r\n"+ //
                  "</tr>\r\n");
               }
               else {
                  if (i > 0) {
                     out.println("<tr>\r\n" + //
                        "<td colspan=\"4\">Total</td>\r\n" + //
                        "<td id=\"totalPrice"+num+"\"></td>\r\n" + //
                        "</tr>\r\n");
                        num++;
                  }
                  checkdate = rset.getString("customers_order.date");
                  out.println("<tr><th colspan=\"5\">"+rset.getString("customers_order.date")+"</th></tr>\r\n" + //
                              "<tr>\r\n" + //
                              "<th>ID</th>\r\n" + //
                              "<th>Items</th>\r\n" + //
                              "<th>Quantity</th>\r\n" + //
                              "<th>Price</th>\r\n" + //
                              "<th>Subtotal</th>\r\n" + //
                              "</tr>\r\n");
                  out.println("<tr>\r\n"+ //
                              "<td>"+ rset.getString("customers_order.id") +"</td>\r\n"+ //
                              "<td>"+ rset.getString("laptops.model") +"</td>\r\n"+ //
                              "<td>"+ rset.getString("customers_order.qty_ordered") +"</td>\r\n"+ //
                              "<td>"+ String.format("%.2f", rset.getDouble("laptops.price")) +"</td>\r\n"+ //
                              "<td class=\"subtotal\"></td>\r\n"+ //
                              "</tr>\r\n");
               }
               i++;
            }
            out.println("<tr>\r\n" + //
                        "<td colspan=\"4\">Total</td>\r\n" + //
                        "<td id=\"totalPrice"+num+"\"></td>\r\n" + //
                        "</tr>\r\n" + //
                        "</table>\r\n");
         }
         else {
            out.println("<p>You have not order anything yet</p>");
         }
         out.println("</div></div>");

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
                  "document.getElementById(\"Payment\").href = \"queryeqs?email=\"+email;\r\n" + //
                  "document.getElementById(\"Purchase\").href = \"orderquery?email=\"+email;\r\n" + //
                  "document.getElementById(\"ChangePass\").href = \"http://localhost:9999/myeshop/ChangePass.html?email=\"+email;" + //
                  "document.getElementById(\"Contact\").href = \"http://localhost:9999/myeshop/Contactus.html?email=\"+email;" + //
                  "document.getElementById(\"Updatedata\").href = \"updatedata?email=\"+email;\r\n" + //
                  "document.getElementById(\"hiddenEmail\").value = email;\r\n" + //
                  "console.log(\"After updating dropdown\");\r\n" + //
                  "});\r\n" + //
                  "$(document).ready(function() {\r\n" + //
                  "// Function to calculate total price\r\n" + //
                  "function calculateTotalPrice() {\r\n" + //
                  "var total = 0;\r\n" + //
                  "var num = 1;\r\n" + //
                  "$('table tr:not(:last-child)').each(function() {\r\n" + //
                  "var subtotal = 0;\r\n" + //
                  "if($(this).find('td:nth-child(1)').text().trim()==='Total') {\r\n" + //
                  " $('#totalPrice' + num).text(total.toFixed(2));\r\n" + //
                  "num++;\r\n" + //
                  "total = 0;\r\n" + //
                  "} else {\r\n" + //
                  "var quantity = parseInt($(this).find('td:nth-child(3)').text());\r\n" + //
                  "var price = parseFloat($(this).find('td:nth-child(4)').text()); // Adjusted to target the price column\r\n" + //
                  "if (!isNaN(quantity) && !isNaN(price)) { // Check if quantity and price are valid numbers\r\n" + //
                  "total += quantity * price;\r\n" + //
                  "subtotal = quantity * price;\r\n" + //
                  "$(this).find('.subtotal').text(subtotal.toFixed(2));\r\n" + //
                  "} else {\r\n" + //
                  "console.log('Invalid quantity or price:', quantity, price);\r\n" + //
                  "}\r\n" + //
                  "}\r\n" + //
                  "});\r\n" + //
                  "$('#totalPrice' + num).text(total.toFixed(2));\r\n" + //
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
