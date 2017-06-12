<script>
window.addEventListener("load", function(){
    data_control_singleton.DOM.header = {
        image : document.getElementById("header_image"),
        title : document.getElementById("header_title"), 
    }
    data_control_singleton.instantiate_header();
});
</script>
<div class = '' style = 'width:100%; display:flex; padding:20px 10px; '>
    <div class = 'healthy_tile ' style = 'min-height:50px; margin:auto; width:100%; max-width:800px; text-align:center; ' > <!-- padding:10px removed for image to take full size -->
        
        
        <div style = 'width:100%; height:225px; position:relative;'>
            <!-- gradient overly element will be inserted by css (:before) into this location -->
            <div id = 'header_image' class = 'image_element_to_place_gradient_over' style = 'display:flex;'>
                <div class = '' style = 'margin:auto; font-size:21px; color:white; z-index:1;'>
                    <span id = 'header_title' style = 'font-size:31px;'>Behavior</span> 
                    <br> 
                    Advice and History 
                </div>
            </div>
        </div>
    </div>
</div>
