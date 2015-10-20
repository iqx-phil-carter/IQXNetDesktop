<?php

require_once("IQXNet.conf");
require_once("IQXInc.php");

function Q_DelphiDate($d) {
  $date = new DateTime("30 December 1899 + $d days");
  return $date->format("D d/m/Y");
  }

function Q_GetTagValue($tagid,$tagtype,&$data,$i,$c) {
  //$i will point to first row after the tag
  $res='';
  if ($i < $c) {
    $row=$data[$i];
    if ($row['tagid'] == $tagid) {
      if ($row['rectype']==3) {
        if ($tagtype=="T" || $tagtype=="U") {
          $res=$row['textvalue'];
        } elseif ($tagtype=='D') {
          $res=Q_DelphiDate($row['value']);
        } elseif ($tagtype=='N') {
          $res=$row['value'];
        }
        }
      }
    }
  if ($res != '') {
    $res=" value=\"$res\" ";
    }
  return $res;
  }

function Q_GetChoiceValue($tagid,$choiceid,$tagtype,$subchoices,&$data,$i,$c) {
  //$i will point to first row after the tagchoice
  if ($tagtype=='G') {
    $res=$subchoices . '<option value="" selected="selected" />';  // Fallback if no subchoice selected
    }
  else {
    $res='';
    }
  if ($i < $c) {
    $row=$data[$i];
    if ($row['tagid'] == $tagid && isset($row['tagchoiceid']) && $row['tagchoiceid'] == $choiceid) {
      if ($row['rectype']==3) {
        $val=$row['value'];
        if ($tagtype=='M' && $val>0) {
          $res = ' checked="checked" ';
          }
        elseif ($tagtype=='L' && $choiceid!='*' && $val>0) {
          $res = ' checked="checked" ';
          }
        elseif ($tagtype=='S' || ($tagtype=='L' && $choiceid=='*')) {
          $res = ' value="' . $val . '" ';
          }
        elseif ($tagtype=='G') {
          $res = str_replace("<option value=\"$val\" >","<option value=\"$val\" selected=\"selected\" >",$subchoices);
          }
        }
      }
    }
  return $res;
  }

function Q_GetGOptions($tagid,&$data,&$i,$c) {
  //On entry $i will point to first row after the tag
  //On exit $i will point to first row after the subchoices
  $res='';
  while ($i < $c) {
    $row=$data[$i];
    if ($row['tagid'] != $tagid || $row['rectype'] != 2) {
      break;
      }
    $val=$row['value'];
    $res = $res . "<option value=\"$val\" >" . $row['description'] . "</option>\r\n";
    $i++;
    }
  return $res;
  }

function Q_GetList($tagid,$tagtype,$nameroot,&$data,&$i,$c) {
  //On entry $i will point to first row after the tag
  //On exit $i will point to next tag or past end of data
  $res='';
  $gotval=FALSE;
  $mDefault='';
  if ($tagtype=='G') {
    $subchoices=Q_GetGOptions($tagid,$data,$i,$c);
    }
  else {
    $subchoices='';
    }
  while ($i < $c) {
    $row=$data[$i];
    if ($row['tagid'] != $tagid) {
      break;
      }
    if ($row['rectype']==1) {
      $i++;
      $choiceid=$row['tagchoiceid'];
      $descrip=$row['description'];
      if ($tagtype=='M' && $gotval) {  // Only one choice can be selected for an M type question
        $sel='';
      } else {
        $sel=Q_GetChoiceValue($tagid,$choiceid,$tagtype,$subchoices,$data,$i,$c);
        }
      if ($sel) {
        $gotval=TRUE;
        }
      $name=$nameroot . $choiceid;
      $node='';
      switch ($tagtype) {
        case 'L':
          if ($choiceid=='*') {
            $node="<input type=\"text\" name=\"$name\" class=\"noncheckbox digits \" $sel />";
            }
          else {
            $node="<input type=\"checkbox\" name=\"$name\" class=\"checkbox \" value=\"1\" $sel />";
            }
          break;
        case 'M':
          $node="<input type=\"radio\" name=\"$nameroot\" class=\"checkbox \" value=\"$choiceid\" $sel />";       // class for radio buttons is still checkbox
          if ($choiceid=='_') {
            $mDefault=$node;
            }
          break;
        case 'G':
          $node="<select name=\"$name\" class=\"noncheckbox \" >$sel</select>" ;
          break;
        case 'S':
          $node="<input type=\"text\" name=\"$name\" class=\"noncheckbox number \" $sel />";
          break;
        }
      $res = $res . '<label>' . $descrip . $node . "</label>\r\n";
    } else {
      $i++;
      }
    }
  if ($mDefault && !$gotval) {   // Single Select (tagtype=M), no value set, has a default value (choiceid=_) : Select that default
    $mDefaultReplace=substr($mDefault,0,-2) . ' checked="checked" />';
    $res=str_replace($mDefault,$mDefaultReplace,$res);
    }
  return $res;
  }

