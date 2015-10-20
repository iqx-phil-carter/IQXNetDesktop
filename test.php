<?php
	require_once("IQXInc.php");
	require_once("IQXQuestionnaire.php");
	
	
	$res='';
	$err=false;
    $data=IQXNetRetrieveDataArray('./test.xml','',$err,TRUE);
	if ($data){
		try 
		{
    	$res=IQXBuildQuestionnaireForm($data,'TABLE');
		}
		catch(Exception $e)
  		{
  		$res='Caught exception: ' . $e->getMessage() . ' File: '. $e->getFile(). ' Line: ' . $e->getLine();
  		}
	} else {
		$res='No data';	
	}
	echo $res;
?>
