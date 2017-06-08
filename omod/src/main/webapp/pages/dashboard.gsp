
${ ui.includeFragment("healthybehaviors", "headerForApp") }

<script type="text/javascript">
    jq(document).ready(function(){
        if (jq('#isCurrentPatient').val()=="true") {
            jq('#patientPortalNavHome').addClass('active');
        }
    });
</script>
<body>
    <div class="">
        <% if(securitylevel != 1) { %>
              ${ ui.includeFragment("healthybehaviors", "dashboardBehaviorTiles") }
        <% } %>
    </div>
</body>
