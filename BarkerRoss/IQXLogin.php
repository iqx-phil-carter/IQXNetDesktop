<?php

// 20140708 Support for CORS (cross-origin resource sharing) added
$allowed_url = 'http://br-iqx.xcitestaging.co.uk';

if ($_SERVER['HTTP_ORIGIN'] == $allowed_url) {
    header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Max-Age: 1000');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
	
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        exit(0);
    }
}

session_start();

require_once('IQXInc.php');

$err='';
$errormessage = 'Invalid user name or password';

// Note: uid and pws are trimmed mainly to ensure copied and pasted stuff works ok
// The changepassword.html validation also ensures that white space around new passwords is not allowed

// forgotten password bit - use in conjunction with EmailNewLogins job
if (isset($_REQUEST['forgotten']) && trim($_REQUEST['forgotten'])=='true') {
	if(!isset($_REQUEST['login_email']) || trim($_REQUEST['login_email'])==''){
		print 'If you wish to be reminded of your password, please enter the email address you used when you first registered';
		exit;
	}
	$call='IQXCall_/NetForgottenPassword?login_email='.trim($_REQUEST['login_email']) ; 
	$res = IQXNetRetrieve($call,$candpost,$err);
	
	if($err){
		print 'Error :'.$res;
		exit;
	}
		
	$xmlData = new SimpleXMLElement($res);
  	if($xmlData['success'] == 1) {
		print 'Ok';
  	}else{
  	 $xmlErr=(string) $xmlData->IQXFailure["message"];
        if ($xmlErr) {
            $err=$xmlErr;
            if($err>''){
            	print $err;
            	}
            }
        }
  	
	exit;
}
// forgotten password bit


if (trim($_REQUEST['login_uid']) && trim($_REQUEST['login_pwd'])) {
  $_SESSION['authcred']=trim($_REQUEST['login_uid']) . ':' . trim($_REQUEST['login_pwd']);
  $_SESSION['changepwd']=(defined("PASSWORD_TO_FORCE_CHANGE") && PASSWORD_TO_FORCE_CHANGE==$_REQUEST['login_pwd']);
  $res = IQXNetRetrieve('IQXAuthenticate','',$err);
  }
else {
  $res=false;
  $errormessage = 'Please enter user name and password';
  }

if ($res) {
	
  $xmlData = new SimpleXMLElement($res);
  if($xmlData['success'] == 1) {
  	

    $_SESSION['username']=(string) $xmlData->UserName;     // (string) cast is crucial because otherwise it stores an object in the session variable which causes errors
    $_SESSION['userclass']=(string) $xmlData->UserClass;
    if (isset($xmlData->UserRights)) {
      $rights=(string) $xmlData->UserRights;
      }
    else {
      $rights='';
      }
    if (isset($xmlData->Switches)) {
      $switches=(string) $xmlData->Switches;
      }
    else {
      $switches='';
      }
    $_SESSION['userrights']=IQXNetBuildRightsArray($rights);
    $_SESSION['switches']=IQXNetBuildRightsArray($switches);
    if (!$_SESSION['username'] || !$_SESSION['userclass']){
      $res=false;
      $errormessage = 'Login failed';
      }
    else {
    	$resTitle=IQXNetRetrieve('IQXCallResult/NetOwnerPageTitle','',$errormessage); 
    	if($resTitle){
    		$xmlDataTitle = new SimpleXMLElement($resTitle);
    		foreach($xmlDataTitle as $Title){
    			$_SESSION['sitename'] =(string)$Title->PageTitle;
    			}
    		} 
    	}
    }
  else {
    $res=false;
    }
  }

if ($res) {
	// 20140708 Added support for returing SESSION info back to the requester
	if ($_SERVER['HTTP_ORIGIN'] == $allowed_url) {
		echo json_encode(array(
			'status' => 'Ok',
			'authcred' => $_SESSION['authcred'],
			'username' => $_SESSION['username'],
			'userrights' => $_SESSION['userrights'],
			'userclass' => $_SESSION['userclass'],
		));
	} else {
		print 'Ok';
	}
		
  }
else {

  $_SESSION = array();
  print $errormessage;
  }


?>