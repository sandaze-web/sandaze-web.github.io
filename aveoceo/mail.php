<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8"/>
    <meta name="format-detection" content="telephone=no"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="shortcut icon" href="favicon.png" type="image/x-icon"/>
    <!--==========   STYLESHEET   ==========-->
    <link rel="stylesheet" href="css/index.css?v=1.5"/>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css"/>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css"/>
    <title></title>
    <!--==========   SCRIPTS   ==========-->

    <script defer src="plugins/jquery-3.6.0.min.js"></script>
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js" integrity="sha512-XtmMtDEcNz2j7ekrtHvOVR4iwwaD6o/FUJe6+Zq+HgcCsk3kj4uSQQR8weQ2QVj1o0Pk6PwYLohm206ZzNfubg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script defer src="https://smtpjs.com/v3/smtp.js"></script>
    <script src="https://www.google.com/recaptcha/api.js" defer></script>
    <script defer src="js/index.js?v=1.6"></script>
    <title></title>
</head>

<body>
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

function header_encode($str, $data_charset, $send_charset)
{
    if($data_charset != $send_charset) {
        $str=iconv($data_charset,$send_charset.'//IGNORE',$str); //-- при необходимости изменим кодировку самого текста
    }

    return ('=?'.$send_charset.'?B?'.base64_encode($str).'?=');
}

if(isset($_POST['name'])){
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $message = $_POST['message'];

    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';

    $mail->SMTPAuth = true;
    $mail->Username = 'business@aveoceo.com';
    $mail->Password = 'mhiisfydfhyqcjyh';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;

    $mail->setFrom('business@aveoceo.com ');

    $mail->addAddress('business@aveoceo.com');

    $mail->isHTML(true);

    $mail->Subject = header_encode("Контакт с aveoceo.com", "UTF-8", "UTF-8");
    $mail->Body = 'Страница: '. $_POST['page'] . '<br>Имя: ' . $name . '<br>Телефон: ' . $phone . '<br>Сообщение: ' . $message;

    $mail->send();

    echo 'succes';
}

?>

</body>
</html>
