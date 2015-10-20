<?php

// Mobile iqxnet

session_start();

require_once("IQXNet.conf");
require_once("../IQXInc.php");
require_once("../tbs_class.php");
require_once("../tbs_plugin_iqx.php");

$x_title=SITE_TITLE;
$x_customfolder=CUSTOM_FOLDER;
$x_errormessage = '';
$x_state='LOGGEDOUT';
$changingpassword=FALSE;
$err = '';
if (isset($_REQUEST['iqxnet_action'])){
    $iqxnetaction=$_REQUEST['iqxnet_action'];
} else {
    $iqxnetaction='';
}
if ($iqxnetaction=='logout'){
    $_SESSION = array();
}
$x_querystring=$_SERVER['QUERY_STRING'];
if (trim($x_querystring)) {
    $x_querystring='?' . $x_querystring;
    }
   
if (isset($_GET['P']) && preg_match('/^[a-z0-9_]+$/i',$_GET['P'])) {   // Inserted page - ensure local html
    $x_divcontentfilename=trim($_GET['P']);
    if (substr($x_divcontentfilename,0,4)=='new_') {
        $_SESSION = array();  // Force logout before starting
        }
    }
else {
    $x_divcontentfilename='favourites';        // Default
    //$x_divcontentfilename='candidate_tabs';        // Default
    }

if((isset($_SESSION['username'],$_SESSION['userclass'],$_SESSION['authcred'])
        && $_SESSION['username'] && $_SESSION['userclass'] && $_SESSION['authcred'])){
    $x_state='LOGGEDIN';
    }

if ($x_state=='LOGGEDIN') {
    $x_username=$_SESSION['username'];
    $x_userclass=$_SESSION['userclass'];
    $x_userid=strstr($_SESSION['authcred'],':',TRUE);
    $x_params=array();
    foreach ($_REQUEST as $key => $value) {
      $x_params[$key]=$value;
      }
    $x_rights=$_SESSION['userrights'];
    if (isset($_SESSION['switches'])) {
        $x_switches=$_SESSION['switches'];
        }
    if ($iqxnetaction=='changepassword' || $iqxnetaction=='forcechangepassword') {
        $changingpassword=TRUE;
        $NewPWD=$_REQUEST['new_password'];
        if ($NewPWD){
            if ($NewPWD == $_REQUEST['new_password_check']) {
                if (defined("PASSWORD_TO_FORCE_CHANGE") && PASSWORD_TO_FORCE_CHANGE==$NewPWD) {
                    $x_errormessage='This password is not allowed - please use a different one';
                } else {
                    $res = IQXNetRetrieve('IQXChangePassword',array("NEWPASSWORD" => $NewPWD),$err);
                    if ($res) {
                        $xmlData = new SimpleXMLElement($res);
                        if($xmlData['success'] == 1) {
                            $_SESSION['authcred']=$x_userid . ':' . $NewPWD;
                            $changingpassword=FALSE;
                            }
                        }
                    if ($changingpassword) {
                        $x_errormessage='Unable to change password';
                        }
                    }
            } else {
                $x_errormessage='Passwords do not match'; 
                }
        } else {
            $x_errormessage='Password cannot be blank';
            }
        }
    }
elseif (isset($_REQUEST['userid']) && isset($_REQUEST['password'])) {
    if (trim($_REQUEST['userid']) && trim($_REQUEST['password'])) {
        $_SESSION['authcred']=trim($_REQUEST['userid']) . ':' . trim($_REQUEST['password']);
        $res = IQXNetRetrieve('IQXAuthenticate','',$err);
        if ($res) {
            $xmlData = new SimpleXMLElement($res);
            if($xmlData['success'] == 1) {
                $_SESSION['username']=(string) $xmlData->UserName;     // (string) cast is crucial because otherwise it stores an object in the session variable which causes errors
                $_SESSION['userclass']=(string) $xmlData->UserClass;
                $x_userid=trim($_REQUEST['userid']);
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
                if (trim($_SESSION['username']) && trim($_SESSION['userclass'])) {
                    $changingpassword=(defined("PASSWORD_TO_FORCE_CHANGE") && PASSWORD_TO_FORCE_CHANGE==$_REQUEST['password']);
                    if ($changingpassword) {
                        $x_state='FORCECHANGEPASSWORD';
                    } else {
                        $x_state='LOGGEDIN';
                        }
                    }
                }
            }
        if ($x_state=='LOGGEDOUT') {
            $x_errormessage='Invalid user name or password';
            }
        }
    else {
        $x_errormessage='Please enter user name and password';
        }
    }
    
if ($x_state=='LOGGEDOUT') {   // Generate the login form
    $x_divcontentfilename='login';
    }
elseif ($x_state=='FORCECHANGEPASSWORD' || $changingpassword) {
    $x_divcontentfilename='changepassword';
    if ($iqxnetaction=='forcechangepassword'){
        $x_state='FORCECHANGEPASSWORD';
        }
    }

if($x_divcontentfilename=='favourites'){
	$x_divcontentfilename=strtolower(trim($_SESSION['userclass'])).'_tabs';
} 

$x_local=IQXLoadIniFile($x_divcontentfilename . '.ini');
IQXSetINIuserclass();
$x_divcontentfilename=IQXNetCustomPath($x_divcontentfilename . '.html');

$TBS = new clsTinyButStrong('','x_');  // Only vars prefixed with x_ are merged for security purposes
$TBS->LoadTemplate(IQXNetCustomPath('main.html'));
$_POST=array();  // Temporary fix to avoid login and pwd change params being sent on. Not sustainable. Could do this on actions above (login, logout, changepassword)
IQXMergeTBSBlocks();   // Added for Mobile
$TBS->Show();

?>