<?php
/**
 * Tour & Travel Contact Form Handler
 * Stores data in database AND sends email via Node.js service
 */

// ✅ Enable MySQLi exceptions
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Database connection
$db_hostname = "127.0.0.1";
$db_username = "root";
$db_password = "";
$db_name     = "tour";

// Node.js email service URL
$email_service_url = "http://localhost:3000/send-email";

try {
    // Validate form submission
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Invalid request method");
    }

    // Collect and sanitize form data
    $name    = trim($_POST['name'] ?? '');
    $email   = trim($_POST['email'] ?? '');
    $phone   = trim($_POST['phone'] ?? '');
    $subject = trim($_POST['subject'] ?? '');
    $message = trim($_POST['message'] ?? '');

    // Validation
    if (empty($name) || empty($email) || empty($phone) || empty($subject) || empty($message)) {
        throw new Exception("All fields are required");
    }

    // Email validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "<script>alert('Invalid email format!'); window.location.href='index.html#contact';</script>";
        exit;
    }

    // Connect to database
    $conn = mysqli_connect($db_hostname, $db_username, $db_password, $db_name);
    if (!$conn) {
        throw new Exception("Database connection failed!");
    }

    // ✅ Insert into database
    $sql = "INSERT INTO contact (Name, Email, Phone, Subject, Message) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $name, $email, $phone, $subject, $message);
    $stmt->execute();
    
    echo "<!-- Database insert successful -->\n";

    // ✅ Send email via Node.js service
    $postData = array(
        'name'    => $name,
        'email'   => $email,
        'phone'   => $phone,
        'subject' => $subject,
        'message' => $message
    );

    $ch = curl_init($email_service_url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen(json_encode($postData))
    ));
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode == 200) {
        echo "<!-- Email sent successfully -->\n";
        echo "<script>
            alert('Thank you! Your message has been saved and sent to our team. We will contact you soon!');
            window.location.href='index.html#contact';
        </script>";
    } else {
        echo "<!-- Email service error: HTTP $httpCode -->\n";
        echo "<script>
            alert('Your message has been saved, but email notification failed. We will still contact you soon!');
            window.location.href='index.html#contact';
        </script>";
    }
    exit;

} catch (mysqli_sql_exception $e) {
    // ✅ Catch duplicate error (error code 1062)
    if ($e->getCode() == 1062) {
        echo "<script>
            alert('You have already submitted this message!');
            window.location.href='index.html#contact';
        </script>";
        exit;
    } else {
        echo "<script>
            alert('Database error: " . addslashes($e->getMessage()) . "');
            window.location.href='index.html#contact';
        </script>";
        exit;
    }
} catch (Exception $e) {
    echo "<script>
        alert('Error: " . addslashes($e->getMessage()) . "');
        window.location.href='index.html#contact';
    </script>";
    exit;
} finally {
    // ✅ Close connection
    if (isset($conn)) {
        $conn->close();
    }
}
?>
