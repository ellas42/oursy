<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'PHP Error: ' . $errstr . ' in ' . $errfile . ':' . $errline
    ]);
    exit();
});

require 'config.php';
require_once __DIR__ . '/../PHPMailer-master/src/PHPMailer.php';
require_once __DIR__ . '/../PHPMailer-master/src/Exception.php';
require_once __DIR__ . '/../PHPMailer-master/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON received']);
    exit();
}

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

$fullName = htmlspecialchars(strip_tags($data['fullName']));
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$whatsapp = htmlspecialchars(strip_tags($data['whatsapp']));
$productName = htmlspecialchars(strip_tags($data['productName']));
$size = htmlspecialchars(strip_tags($data['size']));
////////$color = 
$quantity = intval($data['quantity']);
$price = floatval($data['price']);
///////total & subtotal change $price * quantity
$address = htmlspecialchars(strip_tags($data['address']));
$notes = isset($data['notes']) ? htmlspecialchars(strip_tags($data['notes'])) : '';

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

$orderId = date('YmdHis') . '-' . uniqid();
$timestamp = date('Y-m-d H:i:s');

$ownerEmailSent = sendOwnerEmail($orderId, $timestamp, $fullName, $email, $whatsapp, $productName, $size, $quantity, $price, $subtotal, $total, $address, $notes);
$ownerError = $ownerEmailSent['success'] ? '' : $ownerEmailSent['error'];

$customerEmailSent = sendCustomerEmail($fullName, $productName, $size, $quantity, $subtotal, $whatsapp, $email);
$customerError = $customerEmailSent['success'] ? '' : $customerEmailSent['error'];

if (!$ownerEmailSent['success'] || !$customerEmailSent['success']) {
    http_response_code(500);
    $errorMsg = 'Email Error: ';
    if (!$ownerEmailSent['success']) $errorMsg .= 'Owner email - ' . $ownerError . '. ';
    if (!$customerEmailSent['success']) $errorMsg .= 'Customer email - ' . $customerError;
    echo json_encode([
        'success' => false,
        'message' => $errorMsg
    ]);
    exit();
}

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Order submitted successfully! Check your email for confirmation. We\'ll also contact you via WhatsApp to confirm.',
    'orderId' => $orderId
]);


function sendOwnerEmail($orderId, $timestamp, $fullName, $email, $whatsapp, $productName, $size, $quantity, $price, $subtotal, $total, $address, $notes) {

$mail = new PHPMailer(true);

    
    try {
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->Port = SMTP_PORT;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->setFrom(FROM_EMAIL, SITE_NAME);
        $mail->addAddress(OWNER_EMAIL);
        
        $mail->isHTML(true);
        $mail->Subject = "New Order from " . $fullName . " - " . $productName;
        
        $htmlBody = getOwnerEmailHTML($orderId, $timestamp, $fullName, $email, $whatsapp, $productName, $size, $quantity, $price, $subtotal, $total, $address, $notes);
        $mail->Body = $htmlBody;
        $mail->AltBody = getOwnerEmailPlain($orderId, $timestamp, $fullName, $email, $whatsapp, $productName, $size, $quantity, $price, $subtotal, $total, $address, $notes);
        
        $result = $mail->send();
        error_log("Owner email sent successfully to " . OWNER_EMAIL);
        return ['success' => true, 'error' => ''];
    } catch (Exception $e) {
        $errorMsg = "Owner email failed: " . $mail->ErrorInfo;
        error_log($errorMsg);
        return ['success' => false, 'error' => $mail->ErrorInfo];
    }
}

function getOwnerEmailHTML($orderId, $timestamp, $fullName, $email, $whatsapp, $productName, $size, $quantity, $price, $subtotal, $total, $address, $notes) {
    return "
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
    
    return $htmlBody;
}

function getOwnerEmailPlain($orderId, $timestamp, $fullName, $email, $whatsapp, $productName, $size, $quantity, $price, $subtotal, $total, $address, $notes) {
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
    
    return $plainBody;
}

//to customer
function sendCustomerEmail($fullName, $productName, $size, $quantity, $total, $whatsapp, $customerEmail) {
    $mail = new PHPMailer(true);
    $mail->SMTPDebug = 2;
$mail->Debugoutput = 'error_log';

    
    try {
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->Port = SMTP_PORT;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->setFrom(FROM_EMAIL, SITE_NAME);
        $mail->addAddress($customerEmail);
        
        $mail->isHTML(true);
        $mail->Subject = "Order Confirmation - " . $productName;
        
        $htmlBody = getCustomerEmailHTML($fullName, $productName, $size, $quantity, $total, $whatsapp, $customerEmail);
        $mail->Body = $htmlBody;
        $mail->AltBody = getCustomerEmailPlain($fullName, $productName, $size, $quantity, $total, $whatsapp, $customerEmail);
        
        $result = $mail->send();
        error_log("Customer confirmation email sent to " . $customerEmail);
        return ['success' => true, 'error' => ''];
    } catch (Exception $e) {
        $errorMsg = "Customer email failed: " . $mail->ErrorInfo;
        error_log($errorMsg);
        return ['success' => false, 'error' => $mail->ErrorInfo];
    }
}

function getCustomerEmailHTML($fullName, $productName, $size, $quantity, $total, $whatsapp, $customerEmail) {
    return "
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
}

function getCustomerEmailPlain($fullName, $productName, $size, $quantity, $total, $whatsapp, $customerEmail) {
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
    
    return $plainBody;
}
?>