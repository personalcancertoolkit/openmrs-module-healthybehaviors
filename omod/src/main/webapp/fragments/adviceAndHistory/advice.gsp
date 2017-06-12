<script>
window.addEventListener("load", function(){
    data_control_singleton.DOM.advice = {
        holder : document.getElementById("advice_holder"), 
        template : document.getElementById("advice_element_template"),
    }
    data_control_singleton.instantiate_advice();
});
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

