<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="text"/>
	<xsl:template match="/">
		<xsl:text>[</xsl:text>
		<xsl:for-each select="IQXResult/Row">
			<xsl:text>&#xA;{</xsl:text>
			
			<xsl:text>&quot;title&quot;:</xsl:text>			
			<xsl:value-of select="concat('&quot;', translate(title,'&quot;\','') , '&quot;')"/>			
			
			<xsl:text>,&quot;role&quot;:</xsl:text>			
			<xsl:value-of select="concat('&quot;', role , '&quot;')"/>			

			<xsl:if test="role='U'">
				<xsl:text>,&quot;className&quot;:&quot;calendarUnfilled&quot;</xsl:text>			
			</xsl:if>
			
			<xsl:text>,&quot;start&quot;:</xsl:text>			
			<xsl:value-of select="concat('&quot;', translate(shiftdate,'&quot;\','') , '&quot;')"/>			

			<xsl:text>,&quot;tooltip&quot;:</xsl:text>			
			<xsl:value-of select="tipArray"/>
			
			<xsl:text>}</xsl:text>
			<xsl:if test="position()!=last()">
			     <xsl:text>,</xsl:text>
			</xsl:if>
		</xsl:for-each>
		<xsl:text>&#xA;]</xsl:text>
	</xsl:template>
</xsl:stylesheet>
