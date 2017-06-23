



# Gen Form HTML from XML w/ HtmlFormEntry 

  

## 1. Create a new form object from your xml
**Option 1**: Utilizing [`public void HtmlFormEntry.HtmlForm.setXmlData(String xmlData)`][1]

<!-- -->

    import org.openmrs.module.htmlformentry.HtmlForm;

    ...

    HtmlForm form = new HtmlForm();
    form.setXmlData(xml);

<!-- -->

**Option 2**: if your XML is not loaded yet, utilizing [`public static HtmlForm HtmlFormEntryUI.HtmlFormUtil.getHtmlFormFromUiResource(<arguments>)`][2], [reference][3]

- Note: `relativeWebResourcePath` is the relative path from the directory `/omod/src/main/webapp/resources` of your module. 
- Arguments are `ResourceFactory resourceFactory, FormService formService, HtmlFormEntryService htmlFormEntryService, String providerAndPath`
     

<!-- -->

    import org.openmrs.api.FormService;
    import org.openmrs.module.htmlformentry.HtmlFormEntryService;
    import org.openmrs.module.htmlformentry.HtmlForm;
    import org.openmrs.module.htmlformentryui.HtmlFormUtil;

    ...
    
    String htmlFormPath = thisModuleName+":"+relativeWebResourcePath;
    ResourceFactory resourceFactory = ResourceFactory.getInstance();
    FormService formService = Context.getFormService();
    HtmlFormEntryService htmlFormEntryService = Context.getService(HtmlFormEntryService.class);
    HtmlForm form = HtmlFormUtil.getHtmlFormFromUiResource(resourceFactory, formService, htmlFormEntryService, htmlFormPath);
 
<!-- -->


## 2. Use [FormEntrySession][4] to generate HTML and handle form entry, submission, etc
- [reference][5]
- [better reference][6]

<!-- -->

    import org.openmrs.module.htmlformentry.FormEntrySession;

    ...

    FormEntrySession fes = new FormEntrySession(patient, form, request.getSession())
    String html = fes.getHtmlToDisplay()

<!-- -->

## 3. Use the html generated 
The html that the `FormEntrySession` object generated should contain all the logic required to submit the form.  

[1]: https://github.com/openmrs/openmrs-module-htmlformentry/blob/master/api/src/main/java/org/openmrs/module/htmlformentry/HtmlForm.java#L97-L99
[2]: https://github.com/openmrs/openmrs-module-htmlformentryui/blob/7160eb23c7f893152cfedd750f1cbf4f8673125c/api/src/main/java/org/openmrs/module/htmlformentryui/HtmlFormUtil.java
[3]: https://github.com/openmrs/openmrs-module-referenceapplication/blob/0b91f84f7e3005be5dbc14e31966229a239fd361/api/src/main/java/org/openmrs/module/referenceapplication/ReferenceApplicationActivator.java#L198-L221
[4]: https://github.com/openmrs/openmrs-module-htmlformentry/blob/f95c76214d682bc6df33b7ffdb2c8b9d413d5b27/api/src/main/java/org/openmrs/module/htmlformentry/FormEntrySession.java
[5]: https://github.com/openmrs/openmrs-module-htmlformentry/blob/f95c76214d682bc6df33b7ffdb2c8b9d413d5b27/omod/src/main/java/org/openmrs/module/htmlformentry/web/controller/HtmlFormFromFileController.java#L93-L94
[6]: https://github.com/openmrs/openmrs-module-htmlformentry/blob/f95c76214d682bc6df33b7ffdb2c8b9d413d5b27/api/src/main/java/org/openmrs/module/htmlformentry/FormEntrySession.java#L260-L262




# Historical Purpose Code

    ${ ui.includeFragment("htmlformentryui", "htmlform/enterHtmlForm", [
            patient: patient,
            htmlForm: htmlForm,
            returnUrl: returnUrl,
            automaticValidation: false,
            cssClass: "simple-form-ui"
    ]) }
