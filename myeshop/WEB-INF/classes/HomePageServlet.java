import java.io.*;
import java.sql.*;
import jakarta.servlet.*;           
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;


@WebServlet("/home")   // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class HomePageServlet extends HttpServlet {

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
      out.println("<head><title>Home</title>");
      out.println("<meta charset=\"UTF-8\">\r\n" + //
                  "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n" + //
                  "<title>KW </title>\r\n" + //
                  "<link rel=\"stylesheet\" href=\"css/index_actual.css\">\r\n" + //
                  "<link rel=\"stylesheet\" href=\"./bootstrap/css/bootstrap.min.css\">\r\n" + //
                  "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css\" integrity=\"sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N\" crossorigin=\"anonymous\">\r\n" + //
                  "<script src=\"https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js\" integrity=\"sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj\" crossorigin=\"anonymous\"></script>\r\n" + //
                  "<script src=\"https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js\" integrity=\"sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN\" crossorigin=\"anonymous\"></script>\r\n" + //
                  "<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js\" integrity=\"sha384-+sLIOodYLS7CIrQpBjl+C7nPvqq+FbNUBDunl/OZv93DB7Ln/533i8e/mZXLi/P+\" crossorigin=\"anonymous\"></script>\r\n" + //
                  "</head>");
      out.println("<body style=\"background-image: url(image/neon.png);\" >\r\n" + //
                  "<nav class=\"navbar bg-dark navbar-dark navbar-expand-sm sticky-top\">\r\n" + //
                  "<div class=\"dropdown\">\r\n" + //
                  "<a class=\"nav-item nav-link dropdown-toggle\" \r\n" + //
                  "data-toggle = \"dropdown\" id=\"accountDropdown\"\r\n" + //
                  "aria-haspopup=\"true\" aria-expanded=\"false\" \r\n" + //
                  "href=\"#\">Account</a>\r\n" + //
                  "<div class=\"dropdown-menu\" aria-labelledby=\"serviceDropDown\">\r\n" + //
                  "<a class=\"dropdown-item\" id=\"ChangePass\" href=\"http://localhost:9999/myeshop/ChangePass.html\">Change Password</a>");

      try (
         // Step 1: Allocate a database 'Connection' object
         Connection conn = DriverManager.getConnection(
               "jdbc:mysql://localhost:3306/myeshop?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
               "kwshin", "Suigaise99");   // For MySQL
               // The format is: "jdbc:mysql://hostname:port/databaseName", "username", "password"

         // Step 2: Allocate a 'Statement' object in the Connection
         PreparedStatement checkstmt = conn.prepareStatement(
            "SELECT * FROM admin_accounts WHERE email = ?");
      ) {
         // Step 3: Execute a SQL SELECT query
         checkstmt.setString(1, request.getParameter("email"));
         ResultSet rset = checkstmt.executeQuery();

         if (rset.next()) {
            out.println("<a class=\"dropdown-item\" id=\"CheckEnquiry\" href=\"checkenquiry\">Check Enquiry</a>\r\n" + //
                        "<a class=\"dropdown-item\" id=\"CheckStock\" href=\"checkstock\">Check Stock</a>");
         } 

      } catch(Exception ex) {
         out.println("<p>Error: " + ex.getMessage() + "</p>");
         out.println("<p>Check Tomcat console for details.</p>");
         ex.printStackTrace();
      }  // Step 5: Close conn and stmt - Done automatically by try-with-resources (JDK 7)
      out.println("<a class=\"dropdown-item\" href=\"http://localhost:9999/myeshop/login.html\">Log Out</a>\r\n" + //
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
                  "                                <input type=\"checkbox\" name=\"brand\" value=\"Acer\"> ACER    \r\n" + //
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
                  "    </nav>\r\n" + //
                  "    <header id=\"top_header\" class=\"container-fluid p-0\">\r\n" + //
                  "\r\n" + //
                  "        <div class=\"row h-100  d-flex align-items-center\">\r\n" + //
                  "            <h1 id=\"header_title\" class=\"col text-center text-white font-weight-light\" style=\"background-color: #FF6EC7;\">\r\n" + //
                  "                <div class=\"d-md-none display-3\">\r\n" + //
                  "                    Welcome to KW TECH PTE.LTD \r\n" + //
                  "                </div>\r\n" + //
                  "                <div class=\"d-none d-md-inline display-1\">\r\n" + //
                  "                    Welcome to KW TECH PTE.LTD \r\n" + //
                  "                </div>\r\n" + //
                  "            </h1>\r\n" + //
                  "        </div>\r\n" + //
                  "    </header>\r\n" + //
                  "    <div class=\"container\">\r\n" + //
                  "        <section class=\"content\" id=\"mission\">\r\n" + //
                  "            <p><h1 class=\"text-sm-left text-md-center text-white \">Popular Product</h1></p>\r\n" + //
                  "            <div class=\"carousel slide\" id=\"featured\" data-ride=\"carousel\" >\r\n" + //
                  "                <ul class=\"carousel-indicators\">\r\n" + //
                  "                    <li data-target=\"#featured\" data-slide-to=\"0\" class=\"active\"></li>\r\n" + //
                  "                    <li data-target=\"#featured\" data-slide-to=\"1\"></li>\r\n" + //
                  "                 \r\n" + //
                  "                </ul>\r\n" + //
                  "                <div class=\"carousel-inner\">\r\n" + //
                  "                    <div class=\"carousel-item active\"><img class=\"carouselimg img-fluid\" src=\"image/cybrog.png\" >\r\n" + //
                  "                        <div class=\"carousel-caption bg-dark\">\r\n" + //
                  "                            <p>\r\n" + //
                  "                                NVIDIA® GeForce RTX™ 4060 Laptop GPU 8GB GDDR6\r\n" + //
                  "                                15.6\" FHD (1920*1080), 144Hz 45%NTSC IPS-Level\r\n" + //
                  "                                Intel® Core™ i5-12450H\r\n" + //
                  "                                512GB NVMe PCIe SSD Gen4x4\r\n" + //
                  "                                2 Years Warranty</p>\r\n" + //
                  "                        </div>                    \r\n" + //
                  "                </div>\r\n" + //
                  "                <div class=\"carousel-item\"><img class=\"carouselimg2 img-fluid\" src=\"image/predator.png\">\r\n" + //
                  "                    <div class=\"carousel-caption bg-dark\">\r\n" + //
                  "                        <p> NVIDIA GeForce RTX 4050 with 6GB of dedicated GDDR6 VRAM\r\n" + //
                  "                            16\" 16:10 WUXGA (1920 x 1200) IPS, supporting 165Hz, G-Sync\r\n" + //
                  "                            Intel Core i7-13700HX processor \r\n" + //
                  "                            2 Years Acer Local Onsite Warranty\r\n" + //
                  "\r\n" + //
                  "                        </p>\r\n" + //
                  "                    </div>\r\n" + //
                  "                </div>\r\n" + //
                  "               \r\n" + //
                  "                \r\n" + //
                  "                <a href=\"\" class=\"carousel-control-prev\" href=\"#featured\"\r\n" + //
                  "                    role=\"button\" data-slide=\"prev\">\r\n" + //
                  "                    <span class=\"carousel-control-prev-icon\"></span>\r\n" + //
                  "                </a>\r\n" + //
                  "                <a class=\"carousel-control-next\" href=\"#featured\" data-slide=\"next\">\r\n" + //
                  "                    <span class=\"carousel-control-next-icon\"></span>\r\n" + //
                  "                </a>\r\n" + //
                  "            </div>\r\n" + //
                  "        </div>\r\n" + //
                  "    </section>\r\n" + //
                  "\r\n" + //
                  "    <section class=\"content\" id=\"services\">\r\n" + //
                  "     <h2 class=\"text-sm-left text-md-center border text-white\">Brands</h2>\r\n" + //
                  "        <div class=\"container\">\r\n" + //
                  "            <div class=\"row\">\r\n" + //
                  "               \r\n" + //
                  "                <ul class=\"col-12 justify-content-between nav nav-pills flex-column flex-md-row\">\r\n" + //
                  "                    <li class=\"nav-item\"><a class=\"nav-link text-white\" id=\"apple\" href=\"brandquery\"style=\"background-color:#FF6EC7\">APPLE</a></li>\r\n" + //
                  "                    <li class=\"nav-item\"><a class=\"nav-link text-white\" id=\"msi\" href=\"brandquery\" style=\"background-color:#FF6EC7\">MSI</a></li>\r\n" + //
                  "                    <li class=\"nav-item\"><a class=\"nav-link text-white\" id=\"acer\" href=\"brandquery\"style=\"background-color:#FF6EC7\"> ACER</a></li>\r\n" + //
                  "                </ul>\r\n" + //
                  "            \r\n" + //
                  "                <article class=\"card col-sm-4 border-0 mt-3\">\r\n" + //
                  "                    <img class=\"card-img-top img-fluid\" src=\"image/macbook-air.png\" alt=\"\" style=\"margin-top: 33px;\">\r\n" + //
                  "                    <h6 class=\"card-header text-center\">MACBOOKAIR</h6>\r\n" + //
                  "                    <p class=\"card-body\">\r\n" + //
                  "                        The MacBook Air, crafted by Apple Inc., is a sleek and lightweight laptop renowned for its portability and stylish design. With a high-resolution Retina display, powerful performance, and macOS operating system, it offers users a seamless and efficient computing experience for both work and entertainment.<br>\r\n" + //
                  "                    </p>\r\n" + //
                  "                </article>\r\n" + //
                  "                <article class=\"card col-sm-4 border-0 mt-3 justify-content-between \">\r\n" + //
                  "                    <img class=\"card-img-top img-fluid\" src=\"image/KATANA.png\" alt=\"\" >\r\n" + //
                  "                    <h6 class=\"card-header text-center\">MSI KATANA</h6>\r\n" + //
                  "                    <p class=\"card-body\"> \r\n" + //
                  "                          \r\n" + //
                  "MSI Katana is a powerful gaming laptop renowned for its sleek design and high performance. Equipped with cutting-edge components, vibrant displays, and advanced cooling systems, it offers gamers a premium experience for immersive gameplay.\r\n" + //
                  "                     </p>\r\n" + //
                  "                </article>\r\n" + //
                  "                <article class=\"card col-sm-4 border-0 mt-3 justify-content-between \">\r\n" + //
                  "                    <img class=\"card-img-top img-fluid\" src=\"image/ROG_STRIX.png\" alt=\"\" style=\"margin-top:45px;\">\r\n" + //
                  "                   <h6 class=\"card-header text-center \">ROG STRIX</h6>\r\n" + //
                  "                    <p class=\"card-body\"> \r\n" + //
                  "                        \r\n" + //
                  "The ROG Strix is a premium gaming laptop series by ASUS, renowned for its powerful performance, immersive gaming experience, and sleek design. Featuring cutting-edge components, high refresh rate displays, and advanced cooling systems, it offers gamers a top-tier platform for competitive gaming.\r\n" + //
                  "                     </p>\r\n" + //
                  "                </article>\r\n" + //
                  "            </div>\r\n" + //
                  "        </div>\r\n" + //
                  "    </section>\r\n" + //
                  "    <script>\r\n" + //
                  "        document.addEventListener(\"DOMContentLoaded\", function() {\r\n" + //
                  "            console.log(\"Before updating dropdown\");\r\n" + //
                  "            const urlParams = new URLSearchParams(window.location.search);\r\n" + //
                  "            const email = urlParams.get('email');\r\n" + //
                  "            document.getElementById(\"accountDropdown\").textContent = email;\r\n" + //
                  "            document.getElementById(\"home\").href = \"home?email=\"+email;\r\n" + //
                  "            document.getElementById(\"Payment\").href = \"queryeqs?email=\"+email;\r\n" + //
                  "            document.getElementById(\"Purchase\").href = \"orderquery?email=\"+email;\r\n" + //
                  "            document.getElementById(\"hiddenEmail\").value = email;\r\n" + //
                  "            document.getElementById(\"hiddenEmail1\").value = email;\r\n" + //
                  "            document.getElementById(\"apple\").href = \"brandquery?email=\"+email+\"&brand=Apple\"\r\n" + //
                  "            document.getElementById(\"msi\").href = \"brandquery?email=\"+email+\"&brand=MSI\"\r\n" + //
                  "            document.getElementById(\"acer\").href = \"brandquery?email=\"+email+\"&brand=Acer\"\r\n" + //
                  "            document.getElementById(\"ChangePass\").href = \"http://localhost:9999/myeshop/ChangePass.html?email=\"+email;\r\n" + //
                  "            document.getElementById(\"Contact\").href = \"http://localhost:9999/myeshop/Contactus.html?email=\"+email;\r\n" + //"
                  "            document.getElementById(\"CheckEnquiry\").href = \"checkenquiry?email=\"+email;\r\n" + //
                  "            document.getElementById(\"CheckStock\").href = \"checkstock?email=\"+email;\r\n" + //
                  "            console.log(\"After updating dropdown\");\r\n" + //
                  "        });\r\n" + //
                  "    </script>\r\n" + //
                  "</body>  \r\n" + //
                  "</html>");
      out.close();
   }
}
