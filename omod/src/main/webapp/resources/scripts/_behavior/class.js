function Behavior(behavior_identifier){
    /*
     set a promise to load behavior for the behavior identifier
     data 
      - basic data
      - encounters data 
     displays
      - form
      - graph
    */
    
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Define metadata required for loading data and begin loading data
    /////////////////////////////////////////////////////////////////////////////////////////////////
    this.promise = {};
    
    // define paths to data and displays from where to load data
    this.resource_root = global.resource_root  + "defined_behaviors/" + behavior_identifier + "/";
    this.resource_path = {
        data : {
            basic : this.resource_root + behavior_identifier + ".json",
        }
    }
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Initialize Data object, which will store all data that can be accessed for this behavior
    /////////////////////////////////////////////////////////////////////////////////////////////////
    this.data = new Behavior_Data_Manager(this);
    var promise_to_load_basic_data = this.data.load_basic_data();
    var promise_to_load_encounter_data = promise_to_load_basic_data.then(()=>{return this.data.load_encounter_data()}); // encoutner data needs encounter type, stored in basic data. thus the chain.
    
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Initialize Display object, which will store all the displays which can be accessed for this behavior
    /////////////////////////////////////////////////////////////////////////////////////////////////
    this.display = new Behavior_Display_Manager(this);
    var promise_to_build_terminology = this.display.build_a_display("terminology");
    var promise_to_build_form = this.display.build_a_display("form");
    var promise_to_build_graph_full = promise_to_load_encounter_data
        .then((encounters)=>{ return this.display.build_a_display("graph", {encounters : encounters, time_interval : this.data.time_interval})});
    var promise_to_build_advice = promise_to_load_encounter_data
        .then((encounters)=>{ return this.display.build_a_display("advice", {encounters : encounters})});
    
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Define that behavior is fully loaded / built 
    /////////////////////////////////////////////////////////////////////////////////////////////////
    this.promise.loaded = Promise.all([promise_to_load_basic_data, promise_to_load_encounter_data, promise_to_build_terminology, promise_to_build_form, promise_to_build_graph_full, promise_to_build_advice])
        .then(()=>{
            return this;
        });
}


function Behavior_Data_Manager(parent){
    this.parent = parent;
} 
Behavior_Data_Manager.prototype = {
    
    get wow_fact(){
        return "Did you know that "  + this.wow_facts[Math.floor(Math.random() * (this.wow_facts.length))] + "?";
    },
    
    load_basic_data : function(behavior_data){
        
        var retreive_data = fetch(this.parent.resource_path.data.basic)
                .then(function(response){ return response.json()});
        
        var load_data = retreive_data.then((behavior_data)=>{ 
            /*
                Note: Data is explicitly mapped here (as opposed to setting this.data = behavior_data) for maintanance and readability.
                      This ensures atleast one place where all usable data is explicitly defined and standards can be maintained.
            */

            // define unique identifier
            this.unique_behavior_id = behavior_data.unique_behavior_id;

            // define general behavior facts / display information
            this.header_title_text = behavior_data.header_title_text;
            this.advice_type_text = behavior_data.advice_type_text;
            this.wow_facts = behavior_data.wow_facts;

            
            // define static history data
            this.time_interval = behavior_data.time_interval;
            this.time_interval_in_milliseconds = behavior_data.time_interval_in_days * 24 * 60 * 60 * 1000;
            this.encounter_type = behavior_data.encounter_type;
            
            // define header image
            this.header_src = behavior_data.header_src;

            // define paths
            this.resource_root = global.resource_root + "defined_behaviors/"  + this.unique_behavior_id + "/";
            this.image_root = this.resource_root + "images/";

            // define advice specific data, if it is passed from basic page (development tool)
            this.personalized_advice = behavior_data.personalized_advice;

            // define up to date, if it is passed from basic page (development tool)
            this.dev_mode_force_not_uptodate = behavior_data.dev_mode_force_not_uptodate;
        });
        
        return load_data;
    },
    
    
    
    load_encounter_data : function(){
       var encounter_type = this.encounter_type; // note, this requires basic data to have been loaded first
       var retreive_data = new Promise((resolve, reject)=>{
            //Load all possible guidelines that user can choose to create a new reminder from
            jq.get('/openmrs/ws/simpleformservice/api/get_encounters/'+ encounter_type, function (response) {
                //console.log(response);
                resolve(response);
            });
        })
        
       var retreive_encounter_class = global.promise_helpers.promise_to_load_javascript(this.resource_root + "encounter/class.js")
            .then(()=>{
                var identifier = this.unique_behavior_id.capitalize() + "_Encounter";
                return window[identifier]; 
            })
       
        var load_data = Promise.all([retreive_data, retreive_encounter_class])
            .then((data)=>{ 
                var encounters = data[0];
                var Encounter_Class = data[1];
                
                // generate encounter objects
                var encounter_objects = [];
                encounters.forEach(function(encounter){
                    var this_encounter = new Encounter_Class(encounter);
                    if(this_encounter.time !== null) encounter_objects.push(this_encounter); // skip null encounters
                })
                //console.log(encounter_objects)
                this.encounters = encounter_objects;
                
                // define whether behavior is up to date
                var uptodate = false;
                for(var i = 0; i < encounter_objects.length; i++){
                    if(((new Date) - encounter_objects[i].time) < this.time_interval_in_milliseconds){
                        var uptodate = true;
                        break;
                    }
                }
                if(this.dev_mode_force_not_uptodate == true) var uptodate = false;
                this.uptodate = uptodate;
                
                return encounter_objects;
            });
        
        return load_data;
    }
    
    
}




