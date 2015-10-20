<?php
session_start();

require_once("../IQXInc.php");
require_once("tbs_class.php");
require_once("tbs_plugin_iqx.php");

$nonauthenticated=isset($_REQUEST['noauth']);
if (!( $nonauthenticated || isset( $_SESSION['authcred'],$_SESSION['username'],$_SESSION['userclass']) )) {
    echo '<p>You are not logged in. Please refresh your browser, log in, and then try again.</p>';
    }
elseif (!isset( $_REQUEST['page'] )) {
    echo '<p>Page not specified</p>';
    }
else {
    $x_errormessage = '';
	
    $pagebase = $_REQUEST['page'];
    $page=IQXNetCustomPath($pagebase . '.html');
	
	if (isset($_SESSION['username'])) {
    	$x_username=$_SESSION['username']; }
	if (isset($_SESSION['userclass'])) {
    	$x_userclass=$_SESSION['userclass']; }
	if (isset($_SESSION['userrights'])) {
    	$x_rights=$_SESSION['userrights']; }
	if (isset($_SESSION['switches'])) {
    	$x_switches=$_SESSION['switches']; }
    $x_params=array();
    foreach ($_REQUEST as $key => $value) {
      $x_params[$key]=$value;
      }
    $x_local=IQXLoadIniFile($pagebase . '.ini');
	IQXSetINIuserclass();
		
    $TBS = new clsTinyButStrong('','x_');  // Only vars prefixed with x_ are merged for security purposes
    $TBS->LoadTemplate($page) ;
	IQXMergeTBSBlocks();
    $TBS->Show();
    }

?>