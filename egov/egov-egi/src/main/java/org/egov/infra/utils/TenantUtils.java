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
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */

package org.egov.infra.utils;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.egov.infra.config.core.ApplicationConfiguration;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.stereotype.Service;

@Service
public final class TenantUtils {

    private static final Logger LOG = LoggerFactory.getLogger(TenantUtils.class);

    private static final String TENANT = "tenant.";

    @Autowired
    private ApplicationConfiguration applicationConfiguration;

    @Autowired
    private ConfigurableEnvironment environment;

    private TenantUtils() {
        // Not to be initialized
    }

    public Map<String, String> tenantsMap() {
        Map<String, String> tenants = new HashMap<>();
        URL url;

        LOG.info("cities" + applicationConfiguration.cities());
        try {
            url = new URL(ApplicationThreadLocals.getDomainURL());

            // first get from override properties
            environment.getPropertySources().iterator().forEachRemaining(propertySource -> {
                LOG.info(
                        "Property Source" + propertySource.getName() + " Class Name" + propertySource.getClass().getSimpleName());
                if (propertySource.getName().contains("egov-erp-override.properties")
                        && propertySource instanceof MapPropertySource) {
                    ((MapPropertySource) propertySource).getSource().forEach((key, value) -> {
                        if (key.startsWith(TENANT)) {
                            tenants.put(value.toString(), url.getProtocol() + "://" + key.replace(TENANT, "")
                                    + (url.getPort() == -1 ? "" : ":" + url.getPort()) + "/");
                            LOG.info("*****override tenants******" + value.toString() + url.getProtocol() + "://"
                                    + key.replace(TENANT, "") + (url.getPort() == -1 ? "" : ":" + url.getPort()) + "/");
                        }
                    });
                }

            });
            // second get from application config only properties if it is not overriden
            environment.getPropertySources().iterator().forEachRemaining(propertySource -> {
                LOG.info(
                        "Property Source" + propertySource.getName() + " Class Name" + propertySource.getClass().getSimpleName());
                if (propertySource.getName().contains("application-config.properties")
                        && propertySource instanceof MapPropertySource) {
                    ((MapPropertySource) propertySource).getSource().forEach((key, value) -> {
                        if (key.startsWith(TENANT) && !tenants.containsKey(value)) {
                            tenants.put(value.toString(), url.getProtocol() + "://" + key.replace(TENANT, "")
                                    + (url.getPort() == -1 ? "" : ":" + url.getPort()) + "/");
                            LOG.info(
                                    "*****application config tenants******" + value.toString() + url.getProtocol() + "://"
                                            + key.replace(TENANT, "") + (url.getPort() == -1 ? "" : ":" + url.getPort()) + "/");
                        }
                    });
                }

            });
        } catch (MalformedURLException e) {
            LOG.error("Error occurred, while forming URL", e);
        }
        return tenants;
    }

}
