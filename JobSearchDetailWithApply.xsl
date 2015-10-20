<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="xml" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<xsl:for-each select="JobSearch/Jobs/Job[substitute_xpath_here]">
			<div class="JobSearchDetail ui-corner-all" >
				<div class="JobSearchDetailDescription">
					<p><xsl:value-of select="description"/></p>
				</div>
				<div class="JobSearchDetailInfo" >
					<xsl:for-each select="*[@exp='1']">
						<xsl:variable name="jobfieldname" select="name()" />
						<p><label><xsl:value-of select="concat(/JobSearch/Captions/Caption[@fieldname=$jobfieldname],':')"/></label><xsl:value-of select="."/></p>
					</xsl:for-each>
					<p><label>Contact:</label><a href="mailto:{contactemail}?subject=Job Ref. {ourref}"><xsl:value-of select="contactname"/></a><span id="LoginStrip{JobId}"><span> , </span><span class="LoginLinks" id="Login{JobId}" onClick="apply('Login')"  >Log in</span><span> , or </span><span class="LoginLinks" id="Register{JobId}" onClick="apply('Register')" >Register</span></span></p>
					<p><button class="fixed" id="Applied{JobId}" onClick="apply('{JobId}')" >A</button></p>
				</div>
				<div class="cleardiv" />
			</div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
