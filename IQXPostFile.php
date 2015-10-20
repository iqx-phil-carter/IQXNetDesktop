<?php
session_start();

require_once("IQXNet.conf");
require_once("IQXInc.php");

if (!isset( $_SESSION['authcred'] )) {
    print('You are not logged in. Please refresh your browser, log in, and then try again.');
    exit;
    }

if (!$_FILES) {
    print('No file selected.');
    exit;
    }

if (count($_FILES)>1) {
    print('Only one file can be posted.');
    exit;
    }

$arkeys=array_keys($_FILES);
$fileid=$arkeys[0];
$origfilename=$_FILES[$fileid]['name'];
$filename=$_FILES[$fileid]['tmp_name'];
$filesize=$_FILES[$fileid]['size'];
$fileerror=$_FILES[$fileid]['error'];

if ($filesize>MAX_UPLOAD_SIZE || $fileerror==1 || $fileerror==2) {  // MAX_UPLOAD_SIZE is in IQXNet.conf, 1 means exceeds php.ini upload_max_filesize, 2 means exceeds MAX_FILE_SIZE post var
    print("File too large.");
    exit;
    }

if ($fileerror) {
    print("Upload error $fileerror.");
    exit;
    }

$argsarray=array();
foreach ($_GET as $key => $value) {
   $argsarray[$key]=$value;
   }
foreach ($_POST as $key => $value) {
   if (strcasecmp($key,'MAX_FILE_SIZE')!=0) {
      $argsarray[$key]=$value;
      }
   }
$argsarray['OrigFileName']=$origfilename;
$args='?' . http_build_query($argsarray,'','&');

$call='IQXService/FileUpload' . $args;

$err='';
$res = IQXNetRetrieve($call,$filename,$err,TRUE);
if ($res) {
    $xmlData = new SimpleXMLElement($res);
    if($xmlData["success"] == 1) {
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
if (!$err) {
    $err='Posting error';
    }

print($err);

?>