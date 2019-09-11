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
package org.egov.adtax.web.controller.tpbo;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import org.egov.adtax.entity.RevenueInspector;
import org.egov.adtax.service.RevenueInspectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping(value = "/tpbo")
public class UpdateTpboController {

    @Autowired
    private RevenueInspectorService revenueInspectorService;

    @RequestMapping(value = "/updateTpbo/{id}", method = GET)
    public String update(@PathVariable final Long id) {
        return "redirect:/tpbo/update/".concat(id.toString());
    }

    @RequestMapping(value = "/update/{id}", method = GET)
    public ModelAndView updateView(@PathVariable("id") final Long id,
            @ModelAttribute final RevenueInspector revenueInspector) {
        return new ModelAndView("tpbo-update", "revenueInspector",
                revenueInspectorService.findById(id));
    }

    @RequestMapping(value = "update", method = GET)
    public String update(@ModelAttribute final RevenueInspector revenueInspector, final BindingResult errors,
            final RedirectAttributes redirectAttrs, @RequestParam Long id) {

        if (errors.hasErrors()) {
            redirectAttrs.addFlashAttribute("name", "msg.tpbo.name");
            return "tpbo-update";
        }
        RevenueInspector existingTpboObject = revenueInspectorService.findById(id);
        existingTpboObject.setActive(revenueInspector.isActive());
        revenueInspectorService.update(existingTpboObject);

        redirectAttrs.addFlashAttribute("existingTpboObject", existingTpboObject);
        redirectAttrs.addFlashAttribute("message", "msg.tpbo.update");

        return new StringBuilder("redirect:/tpbo/success/").append(id).toString();
    }

    @RequestMapping(value = "/tpbo-update/{id}", method = GET)
    public String search(@PathVariable("id") final Long id, @ModelAttribute final RevenueInspector revenueInspector) {
        return new StringBuilder("redirect:/tpbo/success/").append(id).toString();
    }

    @RequestMapping(value = "/success/{id}", method = GET)
    public ModelAndView successView(@PathVariable("id") final Long id,
            @ModelAttribute final RevenueInspector revenueInspector) {
        return new ModelAndView("tpbo/tpbo-searchSuccess", "revenueInspector",
                revenueInspectorService.findById(id));
    }

}
