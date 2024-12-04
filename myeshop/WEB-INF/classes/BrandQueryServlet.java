import java.io.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.*;           
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;


@WebServlet("/brandquery")   // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class BrandQueryServlet extends HttpServlet {

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
                  "    </nav>" + //
                  "<div class=\"payment-container\">\r\n" + //
                  "    <div class=\"table\">\r\n" + //
                  "        <form action=\"updatesc\">\r\n" + //
                  "            <table class=\"product-table\">\r\n");
      try (
         // Step 1: Allocate a database 'Connection' object
         Connection conn = DriverManager.getConnection(
               "jdbc:mysql://localhost:3306/myeshop?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
               "kwshin", "Suigaise99");   // For MySQL
               // The format is: "jdbc:mysql://hostname:port/databaseName", "username", "password"

         // Step 2: Allocate a 'Statement' object in the Connection
         Statement stmt = conn.createStatement();
         Statement rtmt = conn.createStatement();
         
      ) {
         String[] brands = request.getParameterValues("brand");
         if (brands != null && brands.length > 0) {
             StringBuilder brandList = new StringBuilder();
             brandList.append("(");
             for (int i = 0; i < brands.length; i++) {
                 if (i > 0) {
                     brandList.append(", ");
                 }
                 brandList.append("'" + brands[i] + "'");
             }
             brandList.append(")");
          
             String sqlStr = "SELECT * FROM laptops WHERE brand IN " + brandList.toString();
          
             //out.println("<h3>Thank you for your query.</h3>");
             //out.println("<p>Your SQL statement is: " + sqlStr + "</p>"); // Echo for debugging
             ResultSet rset = stmt.executeQuery(sqlStr);  // Send the query to the server
             ResultSet rrset = rtmt.executeQuery(sqlStr);
             String email = request.getParameter("email");
             
             //String[] printbrand = request.getParameterValues("brand");
             if (rset.next()) {
               List<String> Brand_List = new ArrayList<>();
               List<String> ID = new ArrayList<>();
               List<String> MODEL = new ArrayList<>();
               List<String> PRICE = new ArrayList<>();
               List<String> STOCK = new ArrayList<>();
                do {
                  Brand_List.add(rset.getString("brand"));
                  ID.add(rset.getString("id"));
                  MODEL.add(rset.getString("model"));
                  PRICE.add(String.format("%.2f",rset.getDouble("price")));
                  STOCK.add(rset.getString("qty"));
                } while (rset.next());

                String CheckBrand = null;
                for(int checkbrand=0;checkbrand<Brand_List.size();checkbrand+=3) {
                   if (Brand_List.get(checkbrand).equals(CheckBrand)) {
                      out.println("<tr>\r\n" + //
                                  "<td colspan=\"2\"><img src=\"image/"+ID.get(checkbrand)  +".png\" class=\"product-image\"></td>\r\n" + //
                                  "<td colspan=\"2\"><img src=\"image/"+ID.get(checkbrand+1)+".png\" class=\"product-image\"></td>\r\n" + //
                                  "<td colspan=\"2\"><img src=\"image/"+ID.get(checkbrand+2)+".png\" class=\"product-image\"></td>\r\n" + //
                                  "</tr>\r\n" + //
                                  "<tr>\r\n" + //
                                  "<td colspan=\"2\">"+MODEL.get(checkbrand)  +"</td>\r\n" + //
                                  "<td colspan=\"2\">"+MODEL.get(checkbrand+1)+"</td>\r\n" + //
                                  "<td colspan=\"2\">"+MODEL.get(checkbrand+2)+"</td>\r\n" + //
                                  "</tr>\r\n" + //
                                  "<tr>\r\n" + //
                                  "<td>$"+PRICE.get(checkbrand)  +"</td>\r\n" + //
                                  "<td>Stock: "+STOCK.get(checkbrand)  +"</td>\r\n" + //
                                  "<td>$"+PRICE.get(checkbrand+1)+"</td>\r\n" + //
                                  "<td>Stock: "+STOCK.get(checkbrand+1)+"</td>\r\n" + //
                                  "<td>$"+PRICE.get(checkbrand+2)+"</td>\r\n" + //
                                  "<td>Stock: "+STOCK.get(checkbrand+2)+"</td>\r\n" + //
                                  "</tr>\r\n" + //
                                  "<tr>\r\n" + //
                                  "<td><input type=\"hidden\" name=\"email\" id=\"hiddenEmail\" value=\""+email+"\">"+ //
                                  "<input type=\"hidden\" name=\"ID\" id=\"id\" value=\""+ID.get(checkbrand)+"\">"+ //
                                  "<input type=\"hidden\" name=\"price\" id=\"price\" value=\""+PRICE.get(checkbrand)+"\">"+ //
                                  "<input type=\"hidden\" name=\"model\" id=\"model\" value=\""+MODEL.get(checkbrand)+"\">Qty:</td>\r\n" + //
                                  "<td><input type=\"number\" min=\"0\" max=\""+STOCK.get(checkbrand)+"\" name=\"qty\" value=\"0\" class=\"quantity-input\"></td>\r\n" + //
                                  "<td><input type=\"hidden\" name=\"email\" id=\"hiddenEmail\" value=\""+email+"\">"+ //
                                  "<input type=\"hidden\" name=\"ID\" id=\"id\" value=\""+ID.get(checkbrand+1)+"\">"+ //
                                  "<input type=\"hidden\" name=\"price\" id=\"price\" value=\""+PRICE.get(checkbrand+1)+"\">"+ //
                                  "<input type=\"hidden\" name=\"model\" id=\"model\" value=\""+MODEL.get(checkbrand+1)+"\">Qty:</td>\r\n" + //
                                  "<td><input type=\"number\" min=\"0\" max=\""+STOCK.get(checkbrand+1)+"\" name=\"qty\" value=\"0\" class=\"quantity-input\"></td>\r\n" + //
                                  "<td><input type=\"hidden\" name=\"email\" id=\"hiddenEmail\" value=\""+email+"\">"+ //
                                  "<input type=\"hidden\" name=\"ID\" id=\"id\" value=\""+ID.get(checkbrand+2)+"\">"+ //
                                  "<input type=\"hidden\" name=\"price\" id=\"price\" value=\""+PRICE.get(checkbrand+2)+"\">"+ //
                                  "<input type=\"hidden\" name=\"model\" id=\"model\" value=\""+MODEL.get(checkbrand+2)+"\">Qty:</td>\r\n" + //
                                  "<td><input type=\"number\" min=\"0\" max=\""+STOCK.get(checkbrand)+2+"\" name=\"qty\" value=\"0\" class=\"quantity-input\"></td>\r\n" + //
                                  "</tr>");
                   }
                   else {
                      CheckBrand = Brand_List.get(checkbrand);
                      out.println("<tr>\r\n" + //
                                  "<th colspan=\"6\">"+Brand_List.get(checkbrand)+"</th>\r\n" + //
                                  "</tr>\r\n" + //
                                  "<tr>\r\n" + //
                                  "<td colspan=\"2\"><img src=\"image/"+ID.get(checkbrand)  +".png\" class=\"product-image\"></td>\r\n" + //
                                  "<td colspan=\"2\"><img src=\"image/"+ID.get(checkbrand+1)+".png\" class=\"product-image\"></td>\r\n" + //
                                  "<td colspan=\"2\"><img src=\"image/"+ID.get(checkbrand+2)+".png\" class=\"product-image\"></td>\r\n" + //
                                  "</tr>\r\n" + //
                                  "<tr>\r\n" + //
                                  "<td colspan=\"2\">"+MODEL.get(checkbrand)  +"</td>\r\n" + //
                                  "<td colspan=\"2\">"+MODEL.get(checkbrand+1)+"</td>\r\n" + //
                                  "<td colspan=\"2\">"+MODEL.get(checkbrand+2)+"</td>\r\n" + //
                                  "</tr>\r\n" + //
                                  "<tr>\r\n" + //
                                  "<td>$"+PRICE.get(checkbrand)  +"</td>\r\n" + //
                                  "<td>Stock: "+STOCK.get(checkbrand)  +"</td>\r\n" + //
                                  "<td>$"+PRICE.get(checkbrand+1)+"</td>\r\n" + //
                                  "<td>Stock: "+STOCK.get(checkbrand+1)+"</td>\r\n" + //
                                  "<td>$"+ PRICE.get(checkbrand+2)+"</td>\r\n" + //
                                  "<td>Stock: "+STOCK.get(checkbrand+2)+"</td>\r\n" + //
                                  "</tr>\r\n" + //
                                  "<tr>\r\n" + //
                                  "<td><input type=\"hidden\" name=\"email\" id=\"hiddenEmail\" value=\""+email+"\">"+ //
                                  "<input type=\"hidden\" name=\"ID\" id=\"id\" value=\""+ID.get(checkbrand)+"\">"+ //
                                  "<input type=\"hidden\" name=\"price\" id=\"price\" value=\""+PRICE.get(checkbrand)+"\">"+ //
                                  "<input type=\"hidden\" name=\"model\" id=\"model\" value=\""+MODEL.get(checkbrand)+"\">Qty:</td>\r\n" + //
                                  "<td><input type=\"number\" min=\"0\" max=\""+STOCK.get(checkbrand)+"\" name=\"qty\" value=\"0\" class=\"quantity-input\"></td>\r\n" + //
                                  "<td><input type=\"hidden\" name=\"email\" id=\"hiddenEmail\" value=\""+email+"\">"+ //
                                  "<input type=\"hidden\" name=\"ID\" id=\"id\" value=\""+ID.get(checkbrand+1)+"\">"+ //
                                  "<input type=\"hidden\" name=\"price\" id=\"price\" value=\""+PRICE.get(checkbrand+1)+"\">"+ //
                                  "<input type=\"hidden\" name=\"model\" id=\"model\" value=\""+MODEL.get(checkbrand+1)+"\">Qty:</td>\r\n" + //
                                  "<td><input type=\"number\" min=\"0\" max=\""+STOCK.get(checkbrand+1)+"\" name=\"qty\" value=\"0\" class=\"quantity-input\"></td>\r\n" + //
                                  "<td><input type=\"hidden\" name=\"email\" id=\"hiddenEmail\" value=\""+email+"\">"+ //
                                  "<input type=\"hidden\" name=\"ID\" id=\"id\" value=\""+ID.get(checkbrand+2)+"\">"+ //
                                  "<input type=\"hidden\" name=\"price\" id=\"price\" value=\""+PRICE.get(checkbrand+2)+"\">"+ //
                                  "<input type=\"hidden\" name=\"model\" id=\"model\" value=\""+MODEL.get(checkbrand+2)+"\">Qty:</td>\r\n" + //
                                  "<td><input type=\"number\" min=\"0\" max=\""+STOCK.get(checkbrand+2)+"\" name=\"qty\" value=\"0\" class=\"quantity-input\"></td>\r\n" + //
                                  "</tr>");
                   }
                }
                out.println("</table>\r\n" + //
                            "<button type=\"submit\" class=\"save-btn\">Add to Payment</button>\r\n" + //
                            "</form>\r\n" + //
                            "</div>\r\n" + //
                            "</div>\r\n");
             }

         } else {
             out.println("<p>No brands selected.</p>");
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
                  "document.getElementById(\"Payment\").href = \"queryeqs?email=\"+email;\r\n" + //
                  "document.getElementById(\"Purchase\").href = \"orderquery?email=\"+email;\r\n" + //
                  "document.getElementById(\"hiddenEmail\").value = email;\r\n" + //
                  "document.getElementById(\"hiddenEmail1\").value = email;\r\n" + //
                  "document.getElementById(\"ChangePass\").href = \"http://localhost:9999/myeshop/ChangePass.html?email=\"+email;\r\n" + //
                  "document.getElementById(\"Contact\").href = \"http://localhost:9999/myeshop/Contactus.html?email=\"+email;\r\n" + //
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


