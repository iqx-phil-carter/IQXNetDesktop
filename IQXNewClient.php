<?php
session_start();

require_once("IQXInc.php");

if (!isset($_GET['proc'])) {
  print('Missing post procedure');
  exit;
}

if (!isset($_POST['puserclass'],$_POST['pemail'],$_POST['pforenames'],$_POST['psurname'])) {
  print('Insufficient data');
  exit;
  }


$err='';
$userid='';

$temparr=array('puserclass'=>'x');
$candpost=array_diff_key($_POST,$temparr);  // Get rid of unwanted items

$checkok=FALSE;
$call='IQXCall_/' . $_GET['proc'] . 'PreCheck';   // PreCheck procedure allows for duplicate detection etc. Must also reject any data that would subsequently trigger errors in proc.
$res = IQXNetRetrieve($call,$candpost,$err);
echo $err;
if ($res) {
    $xmlData = new SimpleXMLElement($res);
    if($xmlData["success"] == 1) {
        $checkok=TRUE;
        }
    else {
        $xmlerr=(string) $xmlData->IQXFailure["message"];
        if ($xmlerr) {
            $err=$xmlerr;
            }
        }
    }

if ($checkok) {
          
  $temparr=explode(' ', $_POST['pforenames'], 2); // Put first forename in $temparr[0]
  $username=$temparr[0] . ' ' . $_POST['psurname'];
  $regpost=array('userclass'=>$_POST['puserclass'],'name'=>$username,'emailaddress'=>$_POST['pemail']);
  $res = IQXNetRetrieve('IQXRegister_',$regpost,$err);
  echo $err;
  if ($res) {
      $xmlData = new SimpleXMLElement($res);
      if($xmlData["success"] == 1) {
          $userid=(string) $xmlData->UserID;
          $userrights=(string) $xmlData->UserRights;
          if (isset($xmlData->Switches)) {$switches=(string) $xmlData->Switches;} else {$switches='';}
          }
      else {
          $xmlerr=(string) $xmlData->IQXFailure["message"];
          if ($xmlerr) {
              $err=$xmlerr;
              }
          }
      }
  }

          print('Ok');
          exit;
          
if ($userid) {
  $call='IQXCall_/' . $_GET['proc'];
  $candpost['pNewWebUserID']=$userid;
  $res = IQXNetRetrieve($call,$candpost,$err);
  if ($res) {
      $xmlData = new SimpleXMLElement($res);
      if($xmlData["success"] == 1) {
          $_SESSION['authcred']=$_POST['pusername'] . ':' . $_POST['ppassword'];  // Session is now logged in as new user
          $_SESSION['username']=$username;
          $_SESSION['userclass']=$_POST['puserclass'];
          $_SESSION['userrights']=IQXNetBuildRightsArray($userrights);
          $_SESSION['switches']=IQXNetBuildRightsArray($switches);
          $_SESSION['changepwd']=FALSE;
          print('Ok');
          exit;
          }
      else {
          $xmlerr=(string) $xmlData->IQXFailure["message"];
          if ($xmlerr) {
              $err=$xmlerr;
              }
          }
      }
  }

if (!$err) {
    $err='Posting error';
    }

print($err);

?>