<?php

// 20121211 Captcha variable added

session_start();

require_once("IQXNet.conf");
require_once("IQXInc.php");
require_once("tbs_class.php");
require_once("tbs_plugin_iqx.php");

$x_title=SITE_TITLE;
$x_subtitle=SITE_SUBTITLE;
$x_customfolder=CUSTOM_FOLDER;
$x_theme=CUSTOM_THEME ? CUSTOM_THEME : 'jqueryUI';
$x_showdivheading=1;				// 0 for normal heading, 1 for shrinking heading, 2 for Geneva heading
$x_headcontent='';
$x_errormessage = '';
$x_sitename=' ';
$x_userlogo=0;
if (defined('PASSWORD_CAPTCHA')) {
   $x_pwcaptcha=PASSWORD_CAPTCHA;
   $x_logincount=LOGIN_COUNT;
} else {
   $x_pwcaptcha='';
   $x_logincount=0;
}

if (isset($_GET['O']) && $_GET['O']) {          // Deep linking request
	setcookie('RequestedObject',$_GET['O'],0,'/');   // Use session cookie
	header('Location: ' . IQXGetURL(FALSE));              // Redirect to URL without query string
	exit;
  }

if (isset($_GET['P']) && $_GET['P']) {          // Explicit content page request
    if (preg_match('/^[a-z0-9_]+$/i',$_GET['P'])){  // If designated page is pure alphanumeric (to avoid away-from-site redirects)
    	$_SESSION = array('requestedpage' => $_GET['P']);   // Log out and set requestedpage session variable
		}
	header('Location: ' . IQXGetURL(FALSE));              // Redirect to URL without query string
	exit;
  }

$loggedin=(isset($_SESSION['username'],$_SESSION['userclass'],$_SESSION['authcred'])
        && $_SESSION['username'] && $_SESSION['userclass'] && $_SESSION['authcred']);

if ($loggedin) {
    $x_username=$_SESSION['username'];
    $x_userclass=$_SESSION['userclass'];
    $x_rights=$_SESSION['userrights'];
    if (isset($_SESSION['switches'])) {$x_switches=$_SESSION['switches'];}
    
    if ((trim(strtoupper($x_userclass))=='OWNER')&&(isset($_SESSION['sitename']))){
    	$x_sitename=$_SESSION['sitename'];
     	$x_usertitle='<span class="divtitle">'.$x_username . ', ' . $x_sitename.'</span>';	// title text with offset to allow for image	
		$RemoveChars=array(" ",".",",","/","\",:","'","&","@");							// remove characters which would mess up pathway
		$x_userlogo='css/userlogos/' . str_replace($RemoveChars,'',$x_sitename) . '.png';		// pathway to logo
		try{
		if(!file_exists($x_userlogo)){			// leave out div if no image
			$x_userlogo=0;
			}
		}catch(Exception $e){
			$x_userlogo=0;
			}
    }else{
    	$x_sitename='';
    	$x_username=str_replace("'","",$x_username);
    	$x_usertitle=ucfirst(strtolower($x_userclass)) . ' Portal for ' . $x_username;	// Original line for everyone else
    }
    $x_logoutlink='<span class="logoutlink" onclick="IQXLogout()">logout</span>';
    
    if (isset($_SESSION['changepwd']) && $_SESSION['changepwd']) {
      $x_divcontentfilename='forcechangepassword';
      }
    else {
      $x_divcontentfilename=strtolower($x_userclass) . '_tabs';
      }
    }
elseif (isset($_SESSION['requestedpage']) && $_SESSION['requestedpage']) {
    $x_usertitle='';
    $x_divcontentfilename=$_SESSION['requestedpage'];
    $_SESSION = array();   // Refresh will just go to the login form rather than the requested page, otherwise could get stuck here
    }
else {   // Generate the login form
    $x_usertitle='';
    $x_divcontentfilename='login';
    }
$x_local=IQXLoadIniFile($x_divcontentfilename . '.ini');
IQXSetINIuserclass();
$x_divcontentfilename=IQXNetCustomPath($x_divcontentfilename . '.html');

$TBS = new clsTinyButStrong('','x_');  // Only vars prefixed with x_ are merged for security purposes
if(isset($_REQUEST['PersID']) && $_REQUEST['PersID'] !=''){
$TBS->LoadTemplate(IQXNetCustomPath('NewChangePassword.html'));
}else{
$TBS->LoadTemplate(IQXNetCustomPath('main.html'));
}
$TBS->Show();

?>