///////////////////////////////////
// This class should handle all client side data storage and querying, based on JSON data passed from server.
///////////////////////////////////
function abstract_behavior_class(behavior_data){
    ///////////////////////////
    // Note: Data is explicitly mapped here (as opposed to setting this.data = behavior_data) for maintanance and readability.
    //          This ensures atleast one place where all usable data is explicitly defined and standards can be maintained.
    ///////////////////////////
    
    // turn into an object if data is given as string
    if(typeof behavior_data == "string") behavior_data = JSON.parse(behavior_data);
    
    // define unique identifier
    this.unique_behavior_id = behavior_data.unique_behavior_id;
    
    // define general behavior facts / display information
    this.header_title_text = behavior_data.header_title_text;
    this.advice_type_text = behavior_data.advice_type_text;
    this.header_background_image_src = behavior_data.header_background_image_src;
    this.wow_facts = behavior_data.wow_facts;
    
    // define history/reporting specific data
    this.uptodate = behavior_data.uptodate;
    this.time_interval = behavior_data.time_interval;
    this.chart = behavior_data.chart;
    
    // define advice specific data
    this.personalized_advice = behavior_data.personalized_advice;
}
abstract_behavior_class.prototype = {
    get wow_fact(){
        return "Did you know that "  + this.wow_facts[Math.floor(Math.random() * (this.wow_facts.length))] + "?";
    },
}