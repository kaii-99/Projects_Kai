import java.io.*;
import java.sql.*;
import jakarta.servlet.*;           
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;


@WebServlet("/queryeqs")   // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class EshopQueryServlet extends HttpServlet {

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
      try (
         // Step 1: Allocate a database 'Connection' object
         Connection conn = DriverManager.getConnection(
               "jdbc:mysql://localhost:3306/myeshop?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
               "kwshin", "Suigaise99");   // For MySQL
               // The format is: "jdbc:mysql://hostname:port/databaseName", "username", "password"

         // Step 2: Allocate a 'Statement' object in the Connection
         Statement stmt = conn.createStatement();
         
      ) {
         String AccStr = "SELECT * FROM shopping_cart WHERE email = ?";
         PreparedStatement checkAcc = conn.prepareStatement(AccStr);
         checkAcc.setString(1, request.getParameter("email"));
         // Step 3: Execute a SQL SELECT query
         ResultSet rs = checkAcc.executeQuery();
   
         out.println("<div class=\"payment-container\">\r\n");
         out.println("<div class=\"table\"><form id=\"Updatedata\" method=\"get\" action=\"updatedata\">\r\n");
         if (rs.next()) {
            String sqlStr = "SELECT * FROM shopping_cart WHERE email = ?";
            PreparedStatement pstmt = conn.prepareStatement(sqlStr);
            pstmt.setString(1, request.getParameter("email"));
            ResultSet rset = pstmt.executeQuery();
            out.println("<table>\r\n" + //
                        "<tr>\r\n" + //
                        "<th>ID</th>\r\n" + //
                        "<th>Items</th>\r\n" + //
                        "<th>Quantity</th>\r\n" + //
                        "<th>Price</th>\r\n" + //
                        "<th>Subtotal</th>\r\n" + //
                        "</tr>\r\n");
            while(rset.next()) {
               out.println("<tr>\r\n"+ //
               "<td><input type=\"hidden\" name=\"id\" value=\""+rset.getString("id") +"\">"+ "<input type=\"hidden\" name=\"email\" value=\""+rset.getString("email") +"\">"+ 
               rset.getString("id") +"</td>\r\n"+ //
               "<td>"+ rset.getString("model") +"</td>\r\n"+ //
               "<td><input type=\"number\" name=\"qty\" value=\""+ rset.getString("qty") +"\" min=\"0\" class=\"quantity-input\"></td>\r\n"+ //
               "<td>"+ String.format("%.2f", rset.getDouble("price")) +"</td>\r\n"+ //
               "<td class=\"subtotal\"></td>\r\n"+ //
               "</tr>\r\n");
            }
            out.println("<tr>\r\n" + //
                        "<td colspan=\"4\">Total</td>\r\n" + //
                        "<td id=\"totalPrice\"></td>\r\n" + //
                        "</tr>\r\n" + //
                        "</table>\r\n");
         }
         else {
            out.println("<p>There is nothing in your shopping cart</p>");
         }
         out.println("<button type=\"submit\" class=\"save-btn\">Save</button></form></div>\r\n");  


      } catch(Exception ex) {
         out.println("<p>Error: " + ex.getMessage() + "</p>");
         out.println("<p>Check Tomcat console for details.</p>");
         ex.printStackTrace();
      }  // Step 5: Close conn and stmt - Done automatically by try-with-resources (JDK 7)
      
      out.println("<div class=\"container\">\r\n" + //
                  "<div class=\"card-container\">\r\n" + //
                  "<div class=\"front\">\r\n" + //
                  "<div class=\"image\">\r\n" + //
                  "<img src=\"image/chip.png\" alt=\"chip\">\r\n" + //
                  "<div class=\"card-images\">\r\n" + //
                  "<img class=\"visa\" src=\"image/visa.png\" alt=\"visa\">\r\n" + //
                  "<img class=\"mastercard\" src=\"image/mastercard.png\" alt=\"mastercard\">\r\n" + //
                  "</div>\r\n" + //
                  "</div>\r\n" + //
                  "<div class=\"card-number-box\">################</div>\r\n" + //
                  "<div class=\"flexbox\">\r\n" + //
                  "<div class=\"box\">\r\n" + //
                  "<span>card holder</span>\r\n" + //
                  "<div class=\"card-holder-name\">full name</div>\r\n" + //
                  "</div>\r\n" + //
                  "<div class=\"box\">\r\n" + //
                  "<span>expires</span>\r\n" + //
                  "<div class=\"expiration\">\r\n" + //
                  "<span class=\"exp-month\">mm</span>\r\n" + //
                  "<span class=\"exp-year\">yy</span>\r\n" + //
                  "</div>\r\n" + //
                  "</div>\r\n" + //
                  "</div>\r\n" + //
                  "</div>\r\n" + //
                  "<div class=\"back\">\r\n" + //
                  "<div class=\"strip\"></div>\r\n" + //
                  "<div class=\"box\">\r\n" + //
                  "<span>cvv</span>\r\n" + //
                  "<div class=\"cvv-box\"></div>\r\n" + //
                  "<img class=\"visaback\" src=\"image/visa.png\" alt=\"visa\">\r\n" + //
                  "<img class=\"mastercardback\" src=\"image/mastercard.png\" alt=\"mastercard\">\r\n" + //
                  "</div>\r\n" + //
                  "</div>\r\n" + //
                  "</div>\r\n" + //
                  "<form action=\"eshoporder\" method=\"get\">\r\n" + //
                  "<input type=\"hidden\" name=\"email\" id=\"hiddenEmail\" value=\""+request.getParameter("email")+"\">\r\n" + //
                  "<input type=\"hidden\" name=\"date\" id=\"hiddendate\" value=\"\">\r\n" + //
                  "<div class=\"inputBox\">\r\n" + //
                  "<span>card number</span>\r\n" + //
                  "<input type=\"text\" name=\"number\" inputmode=\"numeric\" minlength=\"16\"  maxlength=\"16\" class=\"card-number-input\" placeholder=\"Only Number Allowed\" required pattern=\"[0-9]{16}\">\r\n" + //
                  "</div>\r\n" + //
                  "<div class=\"inputBox\">\r\n" + //
                  "<span>card holder</span>\r\n" + //
                  "<input type=\"text\" name=\"name\" maxlength=\"21\" class=\"card-holder-input\" placeholder=\"Only Alphabets Allowed\" required pattern=\"[a-zA-Z ]+\">\r\n" + //
                  "</div>\r\n" + //
                  "<div class=\"flexbox\">\r\n" + //
                  "<div class=\"inputBox\">\r\n" + //
                  "<span>expiration mm</span>\r\n" + //
                  "<select name=\"month\" id=\"\" class=\"month-input\">\r\n" + //
                  "<option value=\"month\" selected disabled>month</option>\r\n" + //
                  "<option value=\"01\">01</option>\r\n" + //
                  "<option value=\"02\">02</option>\r\n" + //
                  "<option value=\"03\">03</option>\r\n" + //
                  "<option value=\"04\">04</option>\r\n" + //
                  "<option value=\"05\">05</option>\r\n" + //
                  "<option value=\"06\">06</option>\r\n" + //
                  "<option value=\"07\">07</option>\r\n" + //
                  "<option value=\"08\">08</option>\r\n" + //
                  "<option value=\"09\">09</option>\r\n" + //
                  "<option value=\"10\">10</option>\r\n" + //
                  "<option value=\"11\">11</option>\r\n" + //
                  "<option value=\"12\">12</option>\r\n" + //
                  "</select>\r\n" + //
                  "</div>\r\n" + //
                  "<div class=\"inputBox\">\r\n" + //
                  "<span>expiration yy</span>\r\n" + //
                  "<select name=\"year\" id=\"\" class=\"year-input\">\r\n" + //
                  "<option value=\"year\" selected disabled>year</option>\r\n" + //
                  "<option value=\"2024\">2024</option>\r\n" + //
                  "<option value=\"2025\">2025</option>\r\n" + //
                  "<option value=\"2026\">2026</option>\r\n" + //
                  "<option value=\"2027\">2027</option>\r\n" + //
                  "<option value=\"2028\">2028</option>\r\n" + //
                  "<option value=\"2029\">2029</option>\r\n" + //
                  "<option value=\"2030\">2030</option>\r\n" + //
                  "<option value=\"2031\">2031</option>\r\n" + //
                  "<option value=\"2032\">2032</option>\r\n" + //
                  "<option value=\"2033\">2033</option>\r\n" + //
                  "<option value=\"2034\">2034</option>\r\n" + //
                  "<option value=\"2035\">2035</option>\r\n" + //
                  "</select>\r\n" + //
                  "</div>\r\n" + //
                  "<div class=\"inputBox\">\r\n" + //
                  "<span>cvv</span>\r\n" + //
                  "<input type=\"text\" name=\"cvv\" minlength=\"3\" maxlength=\"3\" class=\"cvv-input\" placeholder=\"Only Number Allowed\" required>\r\n" + //
                  "</div>\r\n" + //
                  "</div>\r\n" + //
                  "<input type=\"submit\" value=\"submit\" class=\"submit-btn\">\r\n" + //
                  "<input type=\"reset\" value=\"reset\" class=\"submit-btn\">\r\n" + //
                  "</form>\r\n" + //
                  "</div>\r\n" + //
                  "</div>\r\n" + //
                  "<script src=\"https://code.jquery.com/jquery-3.6.0.min.js\"></script>\r\n" + //
                  "<script>\r\n" + //
                  " document.querySelector('.card-number-input').oninput=()=>{\r\n" + //
                  "// Remove any non-numeric characters from the input value\r\n" + //
                  "let inputValue = document.querySelector('.card-number-input').value;\r\n" + //
                  "let sanitizedValue = inputValue.replace(/\\D/g, ''); // \\D matches any non-digit character\r\n" + //
                  "let cardNumber = sanitizedValue.trim();\r\n" + //
                  "//let cardbox = sanitizedValue.trim();\r\n" + //
                  "// Extract the first digit of the card number\r\n" + //
                  "let firstDigit = parseInt(cardNumber.charAt(0));\r\n" + //
                  "// Check if it starts with a valid Visa or Mastercard prefix\r\n" + //
                  "if (firstDigit === 4) {\r\n" + //
                  "// Visa card\r\n" + //
                  "document.querySelector('.visa').style.transform='perspective(1000px) rotateY(0deg)';\r\n" + //
                  "document.querySelector('.mastercard').style.transform='perspective(1000px) rotateY(-180deg)';\r\n" + //
                  "document.querySelector('.visaback').style.transform='perspective(1000px) rotateY(0deg)';\r\n" + //
                  "document.querySelector('.mastercardback').style.transform='perspective(1000px) rotateY(-180deg)';\r\n" + //
                  "// You can update UI or perform other actions here for Visa cards\r\n" + //
                  "} else if (firstDigit === 2 || firstDigit === 5) {\r\n" + //
                  " // Mastercard\r\n" + //
                  " document.querySelector('.mastercard').style.transform='perspective(1000px) rotateY(0deg)';\r\n" + //
                  " document.querySelector('.visa').style.transform='perspective(1000px) rotateY(-180deg)';\r\n" + //
                  " document.querySelector('.mastercardback').style.transform='perspective(1000px) rotateY(0deg)';\r\n" + //
                  " document.querySelector('.visaback').style.transform='perspective(1000px) rotateY(-180deg)';\r\n" + //
                  " // You can update UI or perform other actions here for Mastercard\r\n" + //
                  "} else {\r\n" + //
                  " // Other card types or invalid input\r\n" + //
                  " cardNumber = \"################\";\r\n" + //
                  " console.log('Other Card Type or Invalid Input');\r\n" + //
                  " // You can handle other card types or invalid input here\r\n" + //
                  "}    \r\n" + //
                  "// Update the card number display\r\n" + //
                  "//document.querySelector('.card-number-input').value = cardBox;\r\n" + //
                  "document.querySelector('.card-number-box').innerText = cardNumber;\r\n" + //
                  "}\r\n" + //
                  "document.querySelector('.card-holder-input').oninput=()=>{\r\n" + //
                  "document.querySelector('.card-holder-name').innerText = document.querySelector('.card-holder-input').value;\r\n" + //
                  "}\r\n" + //
                  "document.querySelector('.month-input').oninput=()=>{\r\n" + //
                  "document.querySelector('.exp-month').innerText = document.querySelector('.month-input').value;\r\n" + //
                  "}\r\n" + //
                  "document.querySelector('.year-input').oninput=()=>{\r\n" + //
                  "document.querySelector('.exp-year').innerText = document.querySelector('.year-input').value;\r\n" + //
                  "}\r\n" + //
                  "document.querySelector('.cvv-input').onmouseenter =() =>{\r\n" + //
                  "document.querySelector('.front').style.transform='perspective(1000px) rotateY(-180deg)';\r\n" + //
                  "document.querySelector('.back').style.transform='perspective(1000px) rotateY(0deg)';\r\n" + //
                  "document.querySelector('.visaback').style.opacity='1';\r\n" + //
                  "document.querySelector('.mastercardback').style.opacity='1';\r\n" + //
                  "}\r\n" + //
                  "document.querySelector('.cvv-input').onmouseleave =() =>{\r\n" + //
                  "document.querySelector('.front').style.transform='perspective(1000px) rotateY(0deg)';\r\n" + //
                  "document.querySelector('.back').style.transform='perspective(1000px) rotateY(180deg)';\r\n" + //
                  "document.querySelector('.visaback').style.opacity='0';\r\n" + //
                  "document.querySelector('.mastercardback').style.opacity='0';\r\n" + //
                  "}\r\n" + //
                  "document.querySelector('.cvv-input').oninput =() =>{\r\n" + //
                  "document.querySelector('.cvv-box').innerText = document.querySelector('.cvv-input').value;\r\n" + //
                  "}\r\n" + //
                  "const submitBtn = document.querySelector('.submit-btn[value=\"submit\"]');\r\n" + //
                  "const resetBtn = document.querySelector('.submit-btn[value=\"reset\"]');\r\n" + //
                  "submitBtn.addEventListener('click', function(event) {\r\n" + //
                  "console.log('Submit button clicked');\r\n" + //
                  "});\r\n" + //
                  "resetBtn.addEventListener('click', function(event) {\r\n" + //
                  "console.log('Reset button clicked');\r\n" + //
                  "});\r\n" + //
                  "var currentDate = new Date();\r\n" + //
                  "var formattedDate = currentDate.toISOString().slice(0, 10);\r\n" + //
                  "document.getElementById(\"hiddendate\").value = formattedDate;\r\n" + //
                  "document.addEventListener(\"DOMContentLoaded\", function() {\r\n" + //
                  "console.log(\"Before updating dropdown\");\r\n" + //
                  "const urlParams = new URLSearchParams(window.location.search);\r\n" + //
                  "const email = urlParams.get('email');\r\n" + //
                  "document.getElementById(\"accountDropdown\").textContent = email;\r\n" + //
                  "document.getElementById(\"home\").href = \"home?email=\"+email;\r\n" + //
                  "document.getElementById(\"Payment\").href = \"queryeqs?email=\"+email;\r\n" + //
                  "document.getElementById(\"Purchase\").href = \"orderquery?email=\"+email;\r\n" + //
                  "document.getElementById(\"ChangePass\").href = \"http://localhost:9999/myeshop/ChangePass.html?email=\"+email;\r\n" + //
                  "document.getElementById(\"Contact\").href = \"http://localhost:9999/myeshop/Contactus.html?email=\"+email;\r\n" + //
                  "document.getElementById(\"Updatedata\").href = \"updatedata?email=\"+email;\r\n" + //
                  "document.getElementById(\"hiddenEmail\").value = email;\r\n" + //
                  "document.getElementById(\"hiddenEmail1\").value = email;\r\n" + //
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

