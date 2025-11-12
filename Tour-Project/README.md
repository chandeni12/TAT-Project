# Tour & Travel Website

A tour and travel booking website with contact form functionality.

## Features
- Tour packages display
- Adventure activities showcase
- Contact form with email notifications
- Database storage for contact submissions

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: PHP, Node.js
- **Database**: MySQL
- **Email**: Nodemailer (Gmail SMTP)

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
- Start XAMPP/WAMP (Apache + MySQL)
- Create database named `tour`
- Create table:
```sql
CREATE TABLE contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    Subject VARCHAR(200) NOT NULL,
    Message TEXT NOT NULL
);
```

### 3. Start Email Service
```bash
npm start
```

### 4. Access Website
Open: `http://localhost/Tour-Project/`

## How It Works
1. User fills contact form
2. PHP saves data to MySQL database
3. PHP triggers Node.js email service
4. Email sent to: teamhub.query@gmail.com

---

© 2025 Travel.com
