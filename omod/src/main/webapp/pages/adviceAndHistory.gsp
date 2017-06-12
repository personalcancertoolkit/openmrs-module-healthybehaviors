
${ ui.includeFragment("healthybehaviors", "headerForApp") }
<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/advice_and_history/data_control_singleton.js") }"></script>


<script>
    console.log("${behavior}");
    // TODO - have this data be passed by server
    var data_path = '${ ui.resourceLink("healthybehaviors", "/defined_behaviors/" + behavior + ".json") }';
    fetch(data_path)
      .then(function(response){ return response.json()})
      .then(function(json){ window["data_control_singleton"].behavior_object = new abstract_behavior_class(json); });
</script>
<!-- initialize data controller script -->

        

<body>
<div class = 'offset_from_top_if_not_in_iframe'></div>
    <div class="">
        <% if(securitylevel != 1) { %>
            
            <!-- header tile -->
            ${ui.includeFragment("healthybehaviors","adviceAndHistory/header")}
            
            <!-- warning tile -->
            <div style = 'margin-top:-10px;'></div>
            ${ui.includeFragment("healthybehaviors","adviceAndHistory/warning")}
            
            <!-- advice tile -->
            <div style = 'margin-top:-10px;'></div>
            ${ui.includeFragment("healthybehaviors","adviceAndHistory/advice")}
            
            <!-- history tile -->
            <div style = 'margin-top:-10px;'></div>
            ${ui.includeFragment("healthybehaviors","adviceAndHistory/history")}
            
            
        <% } %>
    </div>
<div class = 'offset_from_top_if_not_in_iframe'></div>
</body>

        
