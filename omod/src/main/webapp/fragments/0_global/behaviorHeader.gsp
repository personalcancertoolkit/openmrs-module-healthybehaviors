<script>
    promise_requested_behavior.then((behavior_object)=>{
        instantiate_header(behavior_object, window.healthybehaviors.page_title);
    });
    
    function instantiate_header(behavior_object, page_title){
        var DOM = {
            image : document.getElementById("behavior_header_image"),
            title : document.getElementById("behavior_header_title"), 
            page_title : document.getElementById("behavior_header_pagetype")
        }
        DOM.image.style.backgroundImage = 'url(' + behavior_object.data.image_root + behavior_object.data.header_src + ')';
        DOM.title.innerHTML = behavior_object.data.advice_type_text;
        DOM.page_title.innerHTML = page_title;
        //console.log(behavior_object);
    };
</script>
<style>
    .header_back_button { padding:5px 15px; cursor:pointer; border-radius:5px; color:rgba(0, 0, 0, 0.31);}
    .header_back_button:hover {  color:rgb(8, 160, 255); }
</style>
<div style = 'height:20px;'></div>
<div class = '' style = 'width:100%; display:flex; padding:20px 10px; '>
    <div class = 'healthy_tile ' style = 'min-height:50px; margin:auto; width:100%; max-width:800px; text-align:center; position:relative; ' >
        <a class = 'header_back_button' style = 'position:absolute;  top:-40; left:-15; z-index:5;  ' href = 'dashboard.page'>
             go back
        </a>
        
        
        <div style = 'width:100%; height:225px; position:relative;'>
            <!-- gradient overly element will be inserted by css (:before) into this location -->
            <div id = 'behavior_header_image' class = 'image_element_to_place_gradient_over' style = 'display:flex;'>
                <div class = '' style = 'margin:auto; font-size:21px; color:white; z-index:1;'>
                    <span id = 'behavior_header_title' style = 'font-size:31px;'>Loading...</span> 
                    <br> 
                    <span id = 'behavior_header_pagetype'> </span> 
                </div>
            </div>
        </div>
    </div>
</div>
