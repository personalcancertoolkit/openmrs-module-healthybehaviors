///////////////////////////////////
// This class should handle all client side data storage and UI generation, based on JSON data passed from server.
///////////////////////////////////
function abstract_behavior_class(){
    this.wow_facts = [];
    
}
abstract_behavior_class.prototype = {
    get wow_fact(){
        return "Did you know that "  + this.wow_facts[Math.floor(Math.random() * (this.wow_facts.length))] + "?";
    },
}