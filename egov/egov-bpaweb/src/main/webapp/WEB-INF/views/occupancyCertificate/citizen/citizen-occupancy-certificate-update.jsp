<%--
  ~ eGov suite of products aim to improve the internal efficiency,transparency,
  ~      accountability and the service delivery of the government  organizations.
  ~
  ~       Copyright (C) <2017>  eGovernments Foundation
  ~
  ~       The updated version of eGov suite of products as by eGovernments Foundation
  ~       is available at http://www.egovernments.org
  ~
  ~       This program is free software: you can redistribute it and/or modify
  ~       it under the terms of the GNU General Public License as published by
  ~       the Free Software Foundation, either version 3 of the License, or
  ~       any later version.
  ~
  ~       This program is distributed in the hope that it will be useful,
  ~       but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~       GNU General Public License for more details.
  ~
  ~       You should have received a copy of the GNU General Public License
  ~       along with this program. If not, see http://www.gnu.org/licenses/ or
  ~       http://www.gnu.org/licenses/gpl.html .
  ~
  ~       In addition to the terms of the GPL license to be adhered to in using this
  ~       program, the following additional terms are to be complied with:
  ~
  ~           1) All versions of this program, verbatim or modified must carry this
  ~              Legal Notice.
  ~
  ~           2) Any misrepresentation of the origin of the material is prohibited. It
  ~              is required that all modified versions of this material be marked in
  ~              reasonable ways as different from the original version.
  ~
  ~           3) This license does not grant any rights to any user of the program
  ~              with regards to rights under trademark law for use of the trade names
  ~              or trademarks of eGovernments Foundation.
  ~
  ~     In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
  --%>

