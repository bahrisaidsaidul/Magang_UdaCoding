<?php
require_once '../config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Admin only']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'Invoice ID required']);
    exit();
}

$stmt = $pdo->prepare("UPDATE invoices SET project_name = ?, client = ?, amount = ?, date = ?, status = ? WHERE id = ?");
$result = $stmt->execute([
    $data['project_name'],
    $data['client'],
    $data['amount'],
    $data['date'],
    $data['status'],
    $data['id']
]);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Invoice updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update invoice']);
}
?>