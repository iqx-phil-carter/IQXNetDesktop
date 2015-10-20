
 <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="rss"/>
	<xsl:template match="/">
		<xsl:text>&#60;rss version="2.0"&#62;</xsl:text>
		<xsl:text>&#60;channel&#62;</xsl:text>
		<xsl:for-each select="IQXResult/row">
			<xsl:if test="position()=1">
				<xsl:text></xsl:text>
					<xsl:value-of select="StreamName"/>
					<xsl:value-of select="StreamLink"/>
					<xsl:value-of select="StreamDescription"/>
					<xsl:value-of select="StreamPubDate"/>
					<xsl:value-of select="StreamAuthor"/>
				
			</xsl:if>
			<xsl:if test="position()!=1">
				<xsl:text>&#60;item&#62;</xsl:text>
					<xsl:value-of select="ItemTitle"/>
					<xsl:value-of select="ItemLink"/>
					<xsl:value-of select="ItemDescription"/>
					<xsl:value-of select="ItemPubDate"/>
					<xsl:value-of select="ItemAuthor"/>
				<xsl:text>&#60;&#92;item&#62;</xsl:text>
			</xsl:if>
		</xsl:for-each>
		<xsl:text>&#60;&#92;channel&#62;</xsl:text>
		<xsl:text>&#60;&#92;rss&#62;</xsl:text>
	</xsl:template>
</xsl:stylesheet>