<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="/WEB-INF/taglib/cdn.tld" prefix="cdn"%>
<div class="row">
	<div class="col-md-12">
		<form:form role="form" action="../update-submit" method="post"
				   modelAttribute="occupancyCertificate" id="occupancyCertificateUpdateForm"
				   cssClass="form-horizontal form-groups-bordered"
				   enctype="multipart/form-data">
			<input type="hidden" name="occupancyCertificate" id="occupancyCertificate" value="${occupancyCertificate.id}" />
			<input type="hidden" name="parent" id="ocParent" value="${occupancyCertificate.parent.id}" />
			<input type="hidden" id="noJAORSAMessage" name="noJAORSAMessage"
				   value="${noJAORSAMessage}" />
			<input type="hidden" id="invalidStakeholder" name="invalidStakeholder"
				   value="${invalidStakeholder}" />
			<form:hidden path="" id="onlinePaymentEnable" name="onlinePaymentEnable" value="${onlinePaymentEnable}" />
			<input type="hidden" id="mode" name="mode" value="${mode}" />
			<input type="hidden"  id="citizenOrBusinessUser" name="citizenOrBusinessUser" value="${citizenOrBusinessUser}"/>
			<input type="hidden"  id="validateCitizenAcceptance" name="validateCitizenAcceptance" value="${validateCitizenAcceptance}"/>
			<input type="hidden"  id="citizenDisclaimerAccepted" name="citizenDisclaimerAccepted" value="${citizenDisclaimerAccepted}"/>
			<input type="hidden"  id="isCitizen" name="isCitizen" value="${isCitizen}"/>
			<input type="hidden"  id="cityName" name="cityName" value="${cityName}"/>
			<form:hidden path="" id="workFlowAction" name="workFlowAction" />
			<input type="hidden" id="serviceTypeCode" value="${occupancyCertificate.parent.serviceType.code}" />
			<input type="hidden"  id="isEDCRIntegrationRequire" value="${isEDCRIntegrationRequire}"/>
			<form:hidden path="authorizedToSubmitPlan" id="authorizedToSubmitPlan"/>
			<input type="hidden"  id="stakeHolderType" value="${stakeHolderType}"/>

			<ul class="nav nav-tabs" id="settingstab">
				<li class="active"><a data-toggle="tab"
									  href="#application-info" data-tabidx=0><spring:message
						code='lbl.appln.details' /></a></li>
				<li><a data-toggle="tab" href="#document-info" data-tabidx=1><spring:message
						code='title.documentdetail' /></a></li>
				<li><a data-toggle="tab" href="#noc-document-info" data-tabidx=2><spring:message
						code='lbl.noc.doc.details' /></a></li>
			</ul>
			<div class="tab-content">
				<div id="application-info" class="tab-pane fade in active">
					<div class="panel panel-primary" data-collapsed="0">
						<jsp:include page="../oc-application-details.jsp"></jsp:include>
					</div>
					<div class="panel panel-primary" data-collapsed="0">
						<jsp:include page="../../application/edcr-application-details-form.jsp"></jsp:include>
					</div>
					<c:choose>
						<c:when test="${isEDCRIntegrationRequire && loadingFloorDetailsFromEdcrRequire}">
							<c:if test="${not empty occupancyCertificate.existingBuildings}">
								<div class="panel panel-primary" data-collapsed="0">
									<jsp:include page="../oc-edcr-existing-bldg-details.jsp" />
								</div>
							</c:if>
							<div class="panel panel-primary" data-collapsed="0">
								<jsp:include page="../oc-edcr-building-details.jsp"></jsp:include>
							</div>
						</c:when>
						<c:otherwise>
							<c:if test="${not empty occupancyCertificate.existingBuildings}">
								<div class="panel panel-primary" data-collapsed="0">
									<jsp:include page="../oc-edcr-existing-bldg-details.jsp" />
								</div>
							</c:if>
							<div class="panel panel-primary buildingdetails" data-collapsed="0">
						<jsp:include page="../oc-building-details.jsp"></jsp:include>
					</div>
						</c:otherwise>
					</c:choose>
				</div>
				<div id="document-info" class="tab-pane fade">
					<div class="panel panel-primary" data-collapsed="0">
						<jsp:include page="../oc-dcr-documents.jsp"></jsp:include>
						<jsp:include page="../oc-general-documents.jsp"></jsp:include>
					</div>
				</div>
				<div id="noc-document-info" class="tab-pane fade">
					<div class="panel panel-primary" data-collapsed="0">
						<jsp:include page="../oc-noc-documents.jsp"></jsp:include>
					</div>
				</div>
			</div>

			<div align="center">
				<form:button type="submit" id="ocSave" class="btn btn-primary"
							 value="Save"><spring:message code="lbl.save"/> </form:button>
				<form:button type="submit" id="ocCreate" class="btn btn-primary"
							 value="Submit"><spring:message code="lbl.submit"/></form:button>
				<input type="button" name="button2" id="button2" value="Close"
					   class="btn btn-default" onclick="window.close();" />
			</div>
		</form:form>
		
		<!-- Start --- For javascript messages localization purpose following hidden input tags used -->
		<input type="hidden" id="submitMoreThanPermiPlotArea" value="<spring:message code='msg.validate.onsubmit.morethan.permissible.plotarea'/>"/>
		<input type="hidden" id="saveApplication" value="<spring:message code='msg.confirm.save.appln'/>"/>
		<input type="hidden" id="submitApplication" value="<spring:message code='msg.confirm.submit.appln'/>"/>
		<input type="hidden" id="violationMessage1" value="<spring:message code='msg.validate.violationMessage' />"/>
		<input type="hidden" id="startingDateReq" value="<spring:message code='msg.validate.startingdate.req' />"/>
		<input type="hidden" id="completionDateReq" value="<spring:message code='msg.validate.workcompletiondate' />"/>
		<input type="hidden" id="extendAreaLimit" value="<spring:message code='msg.validate.extendarea.limit' />"/>
		<input type="hidden" id="resetFloorDetails" value="<spring:message code='msg.confirm.reset.floordetails' />"/>
		<input type="hidden" id="slotmappingValidate" value="<spring:message code='msg.validate.slotmapping' />"/>
		<input type="hidden" id="landAreaReq" value="<spring:message code='msg.validate.landarea.req' />"/>
		<input type="hidden" id="floorareaValidate" value="<spring:message code='msg.validate.floorarea' />"/>
		<input type="hidden" id="carpetareaValidate" value="<spring:message code='msg.validate.carpetarea' />"/>
		<input type="hidden" id="occupancyTypeMsg" value="<spring:message code='msg.validate.occupancytype' />"/>
		<input type="hidden" id="areaPermissibleWOAddnlFee1" value="<spring:message code='msg.validate.areaPermissibleWOAddnlFee1' />"/>
		<input type="hidden" id="areaPermissibleWOAddnlFee2" value="<spring:message code='msg.validate.areaPermissibleWOAddnlFee2' />"/>
		<input type="hidden" id="areaPermissibleWithAddnlFee1" value="<spring:message code='msg.validate.areaPermissibleWithAddnlFee1' />"/>
		<input type="hidden" id="areaPermissibleWithAddnlFee2" value="<spring:message code='msg.validate.areaPermissibleWithAddnlFee2' />"/>
		<input type="hidden" id="areaPermissibleWithAddnlFee3" value="<spring:message code='msg.validate.areaPermissibleWithAddnlFee3' />"/>
		<input type="hidden" id="areaPermissibleWithAddnlFee4" value="<spring:message code='msg.validate.areaPermissibleWithAddnlFee4' />"/>
		<input type="hidden" id="confirmAreaPermiWOAddnlFee" value="<spring:message code='msg.confirm.areaPermissibleWOAddnlFee' />"/>
		<input type="hidden" id="confirmAreaPermiWOAddnlFee1" value="<spring:message code='msg.confirm.areaPermissibleWOAddnlFee1' />"/>
		<input type="hidden" id="typeOfMsg" value="<spring:message code='msg.vlaidate.typeof' />"/>
		<input type="hidden" id="permissibleAreaForFloor1" value="<spring:message code='msg.vlaidate.permissibleAreaForFloor1' />"/>
		<input type="hidden" id="permissibleAreaForFloor2" value="<spring:message code='msg.vlaidate.permissibleAreaForFloor2' />"/>
		<input type="hidden" id="floorCombination" value="<spring:message code='msg.validate.floorcombination' />" />
		<input type="hidden" id="levelValidate" value="<spring:message code='msg.validate.level' />" />
		<input type="hidden" id="occuptypemsg" value="<spring:message code='msg.validate.occuptypemsg' />" />
		<input type="hidden" id="floorAlreadyExist" value="<spring:message code='msg.floordetails.already.exist' />" />
		<input type="hidden" id="valuesCannotEmpty" value="<spring:message code='msg.validate.values.cannot.empty' />" />
	    <input type="hidden" id="uploadMsg" value="<spring:message code='msg.upload' />" />
        <input type="hidden" id="docNameLength" value="<spring:message code='msg.validate.docname.length' />" />
	    <input type="hidden" id="fileSizeLimit" value="<spring:message code='msg.validate.filesize.limit' />" />
	    <input type="hidden" id="validDocFormat" value="<spring:message code='msg.validate.docformat' />" />
	    <input type="hidden" id="floorareaValidate" value="<spring:message code='msg.validate.floorarea' />"/>
		<input type="hidden" id="carpetareaValidate" value="<spring:message code='msg.validate.carpetarea' />"/>
		<input type="hidden" id="typeOfMsg" value="<spring:message code='msg.vlaidate.typeof' />"/>
		<input type="hidden" id="permissibleAreaForFloor1" value="<spring:message code='msg.vlaidate.permissibleAreaForFloor1' />"/>
		<input type="hidden" id="permissibleAreaForFloor2" value="<spring:message code='msg.vlaidate.permissibleAreaForFloor2' />"/>
		<input type="hidden" id="builtupAndCarpetDetails" value="<spring:message code='msg.tittle.builtup.carpet.details' />"/>
		<input type="hidden" id="blockMsg" value="<spring:message code='msg.tittle.blockmsg' />"/>
		<input type="hidden" id="buildScrutinyNumber" value="<spring:message code='msg.validate.building.scrutiny.number' />"/>
		<input type="hidden" id="buildingPlanApplnForServiceType" value="<spring:message code='msg.validate.buildingplan.applnfor.servicetype' />"/>
		<input type="hidden" id="buildServiceType" value="<spring:message code='msg.validate.building.servicetype' />"/>
		<input type="hidden" id="forBuildScrutinyNumber" value="<spring:message code='msg.validate.forbuilding.scrutiny.number' />"/>
		<input type="hidden" id="floorDetailsNotExtracted" value="<spring:message code='msg.validate.floordetsil.not.extracted' />"/>
		<input type="hidden" id="existingBuildDetailsNotPresent" value="<spring:message code='msg.validate.existing.building.details.notpresent' />"/>
		<!-- End --- For javascript messages localization purpose following hidden input tags used -->
	</div>
