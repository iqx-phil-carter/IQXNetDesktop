<?php
session_start();

require_once("IQXNet.conf");
require_once("IQXInc.php");
require_once("tbs_class.php");
require_once("tbs_plugin_iqx.php");

$x_title=SITE_TITLE;
$x_subtitle=SITE_SUBTITLE;
$x_username='';
$x_userclass='';
$x_usertitle='';
$x_rights='';
$x_combodata='';
$x_headcontent='';
$x_errormessage = '';
$x_customfolder=CUSTOM_FOLDER;
$x_theme=CUSTOM_THEME ? CUSTOM_THEME : 'jqueryUI';
$x_params=array();
foreach ($_REQUEST as $key => $value) {
   $x_params[$key]=$value;
   }

if (isset($_REQUEST['page']) && $_REQUEST['page']) {
  $page = $_REQUEST['page'];
  }
else {
  echo '<p>Page not specified</p>';
  exit;
  }
$pageWrapper=isset($_REQUEST['wrapper']) && $_REQUEST['wrapper']?strtolower($_REQUEST['wrapper']):'none';  
// full means wrap in main.html with heading, bare means ditto but no heading, none (default) means load the specified page directly
if ($pageWrapper != 'none'){
	$x_divcontentfilename=IQXNetCustomPath($page . '.html');
	$page='main';
	$x_showdivheading=$pageWrapper=='full'?1:0;
	}

$nonauthenticated=isset($_REQUEST['noauth']);
$loggedin=(isset($_SESSION['username'],$_SESSION['userclass'],$_SESSION['authcred'])
        && $_SESSION['username'] && $_SESSION['userclass'] && $_SESSION['authcred']);

if ($loggedin) {
    $x_username=$_SESSION['username'];
    $x_userclass=$_SESSION['userclass'];
    $x_rights=$_SESSION['userrights'];
    if (isset($_SESSION['switches'])) {$x_switches=$_SESSION['switches'];}
    $x_usertitle=ucfirst(strtolower($x_userclass)) . ' Portal for ' . $x_username;
    if (isset($x_params['params'])){
       $x_combodata=IQXGenerateComboData($x_params['params']);
       }
    }
elseif (!$nonauthenticated) {
    $x_errormessage = 'Not logged in';
    }
	
if (isset($_REQUEST['usertitle']) && $_REQUEST['usertitle']) {
  $x_usertitle = $_REQUEST['usertitle'];
  }
  
$x_local=IQXLoadIniFile($page . '.ini');
IQXSetINIuserclass();

$TBS = new clsTinyButStrong('','x_');  // Only vars prefixed with x_ are merged for security purposes
$TBS->LoadTemplate(IQXNetCustomPath($page . '.html'));
IQXMergeTBSBlocks();
$TBS->Show();

?>