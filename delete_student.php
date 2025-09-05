<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // CORS preflight response
    exit(0);
}

$host = "localhost";
$user = "root";
$pass = "";
$db = "studentdb";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"])) {
    echo json_encode(["status" => "error", "message" => "No ID provided"]);
    exit();
}

$id = intval($data["id"]);

$stmt = $conn->prepare("DELETE FROM students WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Student deleted"]);
} else {
    echo json_encode(["status" => "error", "message" => "Delete failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
