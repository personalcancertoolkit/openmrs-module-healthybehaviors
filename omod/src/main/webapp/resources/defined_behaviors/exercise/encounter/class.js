// note, name must be <behavior_id>_Encounter
function Exercise_Encounter(encounter_data){
    this.id = null;
    this.time = null;
    this.formatted_time = null;
    this.performance =  {
        RAPA1 : null,
        RAPA2 : null,
    };
    
    if(typeof encounter_data == "undefined") console.log("undefined encounter_data!!!")
    if(typeof encounter_data == "undefined") return; // return null object, useful for referencing object structure.
    
    this.build_encounter_from_data(encounter_data);
}


Exercise_Encounter.prototype = {
    
    build_encounter_from_data : function(encounter){
        // encounter observations
        if(encounter.observations.length !== 8) return false;
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
        if(rapa1_value < 0) rapa1_value = 0;
        //console.log("total rapa1 = " + rapa1_value);


        // find the total rapa2 value
        if(typeof observations["RAPA2"] === "undefined") return false; // invalid encounter
        var total_rapa2_value = observations["RAPA2"].value;
        if(total_rapa2_value > 1) total_rapa2_value = total_rapa2_value - 1; // both 1 and 2 should be marked "underactive"
        //console.log("total rapa2 = " + total_rapa2_value);

        // set data into data object
        this.id = encounter.id;
        this.time = encounter.datetime;
        this.formatted_time = encounter.datetime_formatted;
        this.performance.RAPA1 = rapa1_value;
        this.performance.RAPA2 = total_rapa2_value;
        //console.log(this.performance);
        //return this_data;
    },
}