var nutrition_advice_display_builder = {
    build_from : function(dom, additional_data){
        // get last encounter
        var encounters = additional_data.encounters;
        encounters.sort((a, b)=>{ return a.time - b.time; }) // sort encounters by time descending
        var last_encounter = encounters[encounters.length-1];
        if(last_encounter == null) return {data : null};
        
        var veges_advice_object = {
            "title" : "Fruits and Vegetables",
            "body" : this.return_advice_body_for_veges(dom, last_encounter),
        }
        var meat_advice_object = {
            "title" : "Meat and Snacks",
            "body" : this.return_advice_body_for_meat(dom, last_encounter),
        }
        var guidelines_advice_object = {
            "title" : "Guidelines",
            "body" : this.return_advice_body_for_guidelines(dom),
        }
        
        return {data : [veges_advice_object, meat_advice_object, guidelines_advice_object]};
    },
    
    return_advice_body_for_guidelines : function(dom){
        
        // narrow down relevant dom
        var REL = jq(dom).find(".GUIDELINES"); 
        
        return REL[0];  
    },
    
    return_advice_body_for_veges : function(dom, last_encounter){
        if(typeof last_encounter === "undefined" || last_encounter == null) return null;
        var this_performance = last_encounter.performance.fruits_and_veges_raw;
        
        // derive performance class from data
        if(this_performance < 11){
            var this_performance_class = ".bad";   
        } else {
            var this_performance_class = ".good";
        }
        
        // narrow down relevant dom
        var REL = jq(dom).find(".VEGES"); 
        
        // hide all children
        REL.children().each(function () {
            jq(this).css("display", "none"); // "this" is the current element in the loop
        });
        
        // show this status elements
        REL.find(this_performance_class).css("display", "block");
        
        return REL[0];
    },
    
    return_advice_body_for_meat : function(dom, last_encounter){
        if(typeof last_encounter === "undefined" || last_encounter == null) return null;
        var this_performance = last_encounter.performance.fruits_and_veges_raw;
        
        // derive performance class from data
        if(this_performance > 22){
            var this_performance_class = ".bad";   
        } else {
            var this_performance_class = ".good";
        }
        
        // narrow down relevant dom
        var REL = jq(dom).find(".MEATS"); 
        
        // hide all children
        REL.children().each(function () {
            jq(this).css("display", "none"); // "this" is the current element in the loop
        });
        
        // show this status elements
        REL.find(this_performance_class).css("display", "block");
        
        return REL[0];
    },
    
}