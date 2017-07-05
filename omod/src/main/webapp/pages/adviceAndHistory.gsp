
${ ui.includeFragment("healthybehaviors", "headerForApp") }
<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/advice_and_history/data_control_singleton.js") }"></script>
<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/_global/behavior_data_loader/init.js") }"></script>
<script>
    var promise_to_load_requested_behavior = behavior_data_loader_metadata.promise.loaded.then((data)=>{
            console.log("here i am, promising nutrition and exercise data");
            var behavior_requested = "${behavior}";
            return behavior_data_loader.promise_data_for(behavior_requested);
        }).then((data_array)=>{
            var data = data_array[0];
            window["data_control_singleton"].behavior_object = new abstract_behavior_class(data);
        });
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
            
        <% } %>
    </div>
<div class = 'margintop_buffers_hidden_in_iframe'></div>
</body>

        
