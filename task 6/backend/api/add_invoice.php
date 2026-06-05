<?php
require_once '../config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Admin only']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['project_name']) || !isset($data['client']) || !isset($data['amount']) || !isset($data['date'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

// Validasi amount
$amount = str_replace(',', '', $data['amount']);
$amount = floatval($amount);

$stmt = $pdo->prepare("INSERT INTO invoices (project_name, client, amount, date, status, created_by) VALUES (?, ?, ?, ?, ?, ?)");
$result = $stmt->execute([
    $data['project_name'],
    $data['client'],
    $amount,
    $data['date'],
    $data['status'] ?? 'pending',
    $_SESSION['user_id']
]);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Invoice added successfully', 'id' => $pdo->lastInsertId()]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to add invoice']);
}
?>