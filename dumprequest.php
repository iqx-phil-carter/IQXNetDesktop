<?php
session_start();

require_once("IQXInc.php");

      foreach ($_REQUEST as $key => $value){
          echo "$key = $value <br/>";
        }

?>