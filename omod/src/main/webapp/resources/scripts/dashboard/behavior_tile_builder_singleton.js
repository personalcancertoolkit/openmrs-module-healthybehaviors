var behavior_tile_builder_singleton = {
    tile_holder : null,
    tile_template : null, // defines the DOM object which wraps the template and which will be manipulated to build individualized tiles
    
    build_tile_and_add_to_holder : function(behavior_object){
        var a_tile = this.tile_template.cloneNode(true);
        
        // Set tile id
        a_tile.id = behavior_object.data.unique_behavior_id + "-behavior_tile";
        
        // Set header title
        jq(a_tile).find(".behavior_tile_header_text")[0].innerHTML = behavior_object.data.header_title_text;
        
        // Set header background image
        jq(a_tile).find(".behavior_tile_header_image")[0].style.backgroundImage = 'url(' + behavior_object.data.image_root + behavior_object.data.header_src + ')';
        
        // Set wow fact
        jq(a_tile).find(".behavior_tile_wow_fact")[0].innerHTML = behavior_object.data.wow_fact;
        
        // Set advice_type_text to EACH behavior_tile_advice_type_text
        jq(a_tile).find(".behavior_tile_advice_type_text").html(behavior_object.data.advice_type_text);
        
        // set behavior_tile_time_interval text
        jq(a_tile).find(".behavior_tile_time_interval").html(behavior_object.data.time_interval)
        
        // set html
        this.tile_holder.appendChild(a_tile);
        
        // update tile graph data to uptodate status
        if(behavior_object.data.uptodate == true){
            //console.log("here i am");
            //console.log(jq(a_tile).find(".behavior_tile_response_uptodate"));
            jq(a_tile).find(".behavior_tile_response_uptodate").css('display', 'block');
        } else {
            jq(a_tile).find(".behavior_tile_response_outofdate").css('display', 'block');
        }
        
        // insert links to respective advice/history and form views
        jq(a_tile).find(".behavior_tile_form_anchor").attr('href','/openmrs/healthybehaviors/addRecord.page?behavior='+behavior_object.data.unique_behavior_id);
        jq(a_tile).find(".behavior_tile_advice_history_anchor").attr('href','/openmrs/healthybehaviors/adviceAndHistory.page?behavior='+behavior_object.data.unique_behavior_id);
        
        
        // initialize the chart 
        this.initialize_graphs(behavior_object);
    },
    
    initialize_graphs : function(behavior_object){
        var reference_element = document.getElementById(behavior_object.data.unique_behavior_id + "-behavior_tile");
        var chart_canvas = (jq(reference_element).find(".behavior_tile_mini_chart")[0]);
        var ctx = chart_canvas.getContext('2d');
        //console.log(ctx);
        new Chart(ctx, behavior_object.display.graph.preview_data)
    }
    
}
