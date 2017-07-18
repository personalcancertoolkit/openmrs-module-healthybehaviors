// note, name must be <behavior_id>_Encounter
function Nutrition_Encounter(encounter_data){
    console.log(encounter_data);
    this.performance = this.transform_encounter_into_performance(encounter_data);
}


Nutrition_Encounter.prototype = {
    transform_encounter_into_performance : function(encounter_data){
        return "great";
    },
}