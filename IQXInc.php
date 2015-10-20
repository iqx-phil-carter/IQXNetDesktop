<?php

require_once("IQXNet.conf");
require_once("IQXQuestionnaire.php");
define("VARNOTSET",'_!var_not_set!_');

@date_default_timezone_set(@date_default_timezone_get()); // Date constructors can give errors if default timezone not explicitly set, even though it is known to the system

$x_global=IQXLoadIniFile('global.ini');
	
function IQXNetRetrieve($service,$postdata,&$err,$postdataIsFilename=FALSE,$binaryRequest=FALSE,$render='') {
    $err=false;
    if (is_array($postdata) && !$postdataIsFilename) {
      $postdata=http_build_query(QuestionnairePackedPost($postdata),'','&');
      }
	$literalFile=(substr($service,0,2)=='./')?true:false;
	if ($literalFile){
		$url = substr($service,2);
	    $context = NULL;
	}else{
	    $options = array( 'http' => array(
	        'user_agent'    => 'IQXNetPHP',    // who am i
	        'max_redirects' => 10,          // stop after 10 redirects
	        'timeout'       => 5         // timeout on response
	    ) );
	    $sheaders='';
	    if (isset($_SESSION['authcred'])) {
	       $sheaders .= 'Authorization: Basic ' . base64_encode($_SESSION['authcred']) . "\r\n";
	       }
	    if ($postdataIsFilename) {
	       $sheaders .= 'Content-Type: application/octet-stream' . "\r\n";
	       }
	    $options['http']['header']=$sheaders;
	    if ($postdataIsFilename) {
	      $options['http']['content']=@file_get_contents($postdata);
	      }
	    elseif ($postdata) {
	      $options['http']['content']=$postdata;
	      }
	    $context = stream_context_create( $options );
	    $url     = IQXNET_URL . $service;
	}
	$page    = @file_get_contents( $url, false, $context );
    if ($page) {
      if ($binaryRequest) {
      	if (!$literalFile){
        	header(IQXResponseHeader($http_response_header,'Content-Type')); // Pass through the Content-Type header
        	header(IQXResponseHeader($http_response_header,'Content-Disposition')); // Pass through the Content-Disposition header (gives it a useable filename)
        }
		echo $page;  // Serve the data
        exit;    // Terminate script right here
      } elseif ($render) {
        IQXNetRender($page,$render);
        exit; // Terminate script right here
      } else {
        return $page;
        }
      }
    else {
      if ($literalFile){
      	$err='Unable to retrieve data';
      } else {
        $err=IQXResponseCode($http_response_header);
	  }
      return false;
      }
   }

function buildXpath(&$xpath,&$xpathSep,$key,$val){
if ($val == '$IGNORE$' || $val == ''){
	return;
}	
if ($val == '$NONE$'){
	$crit='not(' . $key . ')';
} else {
	$crit=$key . '=\'' . $val . '\'';
}
$xpath=$xpath . $xpathSep . $crit;
$xpathSep=' and ';
}

function IQXNetRender(&$data,$renderInstructions) {
   $renderAr=explode('_',$renderInstructions . '____');
   if ($renderAr[0]=='') $renderAr[0]='text';
   if ($renderAr[1]=='') $renderAr[1]='xml';
   header('Content-Type: ' . $renderAr[0] . '/' . $renderAr[1]);
   if ($renderAr[2]) {    // Filename
      header('Content-Disposition: attachment; filename="' . $renderAr[2] . '"');
      }
   if ($renderAr[3]) {  // XSLT stylesheet
      // Put together a dynamic xpath if there are any xpath_ request parameters
	  $xpath='';
	  $xpathSep='';
	  foreach ($_REQUEST as $key => $value) {
	  	if (substr($key,0,6)=='xpath_') {
	  		$key=substr($key,6);
	  		if (is_array($value)){
	  			foreach ($value as $subkey => $subValue) {
	  				buildXpath($xpath,$xpathSep,$key,$subValue);
				}
	  		} else {
	  			buildXpath($xpath,$xpathSep,$key,$value);
			}
	  		}
      	}
	  if ($xpath) {
	  	$xpath='[' . $xpath . ']';
	  }
      // Load the XML source
      $xml = new DOMDocument;
      $xml->loadXML($data);
      // Load the stylesheet
	  $xslText=@file_get_contents(IQXNetCustomPath($renderAr[3]));
	  $xslText=str_replace('[substitute_xpath_here]',$xpath,$xslText);
      $xsl = new DOMDocument;
      $xsl->loadXML($xslText);
      // Configure the transformer
      $proc = new XSLTProcessor;
      $proc->importStyleSheet($xsl); // attach the xsl rules
      echo $proc->transformToXML($xml);
   } else {
     echo $data;
     }
   }

