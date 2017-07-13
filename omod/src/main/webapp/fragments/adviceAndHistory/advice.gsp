<script>
    promise_requested_behavior.then((behavior_object)=>{
        instantiate_advice(behavior_object);
    });
    
    function instantiate_advice(behavior_object){
        var DOM = {
            holder : document.getElementById("advice_holder"), 
            template : document.getElementById("advice_element_template"),
        }
        var personalized_advice = behavior_object.data.personalized_advice;
        for(var i = 0; i < personalized_advice.length; i++){
            var this_advice = personalized_advice[i];
            var advice_element = DOM.template.cloneNode(true);
            jq(advice_element).find(".advice_title")[0].innerHTML = this_advice[0];
            jq(advice_element).find(".advice_body")[0].innerHTML = this_advice[1];
            DOM.holder.appendChild(advice_element);
        }
    };
</script>

<div class = '' style = 'width:100%; display:flex; padding:20px 10px; '>
    <div class = 'healthy_tile' style = 'min-height:50px; margin:auto; width:100%; max-width:800px; padding:10px; ' >
        
        
        <div style = 'height:10px;'></div>
        
        <!-- intro -->
        <div style = 'display:flex; width:100%; '>
            <div id = '' style = 'width:100%; max-width:700px; min-height:100px; margin:auto; padding:5px; '>
                <div id = '' style = 'display:'>
                    <div style = 'font-size:18px;'>
                        Personalized Advice
                    </div>
                    <div style = 'padding-left:15px;'>
                        The advice presented below is tailored specifically to you by using the data you've reported throughout the forms you've been completing. Both the answers in the reports and the changes between reports are used to generate the advice presented below.
                    </div>
                </div>
            </div>
        </div>
        

        <div style = 'height:15px;'></div>
        <div style = 'display:flex;'>
            <div style = 'margin:auto; width:90%; border-bottom:1px solid rgba(128, 128, 128, 0.17);'></div>
        </div>
        <div style = 'height:15px;'></div>
        
        <div style = 'display:flex; width:100%;'>
            <div id = 'advice_holder' style = 'width:100%; max-width:700px; min-height:100px; margin:auto; padding:5px; '>
                <div style = 'display:none'>
                    <div id = 'advice_element_template' style = 'margin-bottom:10px;'>
                        <div class = 'advice_title' style = 'font-size:18px;'>
                            Advice Title
                        </div>
                        <div class = 'advice_body' style = 'padding-left:15px;'>
                            Advice Body
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div style = 'height:10px;'></div>
        
    </div>
</div>

