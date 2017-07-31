<script>
    promise_requested_behavior.then((behavior_object)=>{
        instantiate_warning(behavior_object);
    });
    
    function instantiate_warning(behavior_object){
        var DOM = {
            main : document.getElementById("warning_element"),
            time_interval : jq(document).find(".warning_time_interval"),
            behavior_title : jq(document).find(".warning_advice_type_text"),
            tile : document.getElementById("warning_tile_element"),
            not_uptodate_text : document.getElementById("warning_not_up_to_date_text"),
        }
        DOM.main.style.display = "flex";
        DOM.tile.href = '/openmrs/healthybehaviors/addRecord.page?behavior='+behavior_object.data.unique_behavior_id;
        DOM.time_interval.html(behavior_object.data.time_interval);
        DOM.behavior_title.html(behavior_object.data.advice_type_text);
        
        if(behavior_object.data.uptodate == false){
            DOM.tile.classList.add("behavior_tile_button_call_to_action_modifier");
            DOM.not_uptodate_text.style.display = "inline-block";
        }
    };
</script>

<style>
</style>

<div class = '' id = 'warning_element' style = 'width:100%;padding:20px 10px; display:none;'>
    <a id = 'warning_tile_element' class = 'healthy_tile behavior_tile_button ' style = 'min-height:50px; margin:auto; width:100%; max-width:800px; padding:10px; border-radius:0px; border:0px; ' >
        
        
        
        <div style = 'height:10px;'></div>
        
        <!-- content -->
        <div style = 'display:flex; width:100%; '>
            <div id = '' class = '' style = 'width:100%; max-width:700px; margin:auto; padding:5px;  '>
                <div style = 'display:flex;'>
                    <div style = 'display:flex; width:30px;'>
                        <div style = 'margin:auto;'>
                            <span class="icon-click_icon_pathed glyphicon" style = 'font-size:31px;'></span>
                        </div>
                    </div>
                    <div style = 'width:15px;'></div>
                    <div style = 'flex:1;'>
                        <span id = 'warning_not_up_to_date_text' style = 'display:none;'>
                            You have not recorded anything for this period yet. 
                        </span>
                        Click here to record data about your <span class = 'warning_advice_type_text' style = 'text-transform:lowercase;'> behavior </span> for this past <span class = 'warning_time_interval'> (#) week(s) </span>. This will be used to personalize your advice and track your performance.
                    </div>
                </div>
                
                
            </div>
        </div>
        
        
        <div style = 'height:10px;'></div>
        
    </a>
</div>

