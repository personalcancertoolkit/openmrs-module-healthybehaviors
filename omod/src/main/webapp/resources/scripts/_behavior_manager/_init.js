/*
    The behavior manager provides a user interface for loading behaviors and keeping track of the behaviors that have already been loaded.
*/

var behavior_manager = {
    // loading data
    //behavior_class : null,
    enabled_behaviors : null,
    promise : {
        loaded : null,           
    },
    
    // dynamic data
    retrieved_behaviors : {}, // {behavior_identifier:behavior_object, ...}
    
    
    
    // loading function which promises that the behavior manager is loaded and then returns promises resolving in the loaded behaviors. 
    // this function can be called many times as it caches 
    /*
        enables 
        behavior_manager.load(behaviors) w/o worrying about loading behavior_manager as it caches all behavior it loads
    */
    promise_to_retreive : function(behaviors){
        return this.promise.loaded
            .then((data)=>{
                return this.loaded_retreive(behaviors);
            }).then((data)=>{
                if(typeof behaviors === "string") return data[0];
                return data;
            })
    },
    // retreival function, which should be run only when behavior_manager is loaded
    loaded_retreive : function(behaviors){
        // ensure behaviors is a list
        if(typeof behaviors == "string") behaviors = [behaviors];
        
        // ensure behaviors is one of the required behaviors
        var every_requested_behavior_is_enabled = behaviors.every(function(val){return this.enabled_behaviors.indexOf(val)>=0;}.bind(this));
        if(!(behaviors === "all" || every_requested_behavior_is_enabled)){
            console.log("ERR: one of the specified behavior types is not enabled");
            console.log(behaviors);
            console.log(this.enabled_behaviors);
            return false;
        }
        
        
        // for each behavior, create a promise to load it
        var promises_for_behaviors = [];
        for(var i = 0; i < behaviors.length; i++){
            var this_behavior = behaviors[i];
            
            console.log(this_behavior);
        
            if(typeof behavior_manager.retrieved_behaviors[this_behavior] === "undefined"){
                var this_behavior_object = new Behavior(this_behavior);
                behavior_manager.retrieved_behaviors[this_behavior] = this_behavior_object; // store a reference to the behavior 
            } else {
                var this_behavior_object = behavior_manager.retrieved_behaviors[this_behavior];
            }
            var promise_to_load_this_behavior = this_behavior_object.promise.loaded; // we dont really need to load anything for the behaviors, since calling the promises will trigger them automatically.
            
            var promise_to_retreive_this_behavior = promise_to_load_this_behavior
                .then((loaded_behavior)=>{
                    return Promise.resolve(loaded_behavior);
                })
            
            //console.log("-->>");
            //console.log(promise_to_retreive_this_behavior);
            
            promises_for_behaviors.push(promise_to_retreive_this_behavior);
        }
        
        //console.log(promises_for_behaviors);
        
        // return a promise which resolves when all behaviors are loaded
        return Promise.all(promises_for_behaviors);
    }
}

    
// promise to load the class    
var promise_to_load_class = global.promise_helpers.promise_to_load_javascript(global.resource_root + "/scripts/_behavior/class.js");
    
// promise to load enabled_behaviors
var promise_to_load_enabled_behaviors = global.promise_helpers.promise_that_file_exists(global.resource_root + "_module_settings/enabled_behaviors.json")
    .then(()=>{
        return global.promise_helpers.promise_to_retrieve_and_parse_json(global.resource_root + "_module_settings/enabled_behaviors.json");
    })
    .catch(()=>{
        return global.promise_helpers.promise_to_retrieve_and_parse_json(global.resource_root + "_module_settings/enabled_behaviors.default.json");
    })
    .then((enabled_behaviors)=>{
        behavior_manager.enabled_behaviors = enabled_behaviors;
    })

// promise to load everything
behavior_manager.promise.loaded = Promise.all([promise_to_load_class, promise_to_load_enabled_behaviors])
    .then((data_array)=>{
        //console.log("Behavior manager all loaded!");
    })
    

delete promise_to_load_class;
delete promise_to_load_enabled_behaviors;
    