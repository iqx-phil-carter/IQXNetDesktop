<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="text"/>
	<xsl:template match="/">
		<xsl:text>{&#xA;</xsl:text>
		<xsl:for-each select="JobSearch/Jobs/Job[substitute_xpath_here]">
			<xsl:if test="position()=1">
	            <xsl:text>&quot;aoColumns&quot;: [&#xA;</xsl:text>
				<xsl:for-each select="*[@tbl='1']">
					<xsl:variable name="jobfieldname" select="name()" />
					<xsl:value-of select="concat('{&quot;sTitle&quot;: &quot;',/JobSearch/Captions/Caption[@fieldname=$jobfieldname],'&quot;}')"/>
					<xsl:value-of select="','"/>
					<xsl:text>&#xA;</xsl:text>
				</xsl:for-each>
				<xsl:text>{&quot;sTitle&quot;: &quot;Details&quot;}&#xA;</xsl:text>
				<xsl:text>],&#xA;&quot;aaData&quot;: [&#xA;</xsl:text>
			</xsl:if>
			<xsl:text>[</xsl:text>
			<xsl:for-each select="*[@tbl='1']">
				<xsl:value-of select="concat('&quot;', translate(.,'&quot;\','') , '&quot;')"/>
				<xsl:value-of select="','"/>
			</xsl:for-each>
			<xsl:value-of select="concat('&quot;', translate(@id,'&quot;\','') , '&quot;')"/>
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
