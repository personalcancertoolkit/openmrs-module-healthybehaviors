
${ ui.includeFragment("healthybehaviors", "headerForApp") }
<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/dashboard/behavior_tile_builder_singleton.js") }"></script>
<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/_global/behavior_data_loader/init.js") }"></script>
<script>
    var promise_to_load_requested_behaviors = behavior_data_loader_metadata.promise.loaded.then((data)=>{
            console.log("here i am, promising nutrition and exercise data");
            return behavior_data_loader.promise_data_for(["nutrition", "exercise"]);
        }).then((data_array)=>{
            if(typeof window["loaded_behaviors"] === "undefined") window["loaded_behaviors"] = {};
            console.log("firing here, data array:");
            console.log(data_array)
            for(var i = 0; i < data_array.length; i++){
                var this_behavior_data = data_array[i];
                window["loaded_behaviors"][this_behavior_data.unique_behavior_id] = new abstract_behavior_class(this_behavior_data);
            }
        });
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

        