function IQXBuildQuestionnaireForm(&$data,$fmt='') {
  $generateTable=QUESTIONNAIRE_AS_TABLE;  // Default from conf file
  if ($fmt=='TABLE') {
     $generateTable=TRUE;
  } elseif ($fmt=='DIV') {
     $generateTable=FALSE;
  } else {
     $generateTable=QUESTIONNAIRE_AS_TABLE;  // Default from conf file
  }
  $res='';
  $thistagtype='';
  $thisdescrip='';
  $thiscontent='';
  $i=0;
  $c=count($data);
  while ($i < $c) {
     $row=$data[$i];
     if ($row['rectype']==0) {
        $thistagid=$row['tagid'];
        $thistagtype=$row['tagtype'];
        $thisdescrip=$row['description'];
        $thislocation=$row['taglocation'];
        $thisnameroot='Q_' . $thistagtype . str_pad($thislocation,3,'_') . str_pad($thistagid,3,'_');
        $thisclass='';
        if (isset($row['required']) && $row['required']) {
          $thisclass .= 'required ';
          }
        $thiscontent='';
        $i++;    // Do it here so that it is correctly positioned for Q_GetTagValue or Q_GetList
        switch ($thistagtype) {
          case 'U':
          case 'T':
          case 'N':
          case 'D':
            if ($thistagtype=='N') {
              $thisclass .= 'number ';
            } elseif ($thistagtype=='D') {
              $thisclass .= 'longdate ';
            } elseif ($thistagtype=='U') {
              $thisclass .= 'uppercase ';
            }
            $thisclass .= 'qsingleentry ';
            $thiscontent="<input type=\"text\" name=\"$thisnameroot\" class=\"$thisclass\" " . Q_GetTagValue($thistagid,$thistagtype,$data,$i,$c) . '/>';
            break;
          case 'M':
          case 'G':
          case 'L':
          case 'S':
            $thisclass .= 'qmultisummary';
//            $thiscontent="<input type=\"text\" readonly=\"readonly\" class=\"$thisclass\"/><button type=\"button\" class=\"qmultidropdown \"/><div class=\"qmultientry\" >" . Q_GetList($thistagid,$thistagtype,$thisnameroot,$data,$i,$c) . '</div>';
            $thiscontent="<input type=\"text\" readonly=\"readonly\" class=\"$thisclass\"/><div class=\"qmultientry\" >" . Q_GetList($thistagid,$thistagtype,$thisnameroot,$data,$i,$c) . '</div>';
            break;
          }
        if ($generateTable) {
          if ($thistagtype=='-') {  //Heading
            $res .= "<tr class=\"qquestrow\"><td class=\"qhead\" colspan=\"2\" >$thisdescrip</td></tr>\r\n";
          } else {
            $res .= "<tr class=\"qquestrow\"><td class=\"qquestion\" >$thisdescrip</td><td class=\"qanswer\" >$thiscontent</td></tr>\r\n";
            }
        } else {
          if ($thistagtype=='-') {  //Heading
            $res .= "<div class=\"qquestrow\"><div class=\"qhead\" >$thisdescrip</div></div>\r\n";
          } else {
            $res .= "<div class=\"qquestrow\"><div class=\"qquestion\" >$thisdescrip</div><div class=\"qanswer\" >$thiscontent</div></div>\r\n";
            }
        }
     } else {
        $i++;
        }
  }
  if ($generateTable) {
    return "<table class=\"questionnaire \">$res</table>";
  } else {
    return "<div class=\"questionnaire \">$res</div>";
  }
  }

function PreparePostVar($s) {
	// Postvars could be arrays (generated by checkboxes or multiselect combos). Implode them to Tab separated strings.
	if (is_array($s)) {
		$s=implode(chr(9),$s);
	}
	// Some characters such as £ are posted as multibyte chars with a hex C2 (=dec 194) in front of them.
	// The culprit is javascript's encodeURIComponent function which is used by jQuery's Ajax post mechanism.
	// This is a partial fix but should cope with all normal UK form data
	return str_replace(chr(194),'',$s);
}

function QuestionnairePackedPost($data) {
   $keys = array_keys($data);
   $arp=array();
   $arq=array();
   $c = count($data);
   for($i = 0; $i < $c; $i++) {
      $k=$keys[$i];
      if (substr($k,0,6)=='dummy_') {   // Do not send
      } elseif (substr($k,0,2)=='Q_') {
        $arq[substr($k,2)]=PreparePostVar($data[$k]);   // Get rid of the Q_ in the new array
      } else {
        $arp[$k]=PreparePostVar($data[$k]);
      }
   }
   if (count($arq)>0) {
     $arp['qanswers']=http_build_query($arq,'','&');
     }
   return $arp;
   }

?>
