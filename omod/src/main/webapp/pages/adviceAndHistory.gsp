
${ ui.includeFragment("healthybehaviors", "headerForApp") }
<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/_behavior_manager/_init.js") }"></script>
<script>
    window["healthybehaviors"] = {};
    window.healthybehaviors["page_title"] = "Advice and History";
    var behavior_requested = "${behavior}";
    var promise_requested_behavior = behavior_manager.promise_to_retreive(behavior_requested);
</script>

        

<body>
<div class = 'margintop_buffers_hidden_in_iframe'></div>
    <div class="">
        <% if(securitylevel != 1) { %>
            
            <!-- header tile -->
            ${ui.includeFragment("healthybehaviors","0_global/behaviorHeader")}
            
            <!-- warning tile -->
            <div style = 'margin-top:-10px;'></div>
            ${ui.includeFragment("healthybehaviors","adviceAndHistory/warning")}
            
            <!-- advice tile -->
            <div style = 'margin-top:-10px;'></div>
            ${ui.includeFragment("healthybehaviors","adviceAndHistory/advice")}
            
            <!-- history tile -->
            <div style = 'margin-top:-10px;'></div>
            ${ui.includeFragment("healthybehaviors","adviceAndHistory/history")}
            
            <!-- history tile -->
            <div style = 'margin-top:-10px;'></div>
            ${ui.includeFragment("healthybehaviors","adviceAndHistory/peer_comps")}
            
        <% } %>
    </div>
<div class = 'margintop_buffers_hidden_in_iframe'></div>
</body>

        
