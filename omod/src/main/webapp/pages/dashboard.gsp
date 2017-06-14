
${ ui.includeFragment("healthybehaviors", "headerForApp") }
<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/dashboard/behavior_tile_builder_singleton.js") }"></script>




<body>
<div class = 'margintop_buffers_hidden_in_iframe' ></div>
    <div class="">
        <% if(securitylevel != 1) { %>
            
            
            <script>
                window["loaded_behaviors"] = {};
                
                // load nutrition
                var data_path = '${ ui.resourceLink("healthybehaviors", "/defined_behaviors/nutrition.json") }';
                fetch(data_path)
                  .then(function(response){return response.json()})
                  .then(function(json){window["loaded_behaviors"]["nutrition"] = new abstract_behavior_class(json); });
                
                // load exercise
                var data_path = '${ ui.resourceLink("healthybehaviors", "/defined_behaviors/exercise.json") }';
                fetch(data_path)
                  .then(function(response){return response.json()})
                  .then(function(json){window["loaded_behaviors"]["exercise"] = new abstract_behavior_class(json); });
                
                
                // load exercise
                
            </script>
            
              ${ ui.includeFragment("healthybehaviors", "dashboard/tiles") }
        <% } %>
    </div>
<div class = 'margintop_buffers_hidden_in_iframe'></div>
</body>

        