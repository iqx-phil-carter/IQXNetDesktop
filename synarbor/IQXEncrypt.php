<?php
    $key = "ThisIsTheKey1234";
	$date = new DateTime();
	$dateString=(string) $date->format('YmdHms');
	$text = $_REQUEST['ReportSource'] . '~'. $dateString.'~XX0SJRDM12012011003E';

	$td = mcrypt_module_open('tripledes', '', 'ecb', '');
    $iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
    mcrypt_generic_init($td, $key, $iv);
    $encrypted_data = mcrypt_generic($td, $text);
    mcrypt_generic_deinit($td);
    mcrypt_module_close($td);
	
    echo base64_encode($encrypted_data) . "\n";
?>