function SimpleXMLtoArray($ob) {
   $res = array();
   $ar = get_object_vars($ob);
   $keys = array_keys($ar);
   $c = count($ar);
   for($i = 0; $i < $c; $i++) {
      if (substr($keys[$i],0,5)=='JSON_') {
        $res[substr($keys[$i],5)]= json_decode((string) $ar[$keys[$i]],true);
      } else {
        $res[$keys[$i]]= (string) $ar[$keys[$i]];
      }
      }
   return $res;
   }

function IQXNetRetrieveDataArray($service,$postdata,&$err,$cleanarray=FALSE) {
   $err=false;
   $rawdata=IQXNetRetrieve($service,$postdata,$err);
   $res=array();  // Fallback result
   if ($rawdata) {
      $xmlData=new SimpleXMLElement($rawdata);
      if($xmlData["success"] == 1)
         {
         $c = count($xmlData->Row);
         for($i = 0; $i < $c; $i++)
            {// FOREACH in simplexml apparently has a memory leak in php <= 5.2.5 so use FOR to avoid
            if ($cleanarray) // Will result in an array of arrays, instead of an array of SimpleXMLElements
               {
               $res[] = SimpleXMLtoArray($xmlData->Row[$i]);
               }
            else {
               $res[] = $xmlData->Row[$i];
               }
            }
         }
      else {
         $xmlerr=(string) $xmlData->IQXFailure["message"];
         if ($xmlerr) {
            $err=$xmlerr;
            }
         }
       }
   return $res;
   }
   
function IQXNetRetrieveDataString($call,&$err,$nonauthenticated=FALSE) {
   $err=false;
   $res='';
   $service='IQXCallResult';
   if ($nonauthenticated) {
      $service .= '_';
      }
   $ar=array();
   if (preg_match('/^questions(_table|_div)?\?(.*)$/i',$call,$ar)) {
      $fmt=strtoupper(substr($ar[1],1));  // TABLE, DIV or empty string
      $call=IQXNetAssembleURL('NetQuestionnaire?' . $ar[2]);
	  if (!$call){return '';}  // IQXNetAssembleURL can return an empty string if showblock or hide block indicate that the block must be suppressed
      $data=IQXNetRetrieveDataArray($service . '/' . $call,'',$err,TRUE);
      if ($data) {
         $res=IQXBuildQuestionnaireForm($data,$fmt);
         }
      }
   return $res;
   }

function IQXNetAddToHead($line,&$head) {
   if (stripos($head,$line)===false) {
      $head=$head . $line . "\r\n";
      }
   }

function IQXNetAddScriptToHead($script,&$head) {
   IQXNetAddToHead('<script type="text/javascript" src="' . $script . '" ></script>',$head);
   }

function IQXNetAddStyleSheetToHead($stylesheet,&$head) {
   IQXNetAddToHead('<link rel="stylesheet" href="' . $stylesheet . '" type="text/css" />',$head);
   }

function IQXFieldList($html,$block){
$flds=array();       // Given a piece of html and a TBS block name, returns a comma separated list of the fields used
do {
  $ar=array();
  if (preg_match('/\[' . $block . '\.([^];]*)[];]/i',$html,$ar)) {
    $fld=strtolower($ar[1]);
    if (!in_array($fld,$flds)) {
      $flds[]=$fld;
      }
    $html=substr($html,stripos($html,$ar[0])+2);
    }
  else {
    return implode(',',$flds);
    }
} while (1);
}

