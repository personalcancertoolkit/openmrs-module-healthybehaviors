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
        var load_script = new Promise((resolve, reject)=>{
            var script_url = this.behavior_object.resource_root + "terminology/helper.js";
            var script = document.createElement('script');
            script.setAttribute("src", script_url);
            script.onload = function(){
                resolve("success");
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        });
        
        // load template
        var load_html = new Promise((resolve, reject)=>{
            var view_url = this.behavior_object.resource_root  + "terminology/view.html";
            jq.get( view_url, function( data ) {
                this.DOM.terminology.innerHTML = data; 
                resolve("success");
            }.bind(this));
        })
        
        var load_html_and_load_script = Promise.all([load_html, load_script]);
        
        load_html_and_load_script.then((data_array)=>{
            exercise_terminology_DOM_builder.initialize();
        })
    },
    
    instantiate_form : function(){
        // load script
        var load_script = new Promise((resolve, reject)=>{
            var script_url = this.behavior_object.resource_root + "form/builder.js";
            var script = document.createElement('script');
            script.setAttribute("src", script_url);
            script.onload = function(){
                resolve("success");
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        });
        // load data
        var load_concepts = load_script.then((response)=>{
            var data_path = this.behavior_object.resource_root + "form/concepts.json";
            return fetch(data_path)
                .then(function(response){return response.json()})
                .then(function(json){ 
                    return new Promise((resolve, reject)=>{
                        exercise_form_DOM_builder.data = json; 
                        resolve("success");
                    })
                })
        })
        var load_encounter = load_script.then((response)=>{
            var data_path = this.behavior_object.resource_root + "form/encounter.json";
            return fetch(data_path)
                .then(function(response){return response.json()})
                .then(function(json){ 
                    return new Promise((resolve, reject)=>{
                        exercise_form_DOM_builder.encounter = json; 
                        resolve("success");
                    })
                })
        })
        
        // load html
        var load_html = new Promise((resolve, reject)=>{
            var view_url = this.behavior_object.resource_root  + "form/view.html";
            jq.get( view_url, function( data ) {
                this.DOM.form.innerHTML = data; 
                resolve("success");
            }.bind(this));
        })
        
        // wait for html to be loaded and script to be initalized
        var load_html_and_load_data = Promise.all([load_html, load_concepts, load_encounter]);
        
        load_html_and_load_data.then((data_array)=>{
            exercise_form_DOM_builder.initialize();   
            exercise_form_DOM_builder.build();   
        });
    }
    
}

