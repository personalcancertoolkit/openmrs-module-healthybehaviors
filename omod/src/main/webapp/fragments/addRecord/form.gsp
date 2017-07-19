<script type="text/javascript" src="${ ui.resourceLink("simpleformservice", "/initialize.js") }"></script>
<script>
    promise_requested_behavior.then((behavior_object)=>{
        instantiate_form(behavior_object);
    });
    
    function instantiate_form(behavior_object){
        if(behavior_object.data.uptodate === false){
            var DOM = {
                holder :  document.getElementById("form_holder"),
            }
            DOM.holder.appendChild(behavior_object.display.form.dom);
        } else {
            document.getElementById("uptodate_notification_time_interval").innerHTML = behavior_object.data.time_interval;
            document.getElementById("uptodate_notification_follow_link").href = "adviceAndHistory.page?behavior=" + behavior_object.data.unique_behavior_id;
            document.getElementById("uptodate_notification").style.display = "block";
        }
    };
</script>
<div id = 'form_holder' style = 'width:100%;'></div>

<div id = 'uptodate_notification' style = 'width:100%; display:none; '>

    <div class = '' style = 'width:100%; display:flex; padding:20px 10px; '>
        <div class = 'healthy_tile' style = 'min-height:50px; margin:auto; width:100%; max-width:800px; padding:10px; ' >

            <div style = 'height:20px;'></div>

            <!-- intro -->
            <div style = 'display:flex; width:100%; '>
                <div id = '' style = 'width:100%; max-width:700px;margin:auto; padding:5px; '>
                    <div concept = "" style = 'display:flex;'>
                        <div style = 'flex-grow:1'>
                            
                            You've already recorded a response for this behavior in the past <span id = 'uptodate_notification_time_interval'> X days </span>. <br><br> You can view your summary <a id = 'uptodate_notification_follow_link' class = 'behavior_highlighed_interest'>by clicking here</a>.  

                        </div>
                    </div>
                </div>
            </div>

            <div style = 'height:20px;'></div>

        </div>


    </div>

</div>