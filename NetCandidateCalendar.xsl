<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="text"/>
	<xsl:template match="/">
		<xsl:text>[</xsl:text>
		<xsl:for-each select="IQXResult/Row">
			<xsl:text>&#xA;{</xsl:text>
			
			<xsl:text>&quot;title&quot;:</xsl:text>			
			<xsl:value-of select="concat('&quot;', translate(title,'&quot;\','') , '&quot;')"/>			
			
			<xsl:text>,&quot;id&quot;:</xsl:text>			
			<xsl:value-of select="concat('&quot;', translate(id,'&quot;\','') , '&quot;')"/>			

			<xsl:text>,&quot;start&quot;:</xsl:text>			
			<xsl:value-of select="concat('&quot;', translate(shiftStart,'&quot;\','') , '&quot;')"/>			

			<xsl:text>,&quot;end&quot;:</xsl:text>			
			<xsl:value-of select="concat('&quot;', translate(shiftEnd,'&quot;\','') , '&quot;')"/>			

			<xsl:text>,&quot;description&quot;:</xsl:text>			
			<xsl:value-of select="concat('&quot;', translate(description,'&quot;\','') , '&quot;')"/>			

			<xsl:text>,&quot;className&quot;:</xsl:text>			
			<xsl:value-of select="concat('&quot;', translate(className,'&quot;\','') , '&quot;')"/>			

			<xsl:text>,&quot;allDay&quot;:</xsl:text>			
			<xsl:value-of select="allDay"/>			
			
			<xsl:text>,&quot;editable&quot;:</xsl:text>			
			<xsl:value-of select="editable"/>			
			
			<xsl:text>,&quot;deletable&quot;:</xsl:text>			
			<xsl:value-of select="deletable"/>			
			
			<xsl:text>,&quot;confirmable&quot;:</xsl:text>			
			<xsl:value-of select="confirmable"/>			
			
			<xsl:text>,&quot;unconfirmable&quot;:</xsl:text>			
			<xsl:value-of select="unconfirmable"/>			
			
			<xsl:text>}</xsl:text>
			<xsl:if test="position()!=last()">
			     <xsl:text>,</xsl:text>
			</xsl:if>
		</xsl:for-each>
		<xsl:text>&#xA;]</xsl:text>
	</xsl:template>
</xsl:stylesheet>
