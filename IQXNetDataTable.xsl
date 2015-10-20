<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="text"/>
	<xsl:template match="/">
		<xsl:text>{&#xA;</xsl:text>
		<xsl:for-each select="IQXResult/Row">
			<xsl:if test="position()=1">
	            <xsl:text>&quot;aoColumns&quot;: [&#xA;</xsl:text>
				<xsl:for-each select="*">
					<xsl:value-of select="concat('{&quot;sTitle&quot;: &quot;',name(),'&quot;}')"/>
					<xsl:if test="position() != last()">
						<xsl:value-of select="','"/>
					</xsl:if>
					<xsl:text>&#xA;</xsl:text>
				</xsl:for-each>
				<xsl:text>],&#xA;&quot;aaData&quot;: [&#xA;</xsl:text>
			</xsl:if>
			<xsl:text>[</xsl:text>
			<xsl:for-each select="*">
				<xsl:value-of select="concat('&quot;', translate(.,'&quot;\','') , '&quot;')"/>
				<xsl:if test="position() != last()">
					<xsl:value-of select="','"/>
				</xsl:if>
			</xsl:for-each>
			<xsl:if test="position()!=last()">
			     <xsl:text>],&#xA;</xsl:text>
			</xsl:if>
			<xsl:if test="position()=last()">
			     <xsl:text>]&#xA;]</xsl:text>
			</xsl:if>
		</xsl:for-each>
	<xsl:text>&#xA;}</xsl:text>
	</xsl:template>
</xsl:stylesheet>
