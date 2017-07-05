<script>
promise_to_load_requested_behavior.then(function(){
    data_control_singleton.DOM.warning = {
        main : document.getElementById("warning_element"),
        time_interval : document.getElementById("warning_time_interval"),
        behavior_title : document.getElementById("warning_advice_type_text"),
        tile : document.getElementById("warning_tile_element"),
    }
    data_control_singleton.instantiate_warning();
});
</script>
<div class = '' id = 'warning_element' style = 'width:100%;padding:20px 10px; display:none;'>
    <a id = 'warning_tile_element' class = 'healthy_tile behavior_tile_button' style = 'min-height:50px; margin:auto; width:100%; max-width:800px; padding:10px; border-radius:0px; border:0px; ' >
        
        
        
        <div style = 'height:10px;'></div>
        
        <!-- content -->
        <div style = 'display:flex; width:100%; '>
            <div id = '' style = 'width:100%; max-width:700px; margin:auto; padding:5px; '>
                <div style = 'display:flex;'>
                    <div style = 'display:flex; width:30px;'>
                        <div style = 'margin:auto;'>
                            <img src = '${ ui.resourceLink("healthybehaviors", "/images/click_icon_blue.svg") }' style = 'width:30px;'>
                        </div>
                    </div>
                    <div style = 'width:15px;'></div>
                    <div style = 'flex:1;'>
                        You have not recorded your <span id = 'warning_advice_type_text' style = 'text-transform:lowercase;'> behavior </span> data for this past <span id = 'warning_time_interval'> (#) week(s) </span>. 
                        <Br>
                        Click here and record this data to personalize your advice and track your performance.
                    </div>
                </div>
                
                
            </div>
        </div>
        
        
        <div style = 'height:10px;'></div>
        
    </a>
</div>

