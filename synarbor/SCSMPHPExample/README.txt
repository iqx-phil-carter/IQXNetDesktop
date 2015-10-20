N.N. This project is for demo purposes only. It will not run on another developers machine without changes being made to Synarbor Systems so please don't try to run it.

Here's a quick definition of the files that are included:

ROOT Folder
serviceTest.php	- This is here to simply test that a connection can be established to the SSO web service and that information can be passed between the two systems. It does not perform any SSO functionality or use any encryption.

login.php - This should be the default page of the website. When the user navigates to it it checks that SSO is being enforced and passes them on to the SSO login page if appropriate. If they are already logged in they will be forwarded on to whichever page is set as the default in the config.php file.

config.php - This file contains the settings and properties used throughout the example site.

encryption.php - This file contains all of the routines relating to encrypting and decrypting the information passed between the example site and the SSO web service.

RESTRICTED Folder
The pages in this folder are only accessible once the user has been authenticated.

appListExample.php - This file contains the code used to get the list of applications that the current user has access to using their SSO account. The example shows how to get and display links in a simple list that the user can click on to go to the relevant application.

iconExample.php - This file gives an example of how to get the markup to display the Dashboard Icon at the top right of the page. It also gets the markup to display the list of applications that the user has access to in a popup window that is displayed when the user clicks on the Dashboard Icon.

SCSM Folder
This folder contains the common SSO files that are used when displaying the Dashboard Icon and popup window.
