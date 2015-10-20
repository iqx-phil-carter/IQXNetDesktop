<?xml version="1.0" encoding="ISO-8859-1"?>
 <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:template match="/">
		<xsl:for-each select="rss/channel">
			<div style="padding:10px;background-color:#CCCCCC">
				<p><b><xsl:value-of select="title"/></b></p>
				<p><xsl:value-of select="description"/></p>
				<xsl:element name = "a">
					<xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
					<xsl:text>www.IQX.co.uk</xsl:text>
				</xsl:element>
			</div>
			<xsl:for-each select="item">
				<div style="border-width:1px;border-style: solid">
					<p>
						<b><xsl:value-of select="title"/></b><br />
						Author:<xsl:value-of select="author"/> (<xsl:value-of select="pubdate"/>)<br /><br />
						<xsl:value-of select="description"/><br />
						<xsl:if test="link !=''">
							<xsl:element name = "a">
								<xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
								<xsl:text>View article</xsl:text>
							</xsl:element>
						</xsl:if>
					</p>
				</div>
			</xsl:for-each>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
