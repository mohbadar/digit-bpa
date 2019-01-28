<%--
  ~ eGov suite of products aim to improve the internal efficiency,transparency,
  ~    accountability and the service delivery of the government  organizations.
  ~
  ~     Copyright (C) <2017>  eGovernments Foundation
  ~
  ~     The updated version of eGov suite of products as by eGovernments Foundation
  ~     is available at http://www.egovernments.org
  ~
  ~     This program is free software: you can redistribute it and/or modify
  ~     it under the terms of the GNU General Public License as published by
  ~     the Free Software Foundation, either version 3 of the License, or
  ~     any later version.
  ~
  ~     This program is distributed in the hope that it will be useful,
  ~     but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~     GNU General Public License for more details.
  ~
  ~     You should have received a copy of the GNU General Public License
  ~     along with this program. If not, see http://www.gnu.org/licenses/ or
  ~     http://www.gnu.org/licenses/gpl.html .
  ~
  ~     In addition to the terms of the GPL license to be adhered to in using this
  ~     program, the following additional terms are to be complied with:
  ~
  ~         1) All versions of this program, verbatim or modified must carry this
  ~            Legal Notice.
  ~
  ~         2) Any misrepresentation of the origin of the material is prohibited. It
  ~            is required that all modified versions of this material be marked in
  ~            reasonable ways as different from the original version.
  ~
  ~         3) This license does not grant any rights to any user of the program
  ~            with regards to rights under trademark law for use of the trade names
  ~            or trademarks of eGovernments Foundation.
  ~
  ~   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
  --%>


<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="/WEB-INF/taglib/cdn.tld" prefix="cdn"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<div class="panel-heading">
	<div class="panel-title">
		<spring:message code="lbl.tittle.noc.status" />
	</div>
</div>

<div class="panel-body custom">
	<table class="table table-bordered  multiheadertbl"
		id=bpaupdatenocdetails>
		<thead>
			<tr>
				<th><spring:message code="lbl.srl.no" /></th>
				<th><spring:message code="lbl.department" /></th>
				<th><spring:message code="lbl.nature.noc.req" /></th>
				<th class="hide"><spring:message code="lbl.letr.sent.on" /></th>
				<th class="hide"><spring:message code="lbl.reply.recv.on" /></th>
				<th class="nocStatusHeader hide"><spring:message
						code="lbl.noc.status" /></th>
				<th><spring:message code="lbl.remarks" /></th>
				<th><spring:message code="lbl.attachdocument" /><br>(<spring:message
						code="lbl.mesg.document" />)</th>
			</tr>
		</thead>
		<tbody id="ocNOCDocumentsBody">
			<c:choose>
				<c:when test="${occupancyCertificate.parent.serviceType ne null}">
					<c:forEach var="doc"
						items="${occupancyCertificate.getNocDocuments()}"
						varStatus="status">
						<tr>
							<td><c:out value="${status.index+1}"></c:out></td>
							<td><c:out value="${doc.nocDocument.checklist.description}"></c:out>
								<c:if test="${doc.nocDocument.checklist.isMandatory}">
									<span class="mandatory"></span>
								</c:if></td>
							<td>

								<div class="input-group">
									<form:textarea
										class="form-control patternvalidation textarea-content"
										data-pattern="alphanumericspecialcharacters" maxlength="1000"
										id="nocDocuments${status.index}natureOfRequest"
										path="nocDocuments[${status.index}].nocDocument.natureOfRequest" />
									<form:errors
										path="nocDocuments[${status.index}].nocDocument.natureOfRequest"
										cssClass="add-margin error-msg" />
									<span class="input-group-addon showModal"
										data-assign-to="nocDocuments${status.index}natureOfRequest"
										data-header="Nature Of NOC Request"><span
										class="glyphicon glyphicon-pencil" style="cursor: pointer"></span></span>
								</div>
							</td>
							<td class="hide"><form:input
									class="form-control datepicker letterSentOn" maxlength="50"
									data-date-end-date="0d" data-inputmask="'mask': 'd/m/y'"
									path="nocDocuments[${status.index}].nocDocument.letterSentOn" />
								<form:errors
									path="nocDocuments[${status.index}].nocDocument.letterSentOn"
									cssClass="add-margin error-msg" /></td>
							<td class="hide"><form:input
									class="form-control datepicker replyReceivedOn" maxlength="50"
									data-date-end-date="0d" data-inputmask="'mask': 'd/m/y'"
									path="nocDocuments[${status.index}].nocDocument.replyReceivedOn" />
								<form:errors
									path="nocDocuments[${status.index}].nocDocument.replyReceivedOn"
									cssClass="add-margin error-msg" /></td>
							<td class="hide"><form:select
									path="nocDocuments[${status.index}].nocDocument.nocStatus"
									cssClass="form-control nocStatus"
									cssErrorClass="form-control error">
									<form:option value="">
										<spring:message code="lbl.select" />
									</form:option>
									<form:options items="${nocStatusList}" itemLabel="nocStatusVal" />
								</form:select> <form:errors
									path="nocDocuments[${status.index}].nocDocument.nocStatus"
									cssClass="error-msg" /></td>
							<td>
								<div class="input-group">
									<form:textarea
										class="form-control patternvalidation textarea-content nocRemarks"
										data-pattern="alphanumericspecialcharacters"
										data-input-element="nocDocuments${status.index}remarks"
										maxlength="1000" id="nocDocuments${status.index}remarks"
										path="nocDocuments[${status.index}].nocDocument.remarks" />
									<form:errors
										path="nocDocuments[${status.index}].nocDocument.remarks"
										cssClass="add-margin error-msg" />
									<span class="input-group-addon showModal"
										data-assign-to="nocDocuments${status.index}remarks"
										data-header="Remarks"><span
										class="glyphicon glyphicon-pencil" style="cursor: pointer"></span></span>
								</div>
							</td>
							<td>
								<div class="files-upload-container" data-file-max-size="5"
									<c:if test="${doc.nocDocument.checklist.isMandatory eq true && fn:length(doc.nocDocument.getNocSupportDocs()) eq 0}">required</c:if>
									data-allowed-extenstion="doc,docx,xls,xlsx,rtf,pdf,txt,zip,jpeg,jpg,png,gif,tiff">
									<div class="files-viewer">

										<c:forEach items="${doc.nocDocument.getNocSupportDocs()}"
											var="file" varStatus="status1">
											<div class="file-viewer" data-toggle="tooltip"
												data-placement="top" title="${file.fileName}">
												<a class="download" target="_blank"
													href="/bpa/application/downloadfile/${file.fileStoreId}"></a>
												<c:choose>
													<c:when test="${file.contentType eq 'application/pdf'}">
														<i class="fa fa-file-pdf-o" aria-hidden="true"></i>
													</c:when>
													<c:when test="${file.contentType eq 'application/txt'}">
														<i class="fa fa-file-text-o" aria-hidden="true"></i>
													</c:when>
													<c:when
														test="${file.contentType eq 'application/rtf' || file.contentType eq 'application/doc' || file.contentType eq 'application/docx' || file.contentType eq 'application/msword' || file.contentType eq 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}">
														<i class="fa fa-file-word-o" aria-hidden="true"></i>
													</c:when>
													<c:when test="${file.contentType eq 'application/zip'}">
														<i class="fa fa-file-archive-o" aria-hidden="true"></i>
													</c:when>
													<c:when
														test="${file.contentType eq 'image/jpg' || file.contentType eq 'image/jpeg' || file.contentType eq 'image/png' || file.contentType eq 'image/gif' || file.contentType eq 'image/tiff'}">
														<i class="fa fa-picture-o" aria-hidden="true"></i>
													</c:when>
													<c:when
														test="${file.contentType eq 'application/xls' || file.contentType eq 'application/xlsx' || file.contentType eq 'application/vnd.ms-excel'}">
														<i class="fa fa-file-excel-o" aria-hidden="true"></i>
													</c:when>
													<c:otherwise>
														<i class="fa fa-file-o" aria-hidden="true"></i>
													</c:otherwise>
												</c:choose>
												<span class="doc-numbering">${status1.index+1}</span>
											</div>
										</c:forEach>

										<a href="javascript:void(0);" class="file-add"
											data-unlimited-files="true"
											data-file-input-name="nocDocuments[${status.index}].nocDocument.files">
											<i class="fa fa-plus"></i>
										</a>

									</div>
								</div>
						</tr>
					</c:forEach>
				</c:when>
				<c:otherwise>

				</c:otherwise>
			</c:choose>
		</tbody>
	</table>
