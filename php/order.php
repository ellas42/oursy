<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration
define('OWNER_EMAIL', 'ellalianaa06@gmail.com');
define('SITE_NAME', 'Oursy');
define('FROM_EMAIL', 'ellalianaa06@gmail.com');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON data from request
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate required fields
$required_fields = ['fullName', 'email', 'whatsapp', 'product', 'productName', 'size', 'quantity', 'price', 'address'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: ' . implode(', ', $missing_fields)
    ]);
    exit();
}

// Sanitize input data
$fullName = htmlspecialchars(strip_tags($data['fullName']));
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$whatsapp = htmlspecialchars(strip_tags($data['whatsapp']));
$productName = htmlspecialchars(strip_tags($data['productName']));
$size = htmlspecialchars(strip_tags($data['size']));
$quantity = intval($data['quantity']);
$price = floatval($data['price']);
$address = htmlspecialchars(strip_tags($data['address']));
$notes = isset($data['notes']) ? htmlspecialchars(strip_tags($data['notes'])) : '';

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address'
    ]);
    exit();
}

$subtotal = $price * $quantity;
$total = $subtotal;

// Create order ID
$orderId = date('YmdHis') . '-' . uniqid();
$timestamp = date('Y-m-d H:i:s');

// Create order data array
$orderData = [
    'id' => $orderId,
    'timestamp' => $timestamp,
    'customer' => [
        'name' => $fullName,
        'email' => $email,
        'whatsapp' => $whatsapp
    ],
    'order' => [
        'product' => $productName,
        'size' => $size,
        'quantity' => $quantity,
        'price' => $price,
        'subtotal' => $subtotal,
        'total' => $total
    ],
    'delivery' => [
        'address' => $address,
        'notes' => $notes
    ]
];

// Save order as JSON file
$ordersDir = __DIR__ . '/../orders';
if (!is_dir($ordersDir)) {
    mkdir($ordersDir, 0755, true);
}

$orderFile = $ordersDir . '/' . $orderId . '.json';
$saved = file_put_contents($orderFile, json_encode($orderData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

if ($saved === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to save order. Please try again or contact us directly.'
    ]);
    exit();
}

// Send email to owner
$ownerEmailSent = sendOwnerEmail($orderId, $timestamp, $fullName, $email, $whatsapp, $productName, $size, $quantity, $price, $subtotal, $total, $address, $notes);

// Send confirmation email to customer
$customerEmailSent = sendCustomerEmail($fullName, $productName, $size, $quantity, $total, $whatsapp, $email);

// Log email status
error_log("Order $orderId - Owner email: " . ($ownerEmailSent ? 'sent' : 'failed') . ", Customer email: " . ($customerEmailSent ? 'sent' : 'failed'));

$message = 'Order submitted successfully! ';
if (!$ownerEmailSent || !$customerEmailSent) {
    $message .= '(Note: Email delivery is not configured on this server. Order saved to system.)';
} else {
    $message .= 'Check your email for confirmation.';
}

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => $message,
    'orderId' => $orderId
]);

/**
 * Send email to shop owner with order details
 */
