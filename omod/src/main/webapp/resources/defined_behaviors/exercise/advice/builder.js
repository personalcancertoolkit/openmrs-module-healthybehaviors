var exercise_advice_display_builder = {
    build_from : function(dom, additional_data){
        // get last encounter
        var encounters = additional_data.encounters;
        encounters.sort((a, b)=>{ return a.time - b.time; }) // sort encounters by time descending
        var last_encounter = encounters[encounters.length-1];
        
        var RAPA1_advice_object = {
            "title" : "Aerobic Activity",
            "body" : this.return_advice_body_for_rapa1(dom, last_encounter),
        }
        var RAPA2_advice_object = {
            "title" : "Muscle Strength",
            "body" : this.return_advice_body_for_rapa2(dom, last_encounter),
        }
        //console.log(RAPA1_advice_object);
        
        return {data : [RAPA1_advice_object, RAPA2_advice_object]};
    },
    
    return_advice_body_for_rapa1 : function(dom, last_encounter){
        // retreive the contents of the RAPA1 div, w/ appropriate labeling 
        var this_performance = last_encounter.performance.RAPA1;
        var mapping_function = [".sedentary", ".underactive",  ".regular", ".active"];
        var this_performance_class = mapping_function[this_performance];
        
        console.log(last_encounter);
        console.log(this_performance);
        console.log(this_performance_class);
        var RAPA1 = jq(dom).find(".RAPA1"); 
        
        // hide all children
        RAPA1.children().each(function () {
            jq(this).css("display", "none"); // "this" is the current element in the loop
        });
        
        // show this status elements
        RAPA1.find(this_performance_class).css("display", "block");
        
        return RAPA1[0];
    },
    
    return_advice_body_for_rapa2 : function(dom, last_encounter){
        // retreive the contents of the RAPA1 div, w/ appropriate labeling 
        var this_performance = last_encounter.performance.RAPA2;
        var mapping_function = [".sedentary", ".underactive",  ".regular", ".active"];
        var this_performance_class = mapping_function[this_performance];
        
        console.log(last_encounter);
        console.log(this_performance);
        console.log(this_performance_class);
        var RAPA1 = jq(dom).find(".RAPA2"); 
        
        // hide all children
        RAPA1.children().each(function () {
            jq(this).css("display", "none"); // "this" is the current element in the loop
        });
        
        // show this status elements
        RAPA1.find(this_performance_class).css("display", "block");
        
        return RAPA1[0];
    },
    
}