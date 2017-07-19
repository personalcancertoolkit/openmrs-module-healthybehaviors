
${ ui.includeFragment("healthybehaviors", "headerForApp") }
<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/_behavior_manager/_init.js") }"></script>
<script>
    window["healthybehaviors"] = {};
    window.healthybehaviors["page_title"] = "Advice and History";
    var promise_requested_behavior = behavior_manager.promise_to_retreive(["nutrition", "exercise"]);
</script>


<body>
<div class = 'margintop_buffers_hidden_in_iframe' ></div>
    <div class="">
        <% if(securitylevel != 1) { %>
            
              ${ ui.includeFragment("healthybehaviors", "dashboard/tiles") }
        <% } %>
    </div>
<div class = 'margintop_buffers_hidden_in_iframe'></div>
</body>

        