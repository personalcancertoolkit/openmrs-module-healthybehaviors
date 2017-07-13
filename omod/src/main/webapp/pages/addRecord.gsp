
${ ui.includeFragment("healthybehaviors", "headerForApp") }
<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/_behavior_manager/_init.js") }"></script>
<script>
    window["healthybehaviors"] = {};
    window.healthybehaviors["page_title"] = "Record Your Progress";
    var behavior_requested = "${behavior}";
    var promise_requested_behavior = behavior_manager.promise_to_retreive(behavior_requested);
</script>

        

<body>
<div class = 'margintop_buffers_hidden_in_iframe'></div>
    <div class="">
        <% if(securitylevel != 1) { %>
            
            <!-- header  -->
            ${ui.includeFragment("healthybehaviors","0_global/behaviorHeader")}
            
            <!-- nomenclature explanation -->
            ${ui.includeFragment("healthybehaviors","addRecord/terminology")}
            
            
            <!-- form -->
            ${ui.includeFragment("healthybehaviors","addRecord/form")}
            
        <% } %>
    </div>
<div class = 'margintop_buffers_hidden_in_iframe'></div>
</body>

        
