
${ ui.includeFragment("healthybehaviors", "headerForApp") }
<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/add_record/data_control_singleton.js") }"></script>


<script>
    console.log("${behavior}");
    // TODO - have this data be passed by server
    var data_path = '${ ui.resourceLink("healthybehaviors", "/defined_behaviors/" + behavior + "/" + behavior + ".json") }';
    fetch(data_path)
      .then(function(response){ return response.json()})
      .then(function(json){ window["data_control_singleton"].behavior_object = new abstract_behavior_class(json); });
</script>
<!-- initialize data controller script -->

        

<body>
<div class = 'margintop_buffers_hidden_in_iframe'></div>
    <div class="">
        <% if(securitylevel != 1) { %>
            
            <!-- header tile -->
            ${ui.includeFragment("healthybehaviors","0_global/behaviorHeader")}
            
            <!-- nomenclature explanation -->
            ${ui.includeFragment("healthybehaviors","addRecord/terminology")}
            
        <% } %>
    </div>
<div class = 'margintop_buffers_hidden_in_iframe'></div>
</body>

        
