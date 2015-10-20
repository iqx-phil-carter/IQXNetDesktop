var keyPress = "";

function cancelEnter(e)
{
	var keyNum = 0;
	
	if(window.event) // IE
	{
		keyNum = e.keyCode;
	}
	else
	{
		keynum = e.which;
	}

	if(keyNum == 13)
	{
		// Stop the key press from bubbling up
		if (e.stopPropagation) 
		{
			e.stopPropagation();
			e.cancelBubble = true;
		}
		else
		{
			// IE
			e.cancelBubble = true;
		}

		e.returnValue=false;
		e.cancel = true;		
	}
	
	return false;
}

function ShowDashboard(backgroundName, tbLinksName, divLinksName, divCloseName, showCtrls)
{
	var backgroundCtrl = document.getElementById(backgroundName);
	var tbLinksCtrl = document.getElementById(tbLinksName);
	var divLinksCtrl = document.getElementById(divLinksName);
	var divCloseCtrl = document.getElementById(divCloseName);
	var display = "";
	var notIE = true;
	
	if (document.all) 
	{
		notIE = false;
	}
	
	if (!showCtrls)
	{
		display = "none";
	}
		
	if (tbLinksCtrl != null)
	{
		tbLinksCtrl.style.display = display;
	}
	
	if (backgroundCtrl != null)
	{
		backgroundCtrl.style.display = display
	}
	
	if (showCtrls)
	{
		// See if need to change the display features of the close button
		if (divLinksCtrl.scrollHeight > divLinksCtrl.clientHeight)
		{
			// Change the class on the close link so it's displayed at the bottom of the list
			divCloseCtrl.attributes["class"].value = "dashboardRelativeClose";
			
			// Move the scrollbar back to the top
			divLinksCtrl.scrollTop = 0;
		}
		else
		{
			// Make sure the close link is displayed at the bottom of the div
			divCloseCtrl.attributes["class"].value = "dashboardFixedClose";
		}
		
		// Store any keypress info so we can restore it once the dashboard popup is closed
		if ((notIE) && (document.forms[0] != null) && (document.forms[0].attributes["onkeypress"] != null))
		{
			keyPress = document.forms[0].attributes["onkeypress"].value;
			document.forms[0].attributes["onkeypress"].value = "";
		}
		tbLinksCtrl.focus();
	}
	else
	{
		if ((notIE) && (document.forms[0] != null) && (document.forms[0].attributes["onkeypress"] != null))
		{
			document.forms[0].attributes["onkeypress"].value = keyPress;
		}
	}
}


function ShowFramesDashboard(parentContainer, mainFrameName, backgroundName, tbLinksName, divLinksName, divCloseName, showCtrls)
{
	var pageFrames = parentContainer.frames;
	var display = "";
	var notIE = true;
	
	if (document.all) 
	{
		notIE = false;
	}
	
	if (!showCtrls)
	{
		display = "none";
	}
		
	for (var i = 0; i < pageFrames.length; i++)
	{
		var backgroundCtrl = pageFrames[i].document.getElementById(backgroundName);
		
		if (backgroundCtrl != null)
		{
			// Show/hide the modal background div
			backgroundCtrl.style.display = display
		}
		
		if ((pageFrames[i].frames.length > 0) && (pageFrames[i].frames[0].name != ""))
		{
			// This page contains more sub frames so process them
			ShowFramesDashboard(pageFrames[i], mainFrameName, backgroundName, tbLinksName, divLinksName, divCloseName, showCtrls)
		}
		else
		{
			if (pageFrames[i].name == mainFrameName)
			{
				// This is the frame that contains the popup dialog
				var tbLinksCtrl = pageFrames[i].document.getElementById(tbLinksName);
				var divLinksCtrl = pageFrames[i].document.getElementById(divLinksName);
				var divCloseCtrl = pageFrames[i].document.getElementById(divCloseName);

				if (tbLinksCtrl != null)
				{
					tbLinksCtrl.style.display = display;
				}
				
				if (showCtrls)
				{
					// See if need to change the display features of the close button		
					if (divLinksCtrl.scrollHeight > divLinksCtrl.clientHeight)
					{
						// Change the class on the close link so it's displayed at the bottom of the list
						divCloseCtrl.attributes["class"].value = "dashboardRelativeClose";
						
						// Move the scrollbar back to the top
						divLinksCtrl.scrollTop = 0;
					}
					else
					{
						// Make sure the close link is displayed at the bottom of the div
						divCloseCtrl.attributes["class"].value = "dashboardFixedClose";
					}
					
					// Store any keypress info so we can restore it once the dashboard popup is closed
					if ((notIE) && (document.forms[0] != null) && (document.forms[0].attributes["onkeypress"] != null))
					{
						keyPress = document.forms[0].attributes["onkeypress"].value;
						document.forms[0].attributes["onkeypress"].value = "";
					}
					tbLinksCtrl.focus();
				}
				else
				{
					if ((notIE) && (document.forms[0] != null) && (document.forms[0].attributes["onkeypress"] != null))
					{
						document.forms[0].attributes["onkeypress"].value = keyPress;
					}
				}
			}
		}
	}
}