</div>

<link rel="stylesheet"
	  href="<c:url value='/resources/global/css/bootstrap/bootstrap-tagsinput.css?rnd=${app_release_no}' context='/egi'/>">
<script
		src="<c:url value='/resources/global/js/bootstrap/bootstrap-tagsinput.min.js?rnd=${app_release_no}' context='/egi'/>"></script>
<script
		src="<c:url value='/resources/global/js/handlebars/handlebars.js?rnd=${app_release_no}' context='/egi'/>"></script>
<script
		src="<cdn:url value='/resources/global/js/egov/inbox.js?rnd=${app_release_no}' context='/egi'/>"></script>
<script
		src="<cdn:url value='/resources/js/app/bpa-ajax-helper.js?rnd=${app_release_no}'/>"></script>
<script
		src="<cdn:url value='/resources/js/app/documentsuploadvalidation.js?rnd=${app_release_no}'/>"></script>
<script
		src="<cdn:url value='/resources/js/app/occupancy-certificate/bpa-oc-validations.js?rnd=${app_release_no}'/>"></script>
<script
		src="<cdn:url value='/resources/js/app/occupancy-certificate/oc-edcr-helper.js?rnd=${app_release_no}'/>"></script>
<script
		src="<cdn:url value='/resources/js/app/occupancy-certificate/occupancy-certificate-update.js?rnd=${app_release_no}'/>"></script>