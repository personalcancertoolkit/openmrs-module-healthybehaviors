/*
    This object needs to be able to
    - load requested behaviors

*/

var behavior_data_loader = {
    enabled_behaviors : null,
    resource_root : null,
    
    
    promise_data_for(behaviors){
        // validate data into a standard format
        if(typeof behaviors == "string") behaviors = [behaviors];
        if(!(behaviors === "all" || behaviors.every(function(val){
            //console.log(this);
            return this.enabled_behaviors.indexOf(val)>=0;
        }.bind(this)))){
            console.log("ERR: one of the specified behavior types is not enabled");
            console.log(behaviors);
            console.log(this.enabled_behaviors);
            return false;
        }
        
        // for each behavior, create a promise to load it's data
        var promises_for_behavior_data = [];
        for(var i = 0; i < behaviors.length; i++){
            var this_behavior = behaviors[i];
            //console.log("creating promise for behavior" + this_behavior);           
            var this_behavior_data_path = this.resource_root + "defined_behaviors/" + this_behavior + "/" + this_behavior + ".json";
            var this_promise = fetch(this_behavior_data_path)
                .then(function(response){ return response.json()})
                .then((static_behavior_data)=>{
                    var this_encounter_type = static_behavior_data.encounter_type;
                    var this_behavior = static_behavior_data.unique_behavior_id;
                    return Promise.all([static_behavior_data, this.promise_encounters_for_encounter_type(this_encounter_type), this.promise_data_converter(this_behavior)]);
                })
                .then((data_array)=>{
                    var static_behavior_data = data_array[0];
                    var dynamic_behavior_data = data_array[1];
                    var converter_object = data_array[2];
                    var full_behavior_data = static_behavior_data;
                    full_behavior_data["encounters"] = dynamic_behavior_data; // load behavior data
                    full_behavior_data["data_converter"] = window[converter_object]; // load converter object
                    return full_behavior_data;
                })
            promises_for_behavior_data.push(this_promise);
        }
        
        // return a promise which resolves with data for each behavior
        return Promise.all(promises_for_behavior_data);
    },
    
    promise_encounters_for_encounter_type : function(encounter_type){
        // return Promise.resolve("encounter_data_goes_here");
        return new Promise((resolve, reject)=>{
            //Load all possible guidelines that user can choose to create a new reminder from
            jq.get('/openmrs/ws/simpleformservice/api/get_encounters/'+ encounter_type, function (response) {
                //console.log(response);
                resolve(response);
            });
        })
    },
    
    promise_data_converter : function(this_behavior){
      
        /*
            load object and then return object name, after the object is loaded, to be later set as a reference as the data converter
        */
        
        var converter_path = this.resource_root + "defined_behaviors/" + this_behavior + "/data_converter/converter.js";
        var converter_name = this_behavior+"_data_converter";
        return new Promise((resolve, reject)=>{
            var script = document.createElement('script');
            script.setAttribute("src", converter_path);
            script.onload = function(){
                resolve(converter_name);
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        })
        
    },
    
    
}