function IQXNetAssembleURL($raw){
if (!$raw) {
  return $raw;
  }
$ar1=explode('?',$raw);
if (count($ar1)<2) {
  return $raw;
  }
$ar2=explode('&',$ar1[1]);
$urlvars=array();
foreach ($ar2 as $onevar) {
  $ar3=explode('=',$onevar);
  $varname=$ar3[0];
  $varval=VARNOTSET;
  if (count($ar3)>1) {                      // If the tplvars supplied param has an = it will be set to that value (even if empty string)
    $varval=urldecode($ar3[1]);
	$varval=IQXDottedVar($varval);
  } elseif (isset($_REQUEST[$varname])){    // If no = then it will be set to the value of the request param of same name if there is one
    $varval=$_REQUEST[$varname];
  }                                         // If no = and the request param does not exist the param will NOT be sent
  if(substr($varname,0,9)=='hideblock'){    // Additional chars can follow 'hideblock' to allow selective control of blocks by caller
    if(trim($varval)!=='' && $varval!=VARNOTSET){
		return '';                          // If set to any value other than empty string the block is suppressed
	}
    $varval=VARNOTSET;                  	// Do not pass on
  }
  if(substr($varname,0,9)=='showblock'){    // Additional chars can follow 'showblock' to allow selective control of blocks by caller
    if(trim($varval)==='' || $varval==VARNOTSET){
		return '';   						// If NOT set to a value other than empty string the block is suppressed
	}
    $varval=VARNOTSET;                  	// Do not pass on
  }
  if($varval!=VARNOTSET){
	$urlvars[$varname]=$varval;	
  }
  }
return $ar1[0] . '?' . http_build_query($urlvars,'','&');
}

function IQXDebug($data){
if (IQXDEBUG) {
  if (is_array($data)){
    print_r($data);
    }
  else {
    print(htmlspecialchars( $data ));
    }
  }
}

function IQXResponseCode($ar){
if (is_array($ar) && (count($ar)>0)){
  $ar1=explode(' ',$ar[0]);
  return 'HTTP Status ' . $ar1[1];
  }
return '';
}

function IQXResponseHeader($ar,$header){
if (is_array($ar) && (count($ar)>0)){
  foreach ($ar as $oneheader) {
    $ar1=explode(':',$oneheader);
    if ($ar1 && count($ar1)>1 && $ar1[0]==$header) {
      return $oneheader;
      }
    }
  }
return '';
}

function IQXNetBuildRightsArray($rights) {
$res=array();
$allowed=explode(',',strtoupper($rights));
foreach ($allowed as $val) {
  $res[$val]=TRUE;
  }
return $res;
}

function IQXGetURL($includeQueryString=TRUE) {
$res = 'http';
$IsHTTPS=FALSE;
if($_SERVER['HTTPS']=='on'){
	$res .=  's';
	$IsHTTPS=TRUE;
	}
$res .=  '://' . $_SERVER['SERVER_NAME'];
if(($IsHTTPS && $_SERVER['SERVER_PORT']!='443') || ((!$IsHTTPS) && $_SERVER['SERVER_PORT']!='80')) {
	$res .= ':' . $_SERVER['SERVER_PORT'];
	}
$res .= $_SERVER['SCRIPT_NAME'];
if($includeQueryString && $_SERVER['QUERY_STRING']>' '){
	$res .=  '?' . $_SERVER['QUERY_STRING'];
	}
return $res;
}

function IQXGetRemoteDetails(){
	
	$IPString='';
	if($_SERVER['HTTP_CLIENT_IP'] != NULL){
		$IPString = $IPString . 'Client IP ' . $_SERVER['HTTP_CLIENT_IP'];
	}
	if($_SERVER['HTTP_X_FORWARDED_FOR'] != NULL){
		$IPString = $IPString . ' X Forwarded for ' . $_SERVER['HTTP_X_FORWARDED_FOR'] ;
	}
	if($_SERVER['HTTP_X_FORWARDED'] != NULL){
		$IPString = $IPString . ' X Forwarded ' . $_SERVER['HTTP_X_FORWARDED'];
	}
    if($_SERVER['HTTP_FORWARDED_FOR'] != NULL){
    	$IPString = $IPString . ' Forwarded for ' . $_SERVER['HTTP_FORWARDED_FOR'];
	}
    if($_SERVER['HTTP_FORWARDED'] != NULL){
    	$IPString = $IPString . ' Forwarded ' . $_SERVER['HTTP_FORWARDED'];
	}
	if($_SERVER['REMOTE_ADDR'] != NULL){
		$IPString = $IPString . ' Remote addr ' . $_SERVER['REMOTE_ADDR'];
	}
	if($_SERVER['REMOTE_HOST'] != NULL){
		$IPString = $IPString . ' Remote host ' . $_SERVER['REMOTE_HOST'];
	}
	if($_SERVER['REMOTE_USER'] != NULL){
		$IPString = $IPString . ' Remote user ' . $_SERVER['REMOTE_USER'];
	}
	if($_SERVER['REDIRECT_REMOTE_USER'] != NULL){
		$IPString = $IPString . ' Redirect Remote user ' . $_SERVER['REDIRECT_REMOTE_USER'];
	}
	return $IPString;
}

