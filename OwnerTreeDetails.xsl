<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="xml"  omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<form id="FormMain" method="POST" accept-charset="utf-8" >
		<fieldset class="regular ui-corner-all">
		<xsl:element name="root" >
		<div class="questionnaire" >
			<xsl:for-each select="IQXResult/Row">
				<xsl:for-each select="*">
					<div class="qquestrow">
						<xsl:if test="name()!='ObjID'">
							<xsl:if test="substring(name(),string-length(name())-3,2)='__'" >
								<xsl:variable name="DataType" select="substring(name(),string-length(name())-1)" />
								<xsl:variable name="FieldName" select="translate(substring(name(),0,string-length(name())-3),'_',' ')" />
								<div class="qquestion ui-widget-header"><xsl:value-of select="$FieldName" /></div>
								<div class="qanswer">
									<input id="{name()}" type="text" name="p{name()}" readonly="readonly" class="medium longdate" value="{text()}" />
									<input id="Old{name()}" type="text" name="pOld{name()}" style="display:none" class="medium longdate" value="{text()}" />
								</div>
							</xsl:if>
							<xsl:if test="substring(name(),string-length(name())-3,2)!='__'" >
								<xsl:variable name="DataType" select="z" />
								<xsl:variable name="FieldName" select="translate(name(),'_',' ')" />
								<div class="qquestion ui-widget-header"><xsl:value-of select="$FieldName" /></div>
								<div class="qanswer">
									<input id="{name()}" name="p{name()}" type="text" readonly="readonly" value="{text()}"  />
									<input id="Old{name()}" name="pOld{name()}" type="text" style="display:none" value="{text()}"  />	
								</div>
							</xsl:if>
						</xsl:if>
						<xsl:if test="name()='ObjID'">
							<div class="qanswer">
							<input id="{name()}" name="p{name()}" type="hidden" readonly="readonly" value="{text()}" />
							<input id="ParentObject" name="pParentObject" type="text"  />
							</div>	
						</xsl:if>				
					</div>
				</xsl:for-each>
			</xsl:for-each>
		</div>
		</xsl:element>
		</fieldset>
		</form>
	</xsl:template>
</xsl:stylesheet>
