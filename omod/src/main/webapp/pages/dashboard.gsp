
${ ui.includeFragment("healthybehaviors", "headerForApp") }

<script type="text/javascript">
    jq(document).ready(function(){
        if (jq('#isCurrentPatient').val()=="true") {
            jq('#patientPortalNavHome').addClass('active');
        }
    });
</script>
<body>
    <div class="container bgcontent col-sm-8 col-sm-offset-2">
        <% if(securitylevel != 1) { %>
            <div class="tab-content">
              ${ ui.includeFragment("healthybehaviors", "dashboardBehaviorTiles") }
            </div>
        <% } %>
    </div>
</body>
