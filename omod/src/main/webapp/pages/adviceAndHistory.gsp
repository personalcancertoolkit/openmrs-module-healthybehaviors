
${ ui.includeFragment("healthybehaviors", "headerForApp") }


<script>
    console.log("${behavior}");
    
    var data_path = '${ ui.resourceLink("healthybehaviors", "/defined_behaviors/nutrition.json") }';
    fetch(data_path)
      .then(function(response){ return response.json()})
      .then(function(json){ console.log(json) });
    window["data_for_controller"] = {};
</script>
<!-- initialize data controller script -->
<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/advice_and_history/data_control_singleton.js") }"></script>


<body>
    <div class="">
        <% if(securitylevel != 1) { %>
            
            <div class = 'offset_from_top_if_not_in_iframe'></div>

            
            <!-- header tile -->
            ${ui.includeFragment("healthybehaviors","adviceAndHistory/header")}
            
            <!-- advice tile -->
            <div style = 'margin-top:-10px;'></div>
            ${ui.includeFragment("healthybehaviors","adviceAndHistory/advice")}
            
            <!-- history tile -->
            <div style = 'margin-top:-10px;'></div>
            ${ui.includeFragment("healthybehaviors","adviceAndHistory/history")}
        <% } %>
    </div>
</body>
