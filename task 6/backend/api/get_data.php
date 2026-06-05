<?php
require_once '../config/database.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

// Get current month's data
$currentYear = date('Y');
$currentMonth = date('m');

// Total monthly omset (semua invoice, tidak hanya paid)
$stmt = $pdo->prepare("SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE MONTH(date) = ? AND YEAR(date) = ?");
$stmt->execute([$currentMonth, $currentYear]);
$totalOmset = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Total invoices count
$stmt = $pdo->prepare("SELECT COUNT(*) as total FROM invoices WHERE MONTH(date) = ? AND YEAR(date) = ?");
$stmt->execute([$currentMonth, $currentYear]);
$totalInvoices = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Average daily
$daysInMonth = date('t');
$avgDaily = $daysInMonth > 0 ? $totalOmset / $daysInMonth : 0;

// Target
$stmt = $pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = 'target_bulanan'");
$stmt->execute();
$targetRow = $stmt->fetch(PDO::FETCH_ASSOC);
$target = $targetRow ? $targetRow['setting_value'] : 25000000;
$achievement = $target > 0 ? ($totalOmset / $target) * 100 : 0;

// Daily data for bar chart (per hari)
$stmt = $pdo->prepare("
    SELECT DAY(date) as day, COALESCE(SUM(amount), 0) as total 
    FROM invoices 
    WHERE MONTH(date) = ? AND YEAR(date) = ?
    GROUP BY DAY(date)
    ORDER BY day
");
$stmt->execute([$currentMonth, $currentYear]);
$dailyData = $stmt->fetchAll(PDO::FETCH_ASSOC);

// If no data, create empty data for all days in month
if (empty($dailyData)) {
    $dailyData = [];
    for ($i = 1; $i <= $daysInMonth; $i++) {
        $dailyData[] = ['day' => $i, 'total' => 0];
    }
}

// Weekly data for line chart
$stmt = $pdo->prepare("
    SELECT 
        WEEK(date, 1) - WEEK(DATE_FORMAT(date, '%Y-%m-01'), 1) + 1 as week,
        COALESCE(SUM(amount), 0) as total 
    FROM invoices 
    WHERE MONTH(date) = ? AND YEAR(date) = ?
    GROUP BY WEEK(date, 1)
    ORDER BY week
");
$stmt->execute([$currentMonth, $currentYear]);
$weeklyData = $stmt->fetchAll(PDO::FETCH_ASSOC);

// If no weekly data, create sample
if (empty($weeklyData)) {
    $weeklyData = [
        ['week' => 1, 'total' => 0],
        ['week' => 2, 'total' => 0],
        ['week' => 3, 'total' => 0],
        ['week' => 4, 'total' => 0]
    ];
}

// Client distribution for donut chart
$stmt = $pdo->prepare("
    SELECT 
        client, 
        COALESCE(SUM(amount), 0) as total 
    FROM invoices 
    WHERE MONTH(date) = ? AND YEAR(date) = ?
    GROUP BY client
    ORDER BY total DESC
");
$stmt->execute([$currentMonth, $currentYear]);
$clientData = $stmt->fetchAll(PDO::FETCH_ASSOC);

// If no client data, return empty array
if (empty($clientData)) {
    $clientData = [];
}

// All invoices for table
$stmt = $pdo->prepare("SELECT * FROM invoices ORDER BY date DESC");
$stmt->execute();
$invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return JSON response
header('Content-Type: application/json');
echo json_encode([
    'total_omset' => (float)$totalOmset,
    'total_invoices' => (int)$totalInvoices,
    'avg_daily' => (float)$avgDaily,
    'target' => (float)$target,
    'achievement' => (float)$achievement,
    'daily_chart' => $dailyData,
    'weekly_chart' => $weeklyData,
    'client_chart' => $clientData,
    'invoices' => $invoices,
    'user_role' => $_SESSION['role']
]);
?>