function IQXGenerateComboData($reportParams) {
   $rv='';
   $comma='';
   if (preg_match_all('/__[KkXx]([^,]+)/',$reportParams,$out)) {
      foreach($out[1] as $id) {
        $data=IQXNetRetrieveDataArray('IQXCallResult/NetReportCombo_' . $id,'',$err,TRUE);
        foreach($data as $row){
          $descrip=preg_replace('/["\']/','',$row['Description']);    // Lose all quotes from description to avoid parsing trouble
          $val=$row['Value'];
          $rv.=$comma . '{"id":"' . $id . '","descrip":"' . $descrip . '","value":"' . $val . '"}';
          $comma=',';
          }
        }
      }
   return $rv;
}

function IQXNetCustomPath($path) {
    if (CUSTOM_FOLDER != '' && file_exists(CUSTOM_FOLDER . $path)) {
    	$path=CUSTOM_FOLDER . $path; }
	return $path;
}

function IQXDottedVar($svar){
$svar=trim($svar);
if(substr($svar,0,3)!='$x_'){return $svar;}
$svar=substr($svar,1);  // Lose the $
$iSemi=strpos($svar,';');  // Default value can be placed after ;
if($iSemi!==FALSE){
	$sdefault=substr($svar,$iSemi+1);
	$svar=substr($svar,0,$iSemi);
} else {
	$sdefault='';
}
$ar=explode('.',$svar);
$c=count($ar);
if($c==0){
	return IQXDottedVar($sdefault);
}
$var=$GLOBALS;
for($i = 0; $i < $c; $i++) {
	if(!isset($var[$ar[$i]])) {
		return IQXDottedVar($sdefault);
	}
	$var=$var[$ar[$i]];
	}
$svar=(string) $var; 
if($svar==='') {   // NB Includes FALSE and NULL
	$svar=$sdefault;
} 
return IQXDottedVar($svar);
}

function IQXLoadIniFile($filename) {
    $filename = IQXNetCustomPath($filename);
    if (file_exists($filename)) {
	return parse_ini_file($filename,TRUE);
    } else {
	return FALSE;
    }
}

function IQXSetINIuserclass() {
   // If global and local ini structures contain an array matching the logged userclass (client, candidate etc), copy that to an array named userclass
   global $x_userclass, $x_global, $x_local;
   if(isset($x_userclass) && $x_userclass){
		$x=strtolower($x_userclass);
		if(isset($x_local[$x])){$x_local['userclass']=$x_local[$x];}
		if(isset($x_global[$x])){$x_global['userclass']=$x_global[$x];}
   }
}

function IQXMergeTBSBlocks() {
	global $TBS, $nonauthenticated, $x_errormessage, $x_local;
    $err=false;
    foreach ($TBS->TplVars as $key => $value) {
	  if(isset($x_local['tplvars'][$key])){   // Can override a block definition in the tplvars section of the local ini
	    $override=IQXDottedVar('$x_local.tplvars.' . $key);   // Using IQXDottedVar to decode it allows for fallback defaults, $ indirection etc
	    if($override!==''){
		  $iQues1=strpos($override,'?');
		  $iQues2=strpos($value,'?');
		  if($iQues1!==FALSE || $iQues2===FALSE) { // Override contains question mark or orig does not so override the entire value
			$value=$override;	
		  } else {   // Just override the document name retaining the original params
			$value=$override . substr($value,$iQues2);
		  }
	    }
	  }
      $call=$value;
      $calltype='P';     // P=DB Procedure (default)  S=service  J=job  F=PHP Function
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
		$call=IQXNetAssembleURL($call);
		if($call){
		  $data=IQXNetRetrieveDataArray($urlroot . '/' . $call,$_POST,$err,TRUE);
          if ($err) {
            $x_errormessage=$err;
            }
		} else {
		  $data=array(); // IQXNetAssembleURL can return an empty string if showblock or hide block indicate that the block must be suppressed
		}
        $TBS->MergeBlock($key, $data);
        }
      elseif ($calltype=='F') {
        $data=IQXNetRetrieveDataString($call,$err,$nonauthenticated);  // Get string of data from PHP function
        if ($err) {
          $x_errormessage=$err;
          }
        $TBS->MergeBlock($key, 'text', $data);
        }
      }
}

?>