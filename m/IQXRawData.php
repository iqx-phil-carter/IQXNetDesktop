<?php
session_start();

require_once("../IQXInc.php");

$nonauthenticated=isset($_REQUEST['noauth']);
if (!($nonauthenticated || isset( $_SESSION['authcred'] ))) {
    echo '<p>You are not logged in. Please refresh your browser, log in, and then try again.</p>';
    }
elseif (!isset( $_REQUEST['page'] )) {
    echo '<p>Page not specified</p>';
    }
else {
    $call=$_REQUEST['page'];
    $doescape=(isset($_REQUEST['escape']) && $_REQUEST['escape']);
    $dobinary=(isset($_REQUEST['binary']) && $_REQUEST['binary']);
    $render=isset($_REQUEST['render']) ? $_REQUEST['render'] : '';
    $calltype='P';     // P=DB Procedure (default)  S=service  J=job
    if (substr($call,1,1)=='_'){
       $calltype=strtoupper(substr($call,0,1));
       $call=substr($call,2);
       }
    switch ($calltype) {
       case 'P':
        $urlroot='IQXCallResult';
        break;
       case 'S':
        $urlroot='IQXService';
        break;
       case 'J':
        $urlroot='IQXJob';
        break;
       case 'L':  // Literal local file
        $urlroot='.';
        break;
       default:
        $urlroot='';
       }
    if ($urlroot) {
       if ($nonauthenticated && $urlroot!='.') {
           $urlroot .= '_';
           }
      $callargs=array();
      foreach ($_GET as $key => $value){
        if ($key != 'page' && $key != 'escape' && $key != 'binary' && $key != 'render' && $key != 'PHPSESSID' && $key != 'DBGSESSID' ) {
          $callargs[$key]=$value;
          }
        }
      foreach ($_POST as $key => $value){
        if ($key != 'page' && $key != 'escape' && $key != 'binary' && $key != 'render' && $key != 'PHPSESSID' && $key != 'DBGSESSID' ) {
          $callargs[$key]=$value;
          }
        }
      $err='';
      $data=IQXNetRetrieve($urlroot . '/' . $call,$callargs,$err,FALSE,$dobinary,$render);
      if ($err) {
        echo 'Error: ' . $err;
        }
      elseif ($doescape) {
        echo htmlspecialchars($data);
        }
      else {
        echo $data;
        }
      }
    else {
      echo'<p>Invalid page requested</p>';
      }
    }

?>