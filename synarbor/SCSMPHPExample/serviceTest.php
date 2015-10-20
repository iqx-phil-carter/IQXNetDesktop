<!-- This page is purely here to test that the connection to the SCSM service is working. -->
<html>
	<head>
		<title>PHP Test</title>
	</head>
	<body>
		<?php
			if(!isset($_POST['op'])) {
		?>
		<form id="form1" name="form1" method="post" action="">
		  enter text
		  <input name="data" value="Test" type="text" /><br/><br/>
		  encrypt
		  <input type="hidden" value="op" name="op" />
		  <input type="submit" name="Submit" value="Submit" />
		</form>
		<?php
			}else {
				try{
					$msg = $_POST['data'];
				    
					echo 'starting<br/>';
					$client = new SoapClient('http://portaltest.synarbor.net/CentralDashboard/SCSMService.svc?wsdl');

					$args = array('testMessage' => $msg);
					$response = $client->ServiceTest($args);

					echo 'result: ' . $response->ServiceTestResult;
				}
				catch (Exception $e) {
				       echo 'Caught exception:',  $e->getMessage(), "\n";
				}
			}
		?>
	</body>
</html> 