<script>
window.addEventListener("load", function(){
    data_control_singleton.DOM.warning = {
        main : document.getElementById("warning_element"),
    }
    data_control_singleton.initialize_warning();
});
</script>
<div class = '' id = 'warning_element' style = 'width:100%;padding:20px 10px; display:none;'>
    <div class = 'healthy_tile' style = 'min-height:50px; margin:auto; width:100%; max-width:800px; padding:10px; ' >
        
        
        
        <div style = 'height:10px;'></div>
        
        <!-- content -->
        <div style = 'display:flex; width:100%; '>
            <div id = '' style = 'width:100%; max-width:700px; margin:auto; padding:5px; '>
                <div style = 'display:flex;'>
                    <div style = 'display:flex; width:30px;'>
                        <div style = 'margin:auto;'>
                            <img src = '${ ui.resourceLink("healthybehaviors", "/images/click_icon.svg") }' style = 'width:30px;'>
                        </div>
                    </div>
                    <div style = 'width:15px;'></div>
                    <div style = 'flex:1;'>
                        You have not recorded your <span id = 'behavior_advice_type_text'> behavior </span> data for this past <span id = 'behavior_time_interval'> (#) week(s) </span>. 
                        <Br>
                        Click here and record this data to personalize your advice and track your performance.
                    </div>
                </div>
                
                
            </div>
        </div>
        
        
        <div style = 'height:10px;'></div>
        
    </div>
</div>

