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
        var age = parseInt(window.person.age);
        var gender = {"M":"male","F":"female"}[window.person.gender]; // maps gender from M/F to male/female
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
        
        // build the sources tables from json
        var header_template = REL.find(".nutrition_guideline_template .header").clone()
        var info_template = REL.find(".nutrition_guideline_template .info").clone()
        
        var info_holder = REL.find("#nutrition_behavior_guideline_measurement_table .fruits.data")
        var sources = this.nutrient_source.fruit;
        this.append_nutrition_sources_to_table(info_holder, sources, header_template, info_template);
        
        var info_holder = REL.find("#nutrition_behavior_guideline_measurement_table .veges.data")
        var sources = this.nutrient_source.veges;
        this.append_nutrition_sources_to_table(info_holder, sources, header_template, info_template);
        
        var info_holder = REL.find("#nutrition_behavior_guideline_measurement_table .protein.data")
        var sources = this.nutrient_source.protein;
        this.append_nutrition_sources_to_table(info_holder, sources, header_template, info_template);
        
        return REL[0];  
    },
    
    append_nutrition_sources_to_table : function(info_table, sources, header_template, info_template){
        Object.keys(sources).forEach((source)=>{
            // build header
            let this_header = header_template.clone();
            this_header.html(source);
            info_table.append(this_header);
            
            // build each example
            let these_amounts = sources[source];
            these_amounts.forEach((amount)=>{
                let this_amount = info_template.clone();
                this_amount.html(amount);
                info_table.append(this_amount);
            })
        })
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
    
    
    nutrient_source : {
        fruit : { // https://www.choosemyplate.gov/fruit
            "Apple" : [
                '½ large (3 ¼ inch diameter)',
                '1 small (2 ¼" diameter)',
                '1 cup, sliced or chopped, raw or cooked'
            ],
            "Applesauce" : [
                '1 cup',
            ],
            "Banana" : [
                '1 cup, sliced',
                '1 large (8" to 9" long)',
            ],
            "Cantaloupe" : [
                '1 cup, diced or melon balls',
            ],
            "Grapes" : [
                '1 cup, whole or cut-up',
                '32 seedless grapes',
            ],
            "Grapefruit" : [
                '1 medium (4" diameter)',
                '1 cup, sections',
            ],
            "Mixed fruit (fruit cocktail)" : [
                '1 cup, diced or sliced, raw or canned, drained',
            ],
            "Orange" : [
                '1 large (3 1/16" diameter)',
                '1 cup, sections',
            ],
            "Orange, mandarin" : [
                '1 cup, canned, drained',
            ],
            "Peach" : [
                '1 large (2 ¾" diameter)',
                '1 cup, sliced or diced, raw, cooked, or canned, drained',
                '2 halves, canned',
            ],
            "Pear" : [
                '1 medium pear (2 ½ per lb)',
                '1 cup, sliced or diced, raw cooked, or canned, drained',
            ],
            "Pineapple" : [
                '1 cup, chunks, sliced or crushed, raw, cooked or canned, drained',
            ],
            "Plum" : [
                '1 cup, sliced raw or cooked',
                '3 medium or 2 large plums',
            ],
            "Strawberries" : [
                'About 8 large berries',
                '1 cup, whole, halved, or sliced, fresh or frozen',
            ],
            "Watermelon" : [
                '1 small (1" thick)',
                '1 cup, diced or balls',
            ],
            "Dried fruit (raisins, prunes, apricots, etc.)" : [
                '½ cup dried fruit',
            ],
            "100% fruit juice (orange, apple, grape, grapefruit, etc.)" : [
                '1 cup',
            ],
            
        }, 
        veges : { // https://www.choosemyplate.gov/vegetables
            "Broccoli" : [
                '1 cup, chopped or florets', 
                '3 spears 5" long raw or cooked', 
            ],
            "Greens (collards, mustard greens, turnip greens, kale)" : [
                '1 cup, cooked', 
            ],
            "Spinach" : [
                '1 cup, cooked', 
                '2 cups, raw', 
            ],
            "Raw leafy greens: Spinach, romaine, watercress, dark green leafy lettuce, endive, escarole" : [
                '2 cups, raw', 
            ],
            "Carrots" : [
                '1 cup, strips, slices, or chopped, raw or cooked', 
                '2 medium', 
                '1 cup baby carrots (about 12)', 
            ],
            "Pumpkin" : [
                '1 cup, mashed, cooked', 
            ],
            "Red peppers" : [
                '1 cup, chopped, raw, or cooked', 
                '1 large pepper (3" diameter, 3 3/4" long)', 
            ],
            "Tomatoes" : [
                '1 large raw whole (3")', 
                '1 cup, chopped or sliced, raw, canned, or cooked', 
            ],
            "Tomato juice" : [
                '1 cup', 
            ],
            "Sweet potato" : [
                '1 large baked (2 ¼" or more diameter)', 
                '1 cup, sliced or mashed, cooked', 
            ],
            "Winter squash (acorn, butternut, hubbard)" : [
                '1 cup, cubed, cooked', 
            ],
            "Dry beans and peas (such as black, garbanzo, kidney, pinto, or soy beans, or black-eyed peas or split peas)" : [
                '1 cup, whole or mashed, cooked', 
            ],
            "Corn, yellow or white" : [
                '1 cup', 
                '1 large ear (8" to 9" long)', 
            ],
            "Green peas" : [
                '1 cup', 
            ],
            "White potatoes" : [
                '1 cup, diced, mashed', 
                '1 medium boiled or baked potato (2 ½" to 3" diameter)', 
            ],
            "Bean sprouts" : [
                '1 cup, cooked', 
            ],
            "Cabbage, green" : [
                '1 cup, chopped or shredded raw or cooked', 
            ],
            "Cauliflower" : [
                '1 cup, pieces or florets raw or cooked', 
            ],
            "Celery" : [
                '1 cup, diced or sliced, raw or cooked', 
                '2 large stalks (11" to 12" long)', 
            ],
            "Cucumbers" : [
                '1 cup, raw, sliced or chopped', 
            ],
            "Green or wax beans" : [
                '1 cup, cooked', 
            ],
            "Green peppers" : [
                '1 cup, chopped, raw or cooked', 
                '1 large pepper (3" diameter, 3 ¾" long)', 
            ],
            "Lettuce, iceberg or head" : [
                '2 cups, raw, shredded or chopped', 
            ],
            "Mushrooms" : [
                '1 cup, raw or cooked', 
            ],
            "Onions" : [
                '1 cup, chopped, raw or cooked', 
            ],
            "Summer squash or zucchini" : [
                '1 cup, cooked, sliced or diced', 
            ],
        },
        protein : { //https://www.choosemyplate.gov/protein-foods
            "Meats" : [
                "1 ounce cooked lean beef",
                "1 ounce cooked lean pork or ham",
            ],
            "Poultry" : [
                "1 ounce cooked chicken or turkey, without skin",
                '1 sandwich slice of turkey (4 ½" x 2 ½" x 1/8")',
            ],
            "Seafood" : [
                "1 ounce cooked fish or shell fish",
            ],
            "Eggs" : [
                "1 egg",
            ],
            "Nuts and seeds" : [
                "½ ounce of nuts (12 almonds, 24 pistachios, 7 walnut halves)",
                "½ ounce of seeds (pumpkin, sunflower, or squash seeds, hulled, roasted)",
                "1 Tablespoon of peanut butter or almond butter",
            ],
            "Beans and peas" : [
                "¼ cup of cooked beans (such as black, kidney, pinto, or white beans)",
                "¼ cup of cooked peas (such as chickpeas, cowpeas, lentils, or split peas)",
                "¼ cup of baked beans, refried beans",
                "¼ cup (about 2 ounces) of tofu",
                "1 ox. tempeh, cooked",
                '¼ cup roasted soybeans 1 falafel patty (2 ¼", 4 oz)',
                "2 Tablespoons hummus",
            ],
        }
            
        
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