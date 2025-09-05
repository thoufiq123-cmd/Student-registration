<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: UPDATE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = "";
$db = "studentdb";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB Connection failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$name = $conn->real_escape_string($data["name"]);
$phone = $conn->real_escape_string($data["phone"]);
$email = $conn->real_escape_string($data["email"]);

$sql = "UPDATE students SET name='$name', phone='$phone', email='$email' WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Student updated"]);
} else {
    echo json_encode(["status" => "error", "message" => "Update failed: " . $conn->error]);
}

$conn->close();
?>
