<?php
session_start();

require_once("../IQXInc.php");

if (!isset( $_SESSION['authcred'] )) {
    print('You are not logged in. Please refresh your browser, log in, and then try again.');
    exit;
    }

if (isset($_GET['service'])) {
  $call='IQXService/' . $_GET['service'];
} elseif (isset($_GET['job'])) {
  $call='IQXJob/' . $_GET['job'];
} elseif (isset($_GET['proc'])) {
  $call='IQXCall/' . $_GET['proc'];
} else {
  print('Missing or unrecognised post mechanism');
  exit;
}

$jsonresponse=(isset($_GET['jsonresponse']) && $_GET['jsonresponse']=='1');

$err='';
$res = IQXNetRetrieve($call,$_POST,$err);
if ($res) {
    $xmlData = new SimpleXMLElement($res);
    if($xmlData["success"] == 1) {
    	if ($jsonresponse) print(json_encode(array('success'=>1,'message'=>(string) $xmlData->IQXSuccess["message"],'id'=>(string) $xmlData->IQXSuccess["id"])));
        else print('Ok');
        exit;
        }
    else {
        $xmlerr=(string) $xmlData->IQXFailure["message"];
        if ($xmlerr) {
    		if ($jsonresponse) print(json_encode(array('success'=>0,'message'=>$xmlerr,'id'=>(string) $xmlData->IQXFailure["id"])));
        	else print($xmlerr);
			exit;
            }
        }
    }
if (!$err) {
    $err='Posting error';
    }

if ($jsonresponse) print(json_encode(array('success'=>0,'message'=>$err,'id'=>"")));
else print($err);

?>