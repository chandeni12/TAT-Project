# Tour-Project
<b>Calling All Open Source Contributors: Join Us in Shaping the Future of this Repository! Try Making Some Changes!</b> <br>
[Enhancement: Add A Section For Contributors on The Home Page ](https://github.com/Yash-srivastav16/Tour-Project/issues/10) <br>
[Enhancement: Separate Pages For Popular Packages ](https://github.com/Yash-srivastav16/Tour-Project/issues/9) <br><br>
DEMO-> https://yash-srivastav16.github.io/Tour-Project/
Tour &amp; Travel Project (Using Html, Css, Php, Javascript).

Here I used <b>Html, Css & javascript</b> To create the front end part of the website and for storing the Contact Information in the Database we used <b>php</b> as a backend language.

The HomePage of the Website is with<b> index.html</b> file.

## 🔧 Setup Instructions

### Prerequisites
- XAMPP, WAMP, or any PHP server
- MySQL database
- phpMyAdmin (included with XAMPP/WAMP)

### Installation Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/Yash-srivastav16/Tour-Project.git
   ```

2. **Move the project to your server directory**
   - For XAMPP: Move to `C:\xampp\htdocs\Tour-Project`
   - For WAMP: Move to `C:\wamp64\www\Tour-Project`

3. **Set up the database**
   - Start Apache and MySQL in XAMPP/WAMP
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a database named `tourandtravel`
   - Create a table named `contact` with the following structure:
     ```sql
     CREATE TABLE contact (
         id INT AUTO_INCREMENT PRIMARY KEY,
         name VARCHAR(100) NOT NULL,
         email VARCHAR(100) NOT NULL,
         phone VARCHAR(20) NOT NULL,
         subject VARCHAR(200) NOT NULL,
         message TEXT NOT NULL
     );
     ```

4. **Access the website**
   - Open your browser and go to: `http://localhost/Tour-Project/`
   - The contact form should now work properly!

### ⚠️ Important Notes
- **Do NOT use Live Server (VS Code)** for this project as it doesn't support PHP
- You must use a PHP server like XAMPP or WAMP
- Make sure MySQL is running when testing the contact form

![alt text](https://github.com/Yash-srivastav16/Tour-Project/blob/main/screenshot/home.PNG?raw=true)

<h1><b>Other Screenshots of the Pages are.</b></h1>

![alt text](https://github.com/Yash-srivastav16/Tour-Project/blob/main/screenshot/adventure.PNG?raw=true)
![alt text](https://github.com/Yash-srivastav16/Tour-Project/blob/main/screenshot/package1.PNG?raw=true)
![alt text](https://github.com/Yash-srivastav16/Tour-Project/blob/main/screenshot/contact.PNG?raw=true)
![alt text](https://github.com/Yash-srivastav16/Tour-Project/blob/main/screenshot/database_contact.PNG?raw=true)
