/*
    note, the name of this object must be <unique_behavior_id>_data_converter
    
    this object needs to be able to take encounters and transform them into "performance" metrics which can be dispalyed by the graph.
    
    performance metrics need to return {id : "", time : "", performance : {} }
*/
var exercise_data_converter = {
    
    null_performance_object : { // null performance object is used outside of this object in order to missing records
        RAPA1 : null,
        RAPA2 : null,
    }, 
    
    
    transform_encounters_into_encounter_performance_data : function(encounters){
        // transform encounters into time+performance data
        var transformed_data = [];
        for(var i = 0; i < encounters.length; i++){
            //console.log("another encounter starts here............");
            var this_encounter = encounters[i];
            var this_transformed_data = this.transform_an_encounter(this_encounter);
            if(this_transformed_data == false) {
                console.warn("Invalid data was returned as an encounter for exercise history...");
                continue; // not a full encounter
            }
            transformed_data.push(this_transformed_data);
        }
        
        return transformed_data;
    },
    
   
    
    transform_an_encounter : function(encounter){
        var this_data = {
            id : null,
            time : null,
            performance : JSON.parse(JSON.stringify(this.null_performance_object)),
        }
        
        // encounter observations
        if(encounter.observations.length < 9) return false;
        //console.log("observations are longer than 9 !!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //console.log(encounter.observations);

        // create an object of observations keyed by concept
        var observation_keys = encounter.observations.map(function(a) {return a.concept;});
        var observations = {};
        for(var i = 0; i < observation_keys.length; i++){
            var this_observation_data = encounter.observations[i]; 
            //console.log("observation for id = " + this_observation_data);
            //console.log(this_observation_data);
            observations[observation_keys[i]] = encounter.observations[i]; 
        }
        //console.log(observations);

        // find the highest rapa value that is available for rapa1_x
        var highest_rapa1_value = 0;
        for(i = 1; i < 8; i++){
            var this_key = "RAPA1_q"+i;
            //console.log(this_key + " = " + observations[this_key].value);
            if(observations[this_key].value === "true") highest_rapa1_value = i;
        }
        //console.log("highest rapa1 = " + highest_rapa1_value);
        // note, ["sedentary", "under-active", "under-active", "regular", "regular", "active", "active"], must be equal to ["sedentary", "under-active",  "regular", "active"],
        var final_rapa1 = ["sedentary", "under-active",  "regular", "active"];
        var initial_rapa1 = ["sedentary", "under-active", "under-active", "regular", "regular", "active", "active"];
        var rapa1_value = final_rapa1.indexOf(initial_rapa1[highest_rapa1_value - 1]);
        
        
        // find the total rapa2 value
        var total_rapa2_value = 0;
        for(i = 1; i < 3; i++){
            var this_key = "RAPA2_q"+i;
            //console.log(this_key + " = " + observations[this_key].value);
            if(observations[this_key].value === "true") total_rapa2_value += i;
        }
        //console.log("total rapa2 = " + total_rapa2_value);
        
        // set data into data object
        this_data.id = encounter.id;
        this_data.time = encounter.datetime;
        this_data.formatted_time = encounter.datetime_formatted;
        this_data.performance.RAPA1 = rapa1_value;
        this_data.performance.RAPA2 = total_rapa2_value;
        //console.log(this_data);
        return this_data;
    },
    
}