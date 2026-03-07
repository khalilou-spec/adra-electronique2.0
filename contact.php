<?php
if($_POST) {
  $to = "contact@adra-electronique.sn";
  $subject = "Message de " . $_POST['name'];
  $message = "Email: " . $_POST['email'] . "\n\n" . $_POST['message'];
  $headers = "From: " . $_POST['email'];
  
  mail($to, $subject, $message, $headers);
  header("Location: index.html?sent=1");
}
?>