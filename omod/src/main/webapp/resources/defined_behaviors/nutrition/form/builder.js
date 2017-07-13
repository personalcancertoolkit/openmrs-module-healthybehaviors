var nutrition_form_display_builder = {
    holder : null,
    template : {
        question : null,
    },
    data : [
        {
            title : "Fruits and Vegetables",
            data : [
                {
                    "unique_identifier" : "NUTRI_FV_q1",
                    "text" : "Fruit juice, like orange, apple, grape, fresh, frozen, or canned. (Not sodas or other drinks)",
                },
                {
                    "unique_identifier" : "NUTRI_FV_q2",
                    "text" : "Fruit, fresh or canned",
                },
                {
                    "unique_identifier" : "NUTRI_FV_q3",
                    "text" : "Vegetable juice, like tomato juice, V-8, carrot",
                },
                {
                    "unique_identifier" : "NUTRI_FV_q4",
                    "text" : "Green salad",
                },
                {
                    "unique_identifier" : "NUTRI_FV_q5",
                    "text" : "Potatoes, any kind, including baked, mashed, or french fried",
                },
                {
                    "unique_identifier" : "NUTRI_FV_q6",
                    "text" : "Vegetable soup, or stew with vegetables",
                },
                {
                    "unique_identifier" : "NUTRI_FV_q7",
                    "text" : "Any other vegetables, including string beans, peas, corn, broccoli, or any other kind",
                },
            ]
        }, 
        {
            title : "Meats and Snacks",
            data : [
                {
                    "unique_identifier" : "NUTRI_MS_q1",
                    "text" : "Hamburgers, groud beef, meat burritos, tacos",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q2",
                    "text" : "Beef or pork, such as steaks, roasts, ribs, or in sandwiches",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q3",
                    "text" : "Fried chicken",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q4",
                    "text" : "Hot dogs, or Polish or Italian sausage",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q5",
                    "text" : "Cold cuts, lunch meats, ham (not low-fat)",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q6",
                    "text" : "Bacon or breakfast sausage",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q7",
                    "text" : "Salad dressings (not low-fat)",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q8",
                    "text" : "Margarine, butter, or mayo on bread or potatoes",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q9",
                    "text" : "Margarine, butter, or oil in cooking",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q10",
                    "text" : "Eggs (not Egg Beaters or just egg whites)",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q11",
                    "text" : "Pizza",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q12",
                    "text" : "Cheese, cheese spread (not low-fat)",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q13",
                    "text" : "Whole milk",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q14",
                    "text" : "French fries, fried potatoes",
                },
                {
                    "unique_identifier" : "NUTRI_MS_q15",
                    "text" : "Corn chips, potato chips, popcorn, crackers",
                },
            ]
        }, 
    ], // i.e., concepts
    encounter_type : "exercise_form",
    
    
    build_from : function(dom){
        // assign to object properties
        this.simpleform = dom.querySelector("#exercise_simpleform_element");
        this.holder = dom.querySelector("#exercise_form_question_holder");
        this.template = {
            question : dom.querySelector("#exercise_form_template_question"),
            heading : dom.querySelector("#exercise_form_template_questiontype_heading"),
        };
        this.submission_button = dom.querySelector("#exercise_form_submission_button");
        
        // set overarching dom properties
        this.submission_button.onclick = function(unique_identifier){
            simpleformservice.simple_submission.submit_encounter(this.encounter_type, function(server_response){
                if(server_response == "SCS"){
                    window.location.href = "adviceAndHistory.page?behavior=exercise";
                }
            });
        }.bind(this);
        jq(this.simpleform).attr("encounter_type", this.encounter_type);
        var data = this.data;
        for(var i = 0; i < data.length; i++){
            var this_screener = data[i];
            this.build_each_row_for_screener_type(this_screener);
        }
        
        // return resultant dom
        return {dom : dom};
    },
    
    build_each_row_for_screener_type : function(screener){

        var heading_element = this.create_heading_from_data(screener.title); 
        this.holder.appendChild(heading_element);
        
        var data = screener.data;
        
        // build each row
        for(var i = 0; i < data.length; i++){
            var this_row_data = data[i];
            var row_element = this.create_row_from_data(this_row_data); 
            this.holder.appendChild(row_element);
        }
    
    },
    
    create_row_from_data : function(row_data){
        // create deep clone of node
        //console.log(this.template.question);
        var row_element = this.template.question.cloneNode(true);

        // add concept id
        jq(row_element).attr("concept", row_data.unique_identifier);

        // update question text
        jq(row_element).find(".question_text").html(row_data.text)
        
        // update the names for the radio buttons so that they mutually exclude only eachother
        jq(row_element).find("input").attr("name", function() { return $(this).attr("name") + row_data.unique_identifier  });
        
        // update the identifiers for the radio buttons, so that labels trigger their respective radio buttons correctly
        jq(row_element).find("input").attr("id", function() { return $(this).attr("id") + row_data.unique_identifier  });
        jq(row_element).find("input+label").attr("for", function() { return $(this).attr("for") + row_data.unique_identifier  });
        
        return row_element;
    },
    
    create_heading_from_data : function(heading){
        // create deep clone of node
        var element = this.template.heading.cloneNode(true);
        
        element.innerHTML = heading;
        
        return element;
    }
}