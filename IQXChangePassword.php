<?php
// 20150212 use PersId instead of email

session_start();

require_once('IQXInc.php');

$err='';
$errormessage = 'Unable to change password.';
$forcedchange = (isset($_SESSION['changepwd']) && $_SESSION['changepwd']);



if(!isset($_REQUEST['PersID'])){ // if email is set, then request is coming from NewChangePassword
  if ( !( $forcedchange or isset( $_REQUEST['old_password']) )) {
    echo 'Insufficient data.';
    exit;
    }
}
if (!isset( $_REQUEST['new_password'],$_REQUEST['new_password_check'] ) or !trim($_REQUEST['new_password']) ) {
    echo 'Insufficient data.';
    exit;
    }

if ($_REQUEST['new_password']!=$_REQUEST['new_password_check']) {
    echo 'New password mismatch.';
    exit;
    }

if(!isset($_REQUEST['PersID'])){ // if Person ID is set, then request is coming from NewChangePassword
  if (!isset( $_SESSION['authcred'] )) {
      echo 'You are not logged in. Please refresh your browser, log in, and then try again.';
      exit;
      }


  $OldAuthCred=$_SESSION['authcred'];
  $i=strpos($OldAuthCred,':');
  if ($i==null) {   // FALSE and 0 are both invalid in this case
      echo 'A '.$errormessage;
      exit;
      }

  $UID=substr($OldAuthCred,0,$i);
  $OldPWD=substr($OldAuthCred,$i+1);
  if ( !$forcedchange and $OldPWD!=$_REQUEST['old_password'] ) {
      echo 'B '.$errormessage;
      exit;
      }
}

/*
if(trim($_REQUEST['TSP_Auth'])!=''){
	$call='IQXCall_/NetTwoPartVerification?pLoginID='.trim($_SESSION['PersID']).'&pPartOne='.trim($_REQUEST['TSP_Part_One']).'&pPartTwo='.trim($_REQUEST['TSP_Part_Two']).'&pPartThree='.trim($_REQUEST['TSP_Part_Three']).'&pPartFour='.trim($_REQUEST['TSP_Part_Four']).'&pAuthType='.trim($_REQUEST['TSP_Auth']); 
		$res = IQXNetRetrieve($call,'',$err);
		if ($res) {
  			$xmlData = new SimpleXMLElement($res);
			if($xmlData['success'] != 1) {
    			$res=false;
				echo 'Authentication failed. Please check your authentication values and try again.';
				exit;
    		}
		}
	}
*/

if(isset($_REQUEST['PersID'])){ // if email is set, then request is coming from NewChangePassword
	$call='IQXCall_/NetNewLoginFromEmail?pLoginID='.trim($_REQUEST['PersID']).'&pPassword='.trim($_REQUEST['new_password']).'&pPasswordCheck='.trim($_REQUEST['new_password_check']); 
		$res = IQXNetRetrieve($call,'',$err);
		if ($res) {
  			$xmlData = new SimpleXMLElement($res);
        echo strpos($res,'|').' '.strpos($res,'" />');
			if($xmlData['success'] != 1) {
    			$res=false;
				echo 'Password creation failed. Please check your values and try again. Code:'.$xmlData['success'];
				exit;
    		}
		}
	}
  
// The changepassword.html validation should ensure that white space around new passwords is not allowed
if(isset($_REQUEST['PersID']) && trim($_REQUEST['PersID'])==''){ // if email is blank, then request is not coming from NewChangePassword
  $NewPWD=$_REQUEST['new_password'];
  if (defined("PASSWORD_TO_FORCE_CHANGE") && PASSWORD_TO_FORCE_CHANGE==$NewPWD) {
      echo 'This password is not allowed. Please use a different one.';
      exit;
      }
  $res = IQXNetRetrieve('IQXChangePassword',array("NEWPASSWORD" => $NewPWD),$err);
}
 $NewPWD=$_REQUEST['new_password'];
 $res = IQXNetRetrieve('IQXChangePassword',array("NEWPASSWORD" => $NewPWD),$err);
 
if ($res) {
  $xmlData = new SimpleXMLElement($res);
  if($xmlData['success'] == 1) {
    $_SESSION['authcred']=$UID . ':' . $NewPWD;
    $_SESSION['changepwd']=FALSE;
    }
  else {
  	$res=false;
    }
  }

if ($res) {
  print 'Ok';
  }
else {
    print $errormessage;
  }

?>