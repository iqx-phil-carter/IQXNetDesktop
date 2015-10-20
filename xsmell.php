<?php

// Load the XML source
$xml = new DOMDocument;
$xml->load($_GET["xml"]);

// Load the stylesheet
$xsl = new DOMDocument;
$xsl->load($_GET["xsl"]);

// Configure the transformer
$proc = new XSLTProcessor;
$proc->importStyleSheet($xsl); // attach the xsl rules
$proc->setParameter('',$_GET); // set the parameters

echo $proc->transformToXML($xml);

// Old way:
// $xmldoc = domxml_open_file($_GET["xml"]); 
// $xsldoc = domxml_xslt_stylesheet_file($_GET["xsl"]); 
// $result =  $xsldoc->process($xmldoc,$_GET); 
// print $xsldoc->result_dump_mem($result); 

// Even older way:
// $xh = xslt_create();
// echo xslt_process($xh, $_GET["xml"], $_GET["xsl"], NULL, NULL, $_GET); 
// xslt_free($xh);

?> 