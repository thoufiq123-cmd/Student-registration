<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = ""; // default is empty for XAMPP
$db   = "studentdb";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed."]));
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data["name"]) && !empty($data["email"]) && !empty($data["phone"])) {
    $name = $conn->real_escape_string($data["name"]);
    $phone = $conn->real_escape_string($data["phone"]);
    $email = $conn->real_escape_string($data["email"]); 

    $sql = "INSERT INTO students (name, phone, email) VALUES ('$name', $phone, '$email')";

    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "message" => "Student added successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
}

$conn->close();
?>

