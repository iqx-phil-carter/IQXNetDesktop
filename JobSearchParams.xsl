<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="xml" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<xsl:for-each select="JobSearch/SearchForm/SearchField">
			<p>
				<label><xsl:value-of select="@caption"/></label>
				<xsl:element name="{@fieldtype}">
					<xsl:attribute name="name"><xsl:value-of select="@name"/></xsl:attribute>
					<xsl:attribute name="class"><xsl:value-of select="@class"/></xsl:attribute>
					<xsl:if test="@multiple!=''">
						<xsl:attribute name="multiple"><xsl:value-of select="@multiple"/></xsl:attribute>
					</xsl:if>
					<xsl:if test="@multiple=''">
						<xsl:if test="@class='required'">
							<option value=""></option>
						</xsl:if>
						<xsl:if test="@class!='required'">
							<option value="$IGNORE$"></option>
						</xsl:if>
					</xsl:if>
					<xsl:copy-of select="*"/>
				</xsl:element>
			</p>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
