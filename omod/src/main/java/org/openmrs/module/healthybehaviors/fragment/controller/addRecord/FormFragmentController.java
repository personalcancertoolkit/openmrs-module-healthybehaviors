/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.healthybehaviors.fragment.controller.addRecord;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.context.Context;
import org.openmrs.ui.framework.fragment.FragmentModel;
import org.openmrs.ui.framework.page.PageRequest;
import javax.servlet.http.HttpServletRequest;

import org.openmrs.Person;
import org.openmrs.Patient;
import org.openmrs.api.FormService;
import org.openmrs.module.htmlformentry.HtmlFormEntryService;
import org.openmrs.module.htmlformentry.HtmlForm;
import org.openmrs.module.htmlformentry.FormEntrySession;
import org.openmrs.module.htmlformentryui.HtmlFormUtil;
import org.openmrs.ui.framework.resource.ResourceFactory;

public class FormFragmentController {

    protected final Log log = LogFactory.getLog(getClass());

    public void controller(FragmentModel model, PageRequest pageRequest, HttpServletRequest request) {
        Person person = Context.getAuthenticatedUser().getPerson();
        Patient patient = Context.getPatientService().getPatient(person.getId());

        String behavior = "exercise";
        String htmlFormPath = "healthybehaviors:defined_behaviors/" + behavior + "/form/form.xml";
        htmlFormPath = "referenceapplication:htmlforms/vitals.xml";
        String html = "";
		try {

            ResourceFactory resourceFactory = ResourceFactory.getInstance();
            FormService formService = Context.getFormService();
            HtmlFormEntryService htmlFormEntryService = Context.getService(HtmlFormEntryService.class);
            HtmlForm form = HtmlFormUtil.getHtmlFormFromUiResource(resourceFactory, formService, htmlFormEntryService, htmlFormPath);

            FormEntrySession fes = new FormEntrySession(patient, form, request.getSession());
            html = fes.getHtmlToDisplay();
        } catch (Exception e) {
			log.error("An error occurred while loading the html.", e);
			html = "An error occurred while loading the html. " + e.getMessage();
		}
            
        model.addAttribute("html", html);
        model.addAttribute("username", Context.getAuthenticatedUser().getUsername());
    }

}