</div>

<!-- Modal -->
<div class="modal fade" id="textarea-modal" role="dialog">
	<div class="modal-dialog modal-lg">

		<!-- Modal content-->
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title" id="textarea-header"></h4>
			</div>
			<div class="modal-body">
				<textarea class="form-control textarea-content-of-modal"
					id="textarea-updatedcontent" maxlength="1000" rows="10"></textarea>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary"
					id="textarea-btnupdate" data-dismiss="modal">
					<spring:message code="lbl.btn.update" />
				</button>
				<button type="button" class="btn btn-default" data-dismiss="modal">
					<spring:message code='lbl.close' />
				</button>

			</div>
		</div>

	</div>
</div>

<input type="hidden" id="letterSentDateReq"
	value="<spring:message code='msg.validate.letter.sentdate.req' />" />
<input type="hidden" id="replyReceivedDateValidate"
	value="<spring:message code='msg.validate.replyreceived.date' />" />
<input type="hidden" id="uploadMsg"
	value="<spring:message code='msg.upload' />" />
<input type="hidden" id="fileSizeLimit"
	value="<spring:message code='msg.filesize.validate' />" />
<input type="hidden" id="noPreviewAvailble"
	value="<spring:message code='msg.nopreview.availble' />" />

<!-- The Modal -->
<div id="imgModel" class="image-modal">
	<span class="closebtn">&times;</span> <img class="modal-content"
		id="previewImg">
	<div id="caption"></div>
</div>

<c:if test="${showUpdateNoc}">
	<link rel="stylesheet"
		href="<c:url value='/resources/css/bpa-style.css?rnd=${app_release_no}'/>">
	<script
		src="<cdn:url value='/resources/js/app/document-upload-helper.js?rnd=${app_release_no}'/>"></script>
</c:if>
<script
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/moment.min.js' context='/egi'/>"></script>
<script
	src="<cdn:url value='/resources/js/app/noc-helper.js?rnd=${app_release_no}'/>"></script>