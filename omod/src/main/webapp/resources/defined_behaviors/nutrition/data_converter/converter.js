/*
    note, the name of this object must be <unique_behavior_id>_data_converter
    
    this object needs to be able to take encounters and transform them into "performance" metrics which can be dispalyed by the graph.
    
    performance metrics need to return {id : "", time : "", performance : {} }
*/
var nutrition_data_converter = {
    
    null_performance_object : { // null performance object is used outside of this object in order to missing records
        "Veggies Eaten" : null,
        "Fast Food Eaten" : null,
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
        
        
        // set data into data object
        this_data.id = encounter.id;
        this_data.time = encounter.datetime;
        this_data.formatted_time = encounter.datetime_formatted;
        //console.log(this_data);
        return this_data;
    },
    
}