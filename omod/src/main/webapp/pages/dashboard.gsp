
${ ui.includeFragment("healthybehaviors", "headerForApp") }
<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/dashboard/behavior_tile_builder_singleton.js") }"></script>

<body>
    <div class="">
        <% if(securitylevel != 1) { %>
              ${ ui.includeFragment("healthybehaviors", "dashboardBehaviorTiles") }
        <% } %>
    </div>
</body>