function Behavior_Display_Manager(parent){
    this.parent = parent;
}
Behavior_Display_Manager.prototype = {
    
    build_a_display : function(display_identifier, optional_build_data){
        // this method returns a promise. The promise resolves with "success". 
        // additionally, this method assigns the dom to this[display_identifier], from where it cam=n be later accessed.
        
        // build a display expects that it will find a view.html file with the intended display
        // it also assumes that there may optionally be a builder.js file and a styles.css file that need to be loaded with the display.
        /*
            required : view.html
            optional : builder.js, styles.css
        */
        
        // display root expects the directory where it will find the appropriate resources at the following relative paths:
        var resource_paths = {
            config : this.parent.resource_root + display_identifier+"/config.json",
            html : this.parent.resource_root + display_identifier+"/view.html",
            builder : this.parent.resource_root + display_identifier+"/builder.js",
            styles : this.parent.resource_root + display_identifier+"/styles.css",
        }
        
        /*
            Logic:
                1. Check whether this display exists 
                    - exists config.json
                2. retreive view.html and attempt to load builder.js and styles.css all at the same time_interval
                3. when loads resolve:
                    - if builder exists, run the "build_from" method of the builder (builder objects name must be <behavior_identifier>_<display_identifier>_display_builder) 
                                         and define the this[display_identifier].dom object to be  
        */
        
        // 1, check whether this display exists / is configured
        var promise_to_check_that_display_exists = global.promise_helpers.promise_that_file_exists(resource_paths.config)
        
        
        // 1b, catch case where display does not exist / is not configured
        promise_to_check_that_display_exists.catch(()=>{
            console.error("Display " + display_identifier + " has not been configured for behavior " + this.parent.data.unique_behavior_id);
        })
        
        // 1c, retreive config object
        var promise_config_object = promise_to_check_that_display_exists
            .then(()=>{
                return global.promise_helpers.promise_to_retrieve_and_parse_json(resource_paths.config);
            });
        
        // 2, retreive view.html and attempt to load builder.js and styles.css (if either optional resource can not be loaded, then resolve as false)
        var promise_to_retreive_html = promise_config_object
            .then((config)=>{
                return global.promise_helpers.promise_to_retreive_html(resource_paths.html);
            })
        
        var promise_to_attempt_to_load_builder = promise_config_object
            .then((config)=>{
                if(config.builder === true){
                    return global.promise_helpers.promise_to_load_javascript(resource_paths.builder);
                } else {
                    return false;
                }
            })
        
        var promise_to_attempt_to_load_styles = promise_config_object
            .then((config)=>{
                if(config.styles === true){
                    return global.promise_helpers.promise_to_load_css(resource_paths.styles);
                } else {
                    return false;
                }
            })
        
        // 3, when loads resolve, build if builder exists and use that dom, else just use raw html as dom, and define the dom for this display 
        var promise_all_resources = Promise.all([promise_to_retreive_html, promise_to_attempt_to_load_builder, promise_to_attempt_to_load_styles]);
        var promise_to_build_and_record = promise_all_resources.then((data_array)=>{
            var html = data_array[0];
            var bool_builder_loaded = data_array[1];
            //var bool_styles_loaded = data_array[2]; this will never be useful
            
            var dom = (new DOMParser()).parseFromString(html, "text/html").body.childNodes[0]; // note, we require one wrapper element
            var display_data = {dom : dom}
            if(bool_builder_loaded){
                if(window[this.parent.data.unique_behavior_id + "_" + display_identifier + "_display_builder"] === "undefined"){
                    console.warn(this.parent.data.unique_behavior_id + "_" + display_identifier + "_display_builder" + " object is undefined. Builder not used.")
                } else {
                    display_data = window[this.parent.data.unique_behavior_id + "_" + display_identifier + "_display_builder"].build_from(dom, optional_build_data);
                }
            } 
            this[display_identifier] = display_data;
            return display_data;
        });
        
        return promise_to_build_and_record;
        
    },
        
    
}




