/*
    note, the name of this object must be <unique_behavior_id>_data_converter
    
    this object needs to be able to take encounters and transform them into "performance" metrics which can be dispalyed by the graph.
*/
var exercise_data_converter = {
    
    transform_encounters_into_history : function(encounters){
        /*

            "history" : {
                "time": ["-9 W", "-8 W", "-7 W", "-6 W", "-5 W", "-4 Week", "-3 Week", "-2 Week", "Last Week"],
                "performance" : {
                    "RAPA1": [0, 3, 1, 2, 4, null, 7, 12, 9],
                    "RAPA2": [5, 2, 3, 4, 3, null, 2,  0, 1]
                }
            },
    
        */
        /*
        
        */
        
        console.log(encounters);
        
        var transformed_data = [];
        for(var i = 0; i < encounters.length; i++){
            console.log("another encounter starts here............");
            var this_transformed_data = this.transform_an_encounter(encounters[i]);
            if(this_transformed_data == false) continue; // not a full encounter
            transformed_data.push(this_transformed_data);
        }
        
        console.log(transformed_data);
        
    },
    
    transform_an_encounter : function(encounter){
        var data = {
            time : null,
            performance : {
                RAPA1 : null,
                RAPA2 : null,
            }
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
        console.log(observations);

        // find the highest rapa value that is available for rapa1_x
        var highest_rapa1_value = 0;
        for(i = 1; i < 8; i++){
            var this_key = "RAPA1_q"+i;
            console.log(this_key);
            console.log(observations[this_key].value);
            if(observations[this_key].value === "true") highest_rapa1_value = i;
        }
        //console.log("highest rapa1 = " + highest_rapa1_value);

        
        // find the total rapa2 value
        var total_rapa2_value = 0;
        for(i = 1; i < 3; i++){
            var this_key = "RAPA2_q"+i;
            console.log(this_key);
            console.log(observations[this_key].value);
            if(observations[this_key].value === "true") total_rapa2_value += i;
        }
        //console.log("total rapa2 = " + total_rapa2_value);
        
        // set data into data object
        data.time = encounter.encounter_datetime;
        data.performance.RAPA1 = highest_rapa1_value;
        data.performance.RAPA2 = total_rapa2_value;
        return data;
    },
    
}