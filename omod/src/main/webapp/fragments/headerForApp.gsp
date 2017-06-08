
<head>
    <title>OpenMRS Healthy Behaviors</title>
    <link rel="shortcut icon" type="image/ico" href="/openmrs/images/openmrs-favicon.ico">
    <link rel="icon" type="image/png\" href="/openmrs/images/openmrs-favicon.png">
    
    
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
    <script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/jquery-1.11.1.min.js") }"></script>
    <script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/bootstrap.min.js") }"></script>
    <link rel="stylesheet" href="${ ui.resourceLink("healthybehaviors", "styles/bootstrap.min.css") }" type="text/css">
    
    
    <script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/abstract_behavior_class.js") }"></script>
    <link rel="stylesheet" href="${ ui.resourceLink("healthybehaviors", "styles/styles.css") }" type="text/css">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.6.0/Chart.bundle.min.js"></script>
    <script>
        /////////////////
        // Set default chart text color
        /////////////////
        Chart.defaults.global.defaultFontColor = '#3e3e3e';
        
        ////////////////
        // Offset from top if not loaded in iframe
        ////////////////
        window.addEventListener("load", function(){
            if(window.self === window.top){
                // not loaded in iframe
                jq(document).find(".offset_from_top_if_not_in_iframe").css("margin-top", "50px");
            }
        });
    </script>
    
    
    
    <script type="text/javascript" src="${ ui.resourceLink("uicommons", "/scripts/jquery-ui-1.9.2.custom.min.js")}"></script>
    <script type="text/javascript" src="${ ui.resourceLink("uicommons", "/scripts/underscore-min.js")}"></script>
    <script type="text/javascript" src="${ ui.resourceLink("uicommons", "/scripts/jquery.toastmessage.js")}"></script>
    <script type="text/javascript" src="${ ui.resourceLink("uicommons", "/scripts/jquery.simplemodal.1.4.4.min.js")}"></script>
    

    <script type="text/javascript">
        jq = jQuery;
    </script>

</head>


<!--
<div class="navbar navbar-default container headerForApp">
    <button type="button" class="navbar-toggle" data-toggle="collapse"
            data-target=".navbar-responsive-collapse">
        <span class="icon-bar"></span> <span class="icon-bar"></span> <span
            class="icon-bar"></span>
    </button>
    <div class="navbar-collapse collapse navbar-responsive-collapse">
      
    </div>
</div>
-->