function sendOwnerEmail($orderId, $timestamp, $fullName, $email, $whatsapp, $productName, $size, $quantity, $price, $subtotal, $total, $address, $notes) {
    global $result;
    $subject = "New Order from " . $fullName . " - " . $productName;
    
    $htmlBody = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 5px;
        }
        .info-row {
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .info-label {
            font-weight: bold;
            color: #555;
            display: inline-block;
            width: 140px;
        }
        .total-section {
            background-color: #e8f4f8;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
        }
        .total-final {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
            border-top: 2px solid #3498db;
            padding-top: 10px;
            margin-top: 10px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #777;
            font-size: 12px;
        }
        .notes-box {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class='header'>
        <h1>" . SITE_NAME . "</h1>
        <p>New Order Received</p>
    </div>
    
    <div class='content'>
        <p><strong>Order ID:</strong> " . $orderId . "</p>
        <p><strong>Date:</strong> " . $timestamp . "</p>

        <div class='section'>
            <div class='section-title'>Order Details</div>
            <div class='info-row'>
                <span class='info-label'>Product:</span>
                <span>" . $productName . "</span>
            </div>
            <div class='info-row'>
                <span class='info-label'>Size:</span>
                <span>" . $size . "</span>
            </div>
            <div class='info-row'>
                <span class='info-label'>Quantity:</span>
                <span>" . $quantity . "</span>
            </div>
            <div class='info-row'>
                <span class='info-label'>Price per item:</span>
                <span>Rp" . number_format($price, 0, ',', '.') . "</span>
            </div>
        </div>

        <div class='section'>
            <div class='section-title'>Customer Information</div>
            <div class='info-row'>
                <span class='info-label'>Name:</span>
                <span>" . $fullName . "</span>
            </div>
            <div class='info-row'>
                <span class='info-label'>Email:</span>
                <span><a href='mailto:" . $email . "'>" . $email . "</a></span>
            </div>
            <div class='info-row'>
                <span class='info-label'>WhatsApp:</span>
                <span>" . $whatsapp . "</span>
            </div>
        </div>

        <div class='section'>
            <div class='section-title'>Delivery Address (Bali)</div>
            <div class='info-row'>" . nl2br($address) . "</div>
        </div>
    ";
    
    if (!empty($notes)) {
        $htmlBody .= "
        <div class='section'>
            <div class='section-title'>Order Notes</div>
            <div class='notes-box'>" . nl2br($notes) . "</div>
        </div>
        ";
    }
    
    $htmlBody .= "
        <div class='total-section'>
            <div class='total-row'>
                <span>Subtotal:</span>
                <span>Rp" . number_format($subtotal, 0, ',', '.') . "</span>
            </div>
            <div class='total-row'>
                <span>Shipping:</span>
                <span>Calculated After</span>
            </div>
            <div class='total-row total-final'>
                <span>Total:</span>
                <span>Rp" . number_format($total, 0, ',', '.') . "</span>
            </div>
        </div>
    </div>
    
    <div class='footer'>
        <p>This order was placed on " . date('F j, Y \a\t g:i A') . "</p>
        <p>&copy; " . date('Y') . " " . SITE_NAME . " - All rights reserved</p>
    </div>
</body>
</html>
    ";
    
    $plainBody = "NEW ORDER FROM " . SITE_NAME . "\n";
    $plainBody .= "================================\n\n";
    $plainBody .= "ORDER ID: " . $orderId . "\n";
    $plainBody .= "DATE: " . $timestamp . "\n\n";
    $plainBody .= "ORDER DETAILS\n";
    $plainBody .= "-------------\n";
    $plainBody .= "Product: " . $productName . "\n";
    $plainBody .= "Size: " . $size . "\n";
    $plainBody .= "Quantity: " . $quantity . "\n";
    $plainBody .= "Price per item: Rp" . number_format($price, 0, ',', '.') . "\n\n";
    $plainBody .= "CUSTOMER INFORMATION\n";
    $plainBody .= "--------------------\n";
    $plainBody .= "Name: " . $fullName . "\n";
    $plainBody .= "Email: " . $email . "\n";
    $plainBody .= "WhatsApp: " . $whatsapp . "\n\n";
    $plainBody .= "DELIVERY ADDRESS (BALI)\n";
    $plainBody .= "-----------------------\n";
    $plainBody .= $address . "\n\n";
    
    if (!empty($notes)) {
        $plainBody .= "ORDER NOTES\n";
        $plainBody .= "-----------\n";
        $plainBody .= $notes . "\n\n";
    }
    
    $plainBody .= "TOTAL SUMMARY\n";
    $plainBody .= "-------------\n";
    $plainBody .= "Subtotal: Rp" . number_format($subtotal, 0, ',', '.') . "\n";
    $plainBody .= "Shipping: Calculated After\n";
    $plainBody .= "Total: Rp" . number_format($total, 0, ',', '.') . "\n";
    
    return sendMultipartEmail(OWNER_EMAIL, $subject, $plainBody, $htmlBody);
}

/**
 * Send confirmation email to customer
 */
function sendCustomerEmail($fullName, $productName, $size, $quantity, $total, $whatsapp, $customerEmail) {
    $subject = "Order Confirmation - " . $productName;
    
    $htmlBody = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
            border-top: none;
        }
        .order-summary {
            background-color: #e8f4f8;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .order-summary ul {
            list-style: none;
            padding: 0;
        }
        .order-summary li {
            padding: 8px 0;
            border-bottom: 1px solid #d0e8f0;
        }
        .order-summary li:last-child {
            border-bottom: none;
        }
        .total {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #3498db;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #777;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class='header'>
        <h1>Thank You for Your Order!</h1>
    </div>
    <div class='content'>
        <p>Hi " . $fullName . ",</p>
        <p>We've received your order for <strong>" . $productName . "</strong> and we'll get back to you shortly to confirm the details and arrange delivery.</p>
        
        <div class='order-summary'>
            <p><strong>Order Summary:</strong></p>
            <ul>
                <li><strong>Product:</strong> " . $productName . "</li>
                <li><strong>Size:</strong> " . $size . "</li>
                <li><strong>Quantity:</strong> " . $quantity . "</li>
                <li class='total'><strong>Total:</strong> Rp" . number_format($total, 0, ',', '.') . "</li>
            </ul>
        </div>
        
        <p>We'll contact you via WhatsApp at <strong>" . $whatsapp . "</strong> or email at <strong>" . $customerEmail . "</strong> to finalize the shipping details.</p>
        <p>Thank you for choosing " . SITE_NAME . "!</p>
        <p>Best regards,<br>The " . SITE_NAME . " Team</p>
    </div>
    <div class='footer'>
        <p>&copy; " . date('Y') . " " . SITE_NAME . " - All rights reserved</p>
    </div>
</body>
</html>
    ";
    
    $plainBody = "Thank You for Your Order!\n";
    $plainBody .= "========================\n\n";
    $plainBody .= "Hi " . $fullName . ",\n\n";
    $plainBody .= "We've received your order for " . $productName . " and we'll get back to you shortly to confirm the details and arrange delivery.\n\n";
    $plainBody .= "ORDER SUMMARY\n";
    $plainBody .= "-------------\n";
    $plainBody .= "Product: " . $productName . "\n";
    $plainBody .= "Size: " . $size . "\n";
    $plainBody .= "Quantity: " . $quantity . "\n";
    $plainBody .= "Total: Rp" . number_format($total, 0, ',', '.') . "\n\n";
    $plainBody .= "We'll contact you via WhatsApp at " . $whatsapp . " or email at " . $customerEmail . " to finalize the shipping details.\n\n";
    $plainBody .= "Thank you for choosing " . SITE_NAME . "!\n\n";
    $plainBody .= "Best regards,\n";
    $plainBody .= "The " . SITE_NAME . " Team\n";
    
    return sendMultipartEmail($customerEmail, $subject, $plainBody, $htmlBody);
}

/**
 * Send multipart email (plain text + HTML)
 */
function sendMultipartEmail($to, $subject, $plainBody, $htmlBody) {
    $boundary = "boundary-" . md5(time() . rand());
    
    $headers = [];
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-Type: multipart/alternative; boundary=\"" . $boundary . "\"";
    $headers[] = "From: " . SITE_NAME . " <" . FROM_EMAIL . ">";
    $headers[] = "X-Mailer: PHP/" . phpversion();
    
    $emailBody = "--" . $boundary . "\r\n";
    $emailBody .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $emailBody .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $emailBody .= $plainBody . "\r\n\r\n";
    $emailBody .= "--" . $boundary . "\r\n";
    $emailBody .= "Content-Type: text/html; charset=UTF-8\r\n";
    $emailBody .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $emailBody .= $htmlBody . "\r\n\r\n";
    $emailBody .= "--" . $boundary . "--";
    
    $result = mail($to, $subject, $emailBody, implode("\r\n", $headers));
    error_log("Email to $to: " . ($result ? 'Success' : 'Failed'));
    
    return $result;
}
?>