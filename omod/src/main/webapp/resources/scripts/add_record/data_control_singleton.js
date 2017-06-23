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
        terminology : null,
    },
    behavior_object : null,
    page_type : "Record Your Progress",
    
    instantiate_header : function(){
        if(this.behavior_object == null){
            setTimeout(this.instantiate_header.bind(this), 100);
            return;
        }
        this.DOM.header.image.style.backgroundImage = 'url(' + this.behavior_object.image_root + this.behavior_object.header_src + ')';
        this.DOM.header.title.innerHTML = this.behavior_object.advice_type_text;
        this.DOM.header.pagetype.innerHTML = this.page_type;
        console.log(this.behavior_object);
    },
    
    instantiate_terminology : function(){
        // load script
        var terminology_script_url = this.behavior_object.form_root + "terminology/helper.js";
        var script = document.createElement('script');
        script.setAttribute("src", terminology_script_url);
        script.onload = function(){
            //console.log("script is now loaded");
            exercise_terminology_DOM_builder.initialize();
        };
        document.getElementsByTagName('head')[0].appendChild(script);
        
        // load template
        var terminology_view_url = this.behavior_object.resource_root + "terminology/view.html";
        jq.get( terminology_view_url, function( data ) {
            this.DOM.terminology.innerHTML = data; 
            //console.log("view is now loaded");
        }.bind(this));
    }
    
}

