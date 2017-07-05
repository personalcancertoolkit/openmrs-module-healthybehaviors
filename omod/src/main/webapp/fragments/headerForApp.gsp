
<head>
    <title>OpenMRS Healthy Behaviors</title>
    <link rel="shortcut icon" type="image/ico" href="/openmrs/images/openmrs-favicon.ico">
    <link rel="icon" type="image/png\" href="/openmrs/images/openmrs-favicon.png">
    
    
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
    <script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/jquery-1.11.1.min.js") }"></script>
    <script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/bootstrap.min.js") }"></script>
    <link rel="stylesheet" href="${ ui.resourceLink("healthybehaviors", "styles/bootstrap.min.css") }" type="text/css">
    
    
    <script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/_global/abstract_behavior_class.js") }"></script>
    <script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/_global/iframe_loading_provisioner_singleton.js") }"></script>
    <link rel="stylesheet" href="${ ui.resourceLink("healthybehaviors", "styles/healthy_behaviors_styles.css") }" type="text/css">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.6.0/Chart.bundle.min.js"></script>
    <script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/prototypes.js") }"></script>
    <script>
        /////////////////
        // Set default chart text color
        /////////////////
        Chart.defaults.global.defaultFontColor = '#3e3e3e';
        
        ////////////////
        // Offset from top if not loaded in iframe
        ////////////////
        
        ////////////////
        // Enable parent pages (hosting this module in an iframe) to resize the iframe
        ////////////////
        iframe_loading_provisioner_singleton.initialize();
    </script>
    
    
    
    <script type="text/javascript" src="${ ui.resourceLink("uicommons", "/scripts/jquery-ui-1.9.2.custom.min.js")}"></script>
    <script type="text/javascript" src="${ ui.resourceLink("uicommons", "/scripts/underscore-min.js")}"></script>
    <script type="text/javascript" src="${ ui.resourceLink("uicommons", "/scripts/jquery.toastmessage.js")}"></script>
    <script type="text/javascript" src="${ ui.resourceLink("uicommons", "/scripts/jquery.simplemodal.1.4.4.min.js")}"></script>
    

    <script type="text/javascript">
        jq = jQuery;
    </script>
    <style>
        .margintop_buffers_hidden_in_iframe {
            margin-top:50px;
        }
    </style>
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