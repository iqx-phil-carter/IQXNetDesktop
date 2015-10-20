<?xml version="1.0" encoding="ISO-8859-1"?>
 <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="text"/>
	<xsl:template match="/">
		<xsl:text>[&#xA;</xsl:text>
		<xsl:for-each select="IQXResult/Row">
			<xsl:text>[</xsl:text>
			<xsl:for-each select="*">
				<xsl:value-of select="concat('&quot;', translate(.,'&quot;`\','') , '&quot;')"/>
				<xsl:if test="position() != last()">
					<xsl:value-of select="','"/>
				</xsl:if>
			</xsl:for-each>
			<xsl:if test="position()!=last()">
			     <xsl:text>],&#xA;</xsl:text>
			</xsl:if>
			<xsl:if test="position()=last()">
			     <xsl:text>]&#xA;</xsl:text>
			</xsl:if>
		</xsl:for-each>
	<xsl:text>]</xsl:text>
	</xsl:template>
</xsl:stylesheet>
