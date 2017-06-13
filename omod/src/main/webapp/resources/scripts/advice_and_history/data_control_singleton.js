/*
This singleton object manipulates the DOM across all fragments of the adviceAndHistory page
This object is similar to the dashboard/behavior_tile_builder_singleton in that it is used to translate data stored by the 0_global/abstract_behavior_class.js into UI.
*/
var data_control_singleton = {
    // DOM elements that will be controled
    DOM : {
        header : {
            image : null,
            title :  null,
        },
        advice : {
            holder : null,
            template : null,
        },
        warning : {
            main : null,
            time_interval : null,
            behavior_title : null,
            tile : null,
        },
        history : {
            chart_canvas : null,
            data_table : null,
        }
    },
    behavior_object : null,
    
    instantiate_header : function(){
        if(this.behavior_object == null){
            setTimeout(this.instantiate_header.bind(this), 100);
            return;
        }
        this.DOM.header.image.style.backgroundImage = 'url(' + this.behavior_object.header_background_image_src + ')';
        this.DOM.header.title.innerHTML = this.behavior_object.advice_type_text;
        console.log(this.behavior_object);
    },
    
    instantiate_advice : function(){
        if(this.behavior_object == null){
            setTimeout(this.instantiate_advice.bind(this), 100);
            return;
        }
        var personalized_advice = this.behavior_object.personalized_advice;
        for(var i = 0; i < personalized_advice.length; i++){
            var this_advice = personalized_advice[i];
            var advice_element = this.DOM.advice.template.cloneNode(true);
            jq(advice_element).find(".advice_title")[0].innerHTML = this_advice[0];
            jq(advice_element).find(".advice_body")[0].innerHTML = this_advice[1];
            this.DOM.advice.holder.appendChild(advice_element);
        }
    },
    
    instantiate_warning : function(){
        if(this.behavior_object == null){
            setTimeout(this.initialize_warning.bind(this), 100);
            return;
        }
        if(this.behavior_object.uptodate == false){
            this.DOM.warning.main.style.display = "flex";
        }
        this.DOM.warning.tile.href = '/openmrs/healthybehaviors/recordPerformance.page?behavior='+this.behavior_object.unique_behavior_id;
        this.DOM.warning.time_interval.innerHTML = this.behavior_object.time_interval;
        this.DOM.warning.behavior_title.innerHTML = this.behavior_object.advice_type_text;
    },
    
    instantiate_history : function(){
        var chart_canvas = this.DOM.history.chart_canvas;
        var ctx = chart_canvas.getContext('2d');
        //console.log(ctx);
        new Chart(ctx, this.behavior_object.chart_data)  
    },
}