<?php
// 20121121 verify reCaptcha

  require_once('recaptchalib.php');
  $privatekey = "6Lf2CtkSAAAAAFW9OQNmZ3jQm_QnHCZ75AvRbbmi"; // iqxusers.co.uk
  //$privatekey = "6LewANoSAAAAAN41lHmHDg9hdZeXqtsNZFlPvsqf"; // ecruit.asarecruitment.co.uk
  $resp = recaptcha_check_answer ($privatekey,
                                $_SERVER["REMOTE_ADDR"],
                                $_POST["recaptcha_challenge_field"],
                                $_POST["recaptcha_response_field"]);

  if (!$resp->is_valid) {
    // What happens when the CAPTCHA was entered incorrectly
    die ($resp->error );
  } else {
  	// Your code here to handle a successful verification
  	print("OK");
  }
  ?>