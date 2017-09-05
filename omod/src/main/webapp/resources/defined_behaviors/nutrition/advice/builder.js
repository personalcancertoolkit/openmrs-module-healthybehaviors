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
        // get patient data
        var age = 21;
        var gender = "male";
        // get age group
        if(age > 50)
            var age_group = "age_51plus";
        else if(age > 30)
            var age_group = "age_31to50";
        else if(age > 18)
            var age_group = "age_19to30";
        else if(age > 13) 
            var age_group = "age_14to18";
        else if(age > 8)
            var age_group = "age_9to13";
        else if(age > 3)
            var age_group = "age_4to8";
        else if (age > 1) 
            var age_group = "age_2to3";
        else 
            var age_group = false; // dont display incorrect data
        // get recommended values
        var daily_value_fruits = (age_group !== false)? this.guidelines.fruit[gender][age_group] : "unknown";
        var daily_value_veges = (age_group !== false)? this.guidelines.veges[gender][age_group] : "unknown";
        var daily_value_protein = (age_group !== false)? this.guidelines.protein[gender][age_group] : "unknown";
        
        // narrow down relevant dom
        var REL = jq(dom).find(".GUIDELINES"); 

        // update up based on patient data
        REL.find(".age").text(age);
        REL.find(".gender").text(gender);
        REL.find(".daily_value_fruits").text(daily_value_fruits);
        REL.find(".daily_value_veges").text(daily_value_veges);
        REL.find(".daily_value_protein").text(daily_value_protein);
        
        // define an object which can be used to handle DOM of the additional data
        window["nutrition_advice_daily_value_source_handler"] = {
            display : function(which){
                var root_ele = document.querySelector("#nutrition_behavior_guideline_measurement_table");
                
                // display relevant part only
                jq(root_ele).find(".nutrient").hide();
                jq(root_ele).find("."+which).show()
                
                // show root element
                root_ele.style.display = "flex";
            }
        }
        
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
    
    
    
    // static data
    guidelines : {
        fruit : { // https://www.choosemyplate.gov/fruit
            male : {
                age_2to3 : "1 cup",
                age_4to8 : "1 to 1 ½ cups",
                age_9to13 : "1 ½ cups",
                age_14to18 : "2 cups",
                age_19to30 : "2 cups",
                age_31to50 : "2 cups",
                age_51plus : "2 cups",
            }, 
            female : {
                age_2to3 : "1 cup",
                age_4to8 : "1 to 1 ½ cups",
                age_9to13 : "1 ½ cups",
                age_14to18 : "1 ½ cups",
                age_19to30 : "2 cups",
                age_31to50 : "1 ½ cups",
                age_51plus : "1 ½ cups",
            }
        },
        veges : { // https://www.choosemyplate.gov/vegetables
            male : {
                age_2to3 : "1 cup",
                age_4to8 : "1 ½ cups",
                age_9to13 : "2 ½ cups",
                age_14to18 : "3 cups",
                age_19to30 : "3 cups",
                age_31to50 : "3 cups",
                age_51plus : "2 ½ cups",
            }, 
            female : {
                age_2to3 : "1 cup",
                age_4to8 : "1 ½ cups",
                age_9to13 : "2 cups",
                age_14to18 : "2 ½ cups",
                age_19to30 : "2 ½ cups",
                age_31to50 : "2 ½ cups",
                age_51plus : "2 cups",
            }
        },
        protein : { // https://www.choosemyplate.gov/protein-foods
            male : {
                age_2to3 : "2 ounce equivalents",
                age_4to8 : "4 ounce equivalents",
                age_9to13 : "5 ounce equivalents",
                age_14to18 : "6 ½ ounce equivalents",
                age_19to30 : "6 ½ ounce equivalents",
                age_31to50 : "6 ounce equivalents",
                age_51plus : "5 ½ ounce equivalents",
            }, 
            female : {
                age_2to3 : "2 ounce equivalents",
                age_4to8 : "4 ounce equivalents",
                age_9to13 : "5 ounce equivalents",
                age_14to18 : "5 ounce equivalents",
                age_19to30 : "5 ½ ounce equivalents",
                age_31to50 : "5 ounce equivalents",
                age_51plus : "5 ounce equivalents",
            }
        },
    },
    
}