<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="xml" />
	<xsl:template match="/">
		<root>
			<xsl:apply-templates/>
		</root>
	</xsl:template>
	<xsl:template match="Row">
		<item parent_id="0">
			<xsl:attribute name="id"><xsl:value-of select="ObjectID" /></xsl:attribute>
			<xsl:if test="IsLeaf = 0">
				<xsl:attribute name="state">closed</xsl:attribute>
			</xsl:if>
			<content>
				<name><xsl:value-of select="ObjectName" /></name>
			</content>
		</item>
	</xsl:template>
</xsl:stylesheet>
