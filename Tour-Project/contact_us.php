<?php
if (isset($_GET['status'])) {
    if ($_GET['status'] == 'success') {
        echo "<script>alert('We will contact you soon!');</script>";
    } elseif ($_GET['status'] == 'duplicate') {
        echo "<script>alert('You have already submitted this message!');</script>";
    } elseif ($_GET['status'] == 'error') {
        echo "<script>alert('Something went wrong. Please try again later.');</script>";
    }
}
?>

<?php
// ✅ Enable MySQLi exceptions
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Database connection
$db_hostname = "127.0.0.1";
$db_username = "root";
$db_password = "";
$db_name     = "tour";

try {
    $conn = mysqli_connect($db_hostname, $db_username, $db_password, $db_name);
    if (!$conn) {
        throw new Exception("Database connection failed!");
    }

    // Collect form data
    $name    = $_POST['name'] ?? '';
    $email   = $_POST['email'] ?? '';
    $phone   = $_POST['phone'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';

    // ✅ Insert query
    $sql = "INSERT INTO contact (Name, Email, Phone, Subject, Message) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $name, $email, $phone, $subject, $message);
    $stmt->execute();

    // ✅ Redirect to contact.php with success flag
    header("Location: contact_us.php?status=success");
    exit;

} catch (mysqli_sql_exception $e) {
    // ✅ Catch duplicate error (error code 1062)
    if ($e->getCode() == 1062) {
        header("Location: contact_us.php?status=duplicate");
        exit;
    } else {
        // Other SQL errors
        header("Location: contact_us.php?status=error");
        exit;
    }
} catch (Exception $e) {
    header("Location: contact_us.php?status=error");
    exit;
}

// ✅ Close connection
if (isset($conn)) {
    $conn->close();
}
?>
