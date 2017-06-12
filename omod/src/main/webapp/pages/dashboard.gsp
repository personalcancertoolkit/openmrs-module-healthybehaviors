
${ ui.includeFragment("healthybehaviors", "headerForApp") }
<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/dashboard/behavior_tile_builder_singleton.js") }"></script>




<body>
    <div class="">
        <% if(securitylevel != 1) { %>
            
            
            <script>
                window["loaded_behaviors_data"] = {};
                
                // load nutrition
                var data_path = '${ ui.resourceLink("healthybehaviors", "/defined_behaviors/nutrition.json") }';
                fetch(data_path)
                  .then(function(response){return response.json()})
                  .then(function(json){window["loaded_behaviors_data"]["nutrition"] = json; });
                
                // load nutrition
                var data_path = '${ ui.resourceLink("healthybehaviors", "/defined_behaviors/exercise.json") }';
                fetch(data_path)
                  .then(function(response){return response.json()})
                  .then(function(json){window["loaded_behaviors_data"]["exercise"] = json; });
                
                
                // load exercise
                
            </script>
            
              ${ ui.includeFragment("healthybehaviors", "dashboard/tiles") }
        <% } %>
    </div>
</body>
