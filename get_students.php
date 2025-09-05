<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = ""; // default is empty in XAMPP
$db   = "studentdb";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$result = $conn->query("SELECT * FROM students");

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

echo json_encode($students);
$conn->close();
?>
