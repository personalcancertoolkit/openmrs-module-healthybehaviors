// note, name must be <behavior_id>_Encounter
function Nutrition_Encounter(encounter_data){
    this.id = null;
    this.time = null;
    this.formatted_time = null;
    this.performance =  {
        veges : null,
        fat : null,
    };
    
    if(typeof encounter_data == "undefined") console.log("undefined encounter_data!!!")
    if(typeof encounter_data == "undefined") return; // return null object, useful for referencing object structure.
    
    this.build_encounter_from_data(encounter_data);
}


Nutrition_Encounter.prototype = {
    
    build_encounter_from_data : function(encounter){
        // encounter observations
        if(encounter.observations.length < 22) return false;
        //console.log("observations are longer than 9 !!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //console.log(encounter.observations);

        // split the observations by fruits_and_veges and meat_and_snacks
        var fruits_and_veges = [];
        var meat_and_snacks = [];
        encounter.observations.forEach((obs)=>{
            if(obs.concept.substring(0,8) == "NUTRI_FV") return fruits_and_veges.push(obs);
            if(obs.concept.substring(0,8) == "NUTRI_MS") return meat_and_snacks.push(obs);
            console.warn("observation with concept ("+obs.concept+") does not fit into fruits_and_veges or meat_and_snacks");
        })
        //console.log(fruits_and_veges);
        //console.log(meat_and_snacks);

        
        // fruits and veges, add up the values
        //      note, simpleformservice returns "0" as false and "1" as true
        var fruits_and_veges_threshold = 11;
        var fruits_and_veges_max_score = 5*7 - fruits_and_veges_threshold; // 5 points / question * 7 questions - threshold
        var fruits_and_veges_min_score = fruits_and_veges_threshold - 0; // 
        var fruits_and_veges_score = 0;
        fruits_and_veges.forEach((obs)=>{
            var value = this.map_observation_to_value(obs);
            fruits_and_veges_score += value;
        })
        // store raw score, before data normalization and cleanup
        fruits_and_veges_score_raw = fruits_and_veges_score;
        
        // center the score around threshold, s.t. when score below threshold its negative and above its positive
        fruits_and_veges_score = fruits_and_veges_score - fruits_and_veges_threshold;
        
        // normalize the score relative to max score, s.t. max_score = 1 and min_score = -1
        if(fruits_and_veges_score > 0){
            fruits_and_veges_score = fruits_and_veges_score / fruits_and_veges_max_score;
        } else {
            fruits_and_veges_score = fruits_and_veges_score / fruits_and_veges_min_score;
        }
        
        // make max score out of 100
        fruits_and_veges_score = fruits_and_veges_score * 100;
        
        // move score into positive scale and rescale to from 0 to 100, to remove clear threshold from graph
        fruits_and_veges_score = (fruits_and_veges_score + 100)/2;
        
        // round to one decimal
        fruits_and_veges_score = Math.round( fruits_and_veges_score * 10 ) / 10;
        
        //console.log("Final score = " + fruits_and_veges_score);
        
        
        // meats and snacks, add up the values and then negate
        //      note, simpleformservice returns "0" as false and "1" as true
        var meat_and_snacks_threshold = 22;
        var meat_and_snacks_max_score = meat_and_snacks_threshold - 0; // max score = threshold - 0, since points decrease performance
        var meat_and_snacks_min_score = 15*5 - meat_and_snacks_threshold; // since negative score is greater than max positive score, scale the negative score to be from 0 to -1
        var meat_and_snacks_score = 0;
        meat_and_snacks.forEach((obs)=>{
            var value = this.map_observation_to_value(obs);
            meat_and_snacks_score += value;
        })
        // store raw score, before data normalization and cleanup
        meat_and_snacks_score_raw = meat_and_snacks_score;
        console.log("raw : " + meat_and_snacks_score_raw);
        
        // center the score around threshold, s.t. when score below threshold its positive and above its negative (threshold is a max limit in this case)
        meat_and_snacks_score = meat_and_snacks_threshold - meat_and_snacks_score;
        console.log("centered : " + meat_and_snacks_score);
        
        // normalize the score relative to max score, s.t. max_score = 1 and min_score = -1
        if(meat_and_snacks_score > 0){
            meat_and_snacks_score = meat_and_snacks_score / meat_and_snacks_max_score;
        } else {
            meat_and_snacks_score = meat_and_snacks_score / meat_and_snacks_min_score;
        }
        
        // make max score out of -100 to 100
        meat_and_snacks_score = meat_and_snacks_score * 100;
        
        // move score into positive scale and rescale to from 0 to 100, to remove clear threshold from graph
        meat_and_snacks_score = (meat_and_snacks_score + 100)/2;
        
        // round to one decimal
        meat_and_snacks_score = Math.round( meat_and_snacks_score * 10 ) / 10;
        
        
        
        //console.log("Final score = " + meat_and_snacks_score);
        
        
        // set data into data object
        this.id = encounter.id;
        this.time = encounter.datetime;
        this.formatted_time = encounter.datetime_formatted;
        this.performance.fruits_and_veges = fruits_and_veges_score;
        this.performance.meat_and_snacks = meat_and_snacks_score;
        
        // append additional stats
        this.performance.fruits_and_veges_raw = fruits_and_veges_score_raw;
        this.performance.meat_and_snacks_raw = meat_and_snacks_score_raw;
        //console.log(this_data);
        //return this_data;
    },
    map_observation_to_value : function(obs){
        if(obs.datatype == "BIT" && obs.value == "false") var value = 0;
        if(obs.datatype == "BIT" && obs.value == "true") var value = 1;
        if(obs.datatype == "ST") var value = parseInt(obs.value);
        //console.log( obs.value + " maps to a value of " + value);
        return value;
    }
}