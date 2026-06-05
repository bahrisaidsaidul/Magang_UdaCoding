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

$stmt = $pdo->prepare("DELETE FROM invoices WHERE id = ?");
$result = $stmt->execute([$data['id']]);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Invoice deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete invoice']);
}
?>