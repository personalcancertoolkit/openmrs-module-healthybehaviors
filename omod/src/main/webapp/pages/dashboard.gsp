<script type="text/javascript">
    jq(document).ready(function(){
        if (jq('#isCurrentPatient').val()=="true") {
            jq('#patientPortalNavHome').addClass('active');
        }
    });
</script>
<body>
    <div class="container bgcontent col-sm-8 col-sm-offset-2">
        Here i am!
        <% if(securitylevel != 1) { %>
            <div class="tab-content">
              HELLO, WORLD! 
            </div>
        <% } %>
    </div>
</body>
