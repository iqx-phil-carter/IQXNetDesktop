<?php

// Count login attempts, and open Captcha

require_once('IQXInc.php');

session_name('counter');
session_start();

// draw logincount from conf file.
$logincount=(int) LOGIN_COUNT;

// if session count does not exist then create it and set to 0
if(isset($_SESSION['count'])==FALSE){
	$_SESSION['count']=(int) 0;
	}

// if not equal to zero, increment count, and check for equal to login_count. If so, return Verify, and end.
if($logincount!=0){
	$_SESSION['count']++;
	if($_SESSION['count']==$logincount){
		$_SESSION['count']=(int) 0;
		print 'Verify';
		session_write_close();
		exit;
	}
}

session_write_close();

?>