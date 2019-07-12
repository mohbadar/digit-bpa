/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact
 *
 */

package org.egov.infra.admin.master.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.google.common.base.Objects;

public class BoundaryPojo {

	public static final String SEQ_BOUNDARY = "seq_eg_boundary";
	private static final long serialVersionUID = 3054956514161912026L;

	private Long id;

	private String name;

	private String code;

	private Long boundaryNum;

	private BoundaryType boundaryType;

	private BoundaryPojo parent;

	private Set<BoundaryPojo> children = new HashSet<>();

	private Date fromDate;

	private Date toDate;

	private boolean active;

	private Long bndryId;

	private String localName;

	private Float longitude;

	private Float latitude;

	private String materializedPath;

	public Long getId() {
		return id;
	}

	public void setId(final Long id) {
		this.id = id;
	}

	public String getLocalName() {
		return localName;
	}

	public void setLocalName(final String boundaryNameLocal) {
		localName = boundaryNameLocal;
	}

	public BoundaryPojo getParent() {
		return parent;
	}

	public void setParent(final BoundaryPojo parent) {
		this.parent = parent;
	}

	public Set<BoundaryPojo> getChildren() {
		return children;
	}

	public void setChildren(final Set<BoundaryPojo> boundaries) {
		children = boundaries;
	}

	public String getName() {
		return name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(final String code) {
		this.code = code;
	}

	public boolean isLeaf() {
		return getChildren().isEmpty();
	}

	public BoundaryType getBoundaryType() {
		return boundaryType;
	}

	public void setBoundaryType(final BoundaryType boundaryType) {
		this.boundaryType = boundaryType;
	}

	public Long getBoundaryNum() {
		return boundaryNum;
	}

	public void setBoundaryNum(final Long number) {

		boundaryNum = number;
	}

	public boolean isRoot() {
		return getParent() == null;
	}

	public Date getFromDate() {
		return fromDate;
	}

	public void setFromDate(final Date fromDate) {
		this.fromDate = fromDate;
	}

	public Date getToDate() {
		return toDate;
	}

	public void setToDate(final Date toDate) {
		this.toDate = toDate;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(final boolean active) {
		this.active = active;
	}

	public Long getBndryId() {
		return bndryId;
	}

	public void setBndryId(final Long bndryId) {
		this.bndryId = bndryId;
	}

	public Float getLongitude() {
		return longitude;
	}

	public void setLongitude(final Float longitude) {
		this.longitude = longitude;
	}

	public Float getLatitude() {
		return latitude;
	}

	public void setLatitude(final Float latitude) {
		this.latitude = latitude;
	}

	public String getMaterializedPath() {
		return materializedPath;
	}

	public void setMaterializedPath(final String materializedPath) {
		this.materializedPath = materializedPath;
	}

	public boolean equals(Object other) {
		if (this == other)
			return true;
		if (!(other instanceof BoundaryPojo))
			return false;
		BoundaryPojo boundary = (BoundaryPojo) other;
		return Objects.equal(boundaryNum, boundary.boundaryNum) && Objects.equal(boundaryType, boundary.boundaryType);
	}

	public int hashCode() {
		return Objects.hashCode(boundaryNum, boundaryType);
	}

}
