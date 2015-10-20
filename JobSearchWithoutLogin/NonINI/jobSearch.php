<?php
session_start();

require_once("../IQXInc.php");

$err='';
	
if (trim($_REQUEST['noauth'])=='yes' && (trim($_REQUEST['proc'])=='NetAlreadyApplied')) {	
	$call='IQXCall_/'.trim($_GET['proc']).'&pWebUserId='.$_SESSION['username'] ; 
	$jsonresponse=(isset($_GET['jsonresponse']) && $_GET['jsonresponse']=='1');

	$res = IQXNetRetrieve($call,'',$err);
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
	}

if (!$err) {
    $err='Posting error';
    }

if ($jsonresponse) print(json_encode(array('success'=>0,'message'=>$err,'id'=>"")));
else print($err);

?>