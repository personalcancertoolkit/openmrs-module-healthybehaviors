var exercise_form_display_builder = {
    holder : null,
    template : {
        question : null,
    },
    data : [
        {
            "unique_identifier" : "RAPA1_q1",
            "text" : "I rarely or never do physical activities",
            "datatype" : "BIT"
        },
        {
            "unique_identifier" : "RAPA1_q2",
            "text" : "I do some <b>light</b> or <b>moderate</b> physical activities, but not every week.",
            "datatype" : "BIT"
        },
        {
            "unique_identifier" : "RAPA1_q3",
            "text" : "I do some <b>light</b> physical activity every week.",
            "datatype" : "BIT"
        },
        {
            "unique_identifier" : "RAPA1_q4",
            "text" : "I do <b>moderate</b> physical activities every week, but less than 30 minutes a day or 5 days a week.",
            "datatype" : "BIT"
        },
        {
            "unique_identifier" : "RAPA1_q5",
            "text" : "I do <b>vigorous</b> physical activities every week, but less than 20 minutes a day or 3 days a week.",
            "datatype" : "BIT"
        },
        {
            "unique_identifier" : "RAPA1_q6",
            "text" : "I do 30 minutes or more a day of <b>moderate</b> physical activities, 5 or more days a week.",
            "datatype" : "BIT"
        },
        {
            "unique_identifier" : "RAPA1_q7",
            "text" : "I do 20 minutes or more a day of <b>vigorous</b> physical activities, 3 or more days a week.",
            "datatype" : "BIT"
        },
        {
            "unique_identifier" : "RAPA2",
            "text" : "I do activities to increase <b>muscle strength</b>, such as lifting weights or calisthenics. ",
            "datatype" : "MULTI"
        },
    ], // i.e., concepts
    encounter_type : "exercise_form",
    
    
    build_from : function(dom){
        // assign to object properties
        this.simpleform = dom.querySelector("#exercise_simpleform_element");
        this.holder = dom.querySelector("#exercise_form_question_holder");
        this.template = {
            question : {
                binary : dom.querySelector("#exercise_form_template_question_binary"),
                multi : dom.querySelector("#exercise_form_template_question_multi"),  
            },
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
        
        
        // build each row
        var data = this.data;
        for(var i = 0; i < data.length; i++){
            //console.log("row " + i);
            if(i == 0){
                var heading_element = this.create_heading_from_data("Aerobic Activity"); 
                this.holder.appendChild(heading_element);
            }
            if(i == 7){
                var heading_element = this.create_heading_from_data("Strength and Flexibility"); 
                this.holder.appendChild(heading_element);
            }
            
            var this_row_data = data[i];
            if(this_row_data.datatype == "BIT") var row_element = this.create_binary_row_from_data(this_row_data); 
            if(this_row_data.datatype == "MULTI") var row_element = this.create_multi_row_from_data(this_row_data); 
            this.holder.appendChild(row_element);
        }
    
        return {dom : dom};
    },
    
    create_binary_row_from_data : function(row_data){
        // create deep clone of node
        //console.log(this.template.question);
        var row_element = this.template.question.binary.cloneNode(true);

        // add concept id
        jq(row_element).attr("concept", row_data.unique_identifier);

        // update question text
        jq(row_element).find(".question_text").html(row_data.text)
        
        // update the names for the radio buttons so that they mutually exclude only eachother
        jq(row_element).find(".yes_radio").attr("name", "boolean_for_concept-"+row_data.unique_identifier);
        jq(row_element).find(".no_radio").attr("name", "boolean_for_concept-"+row_data.unique_identifier);
        
        // update the identifiers for the radio buttons, so that labels trigger their respective radio buttons correctly
        jq(row_element).find(".yes_radio").attr("id", "yes_boolean_for_concept-"+row_data.unique_identifier);
        jq(row_element).find(".yes_radio+label").attr("for", "yes_boolean_for_concept-"+row_data.unique_identifier);
        
        jq(row_element).find(".no_radio").attr("id", "no_boolean_for_concept-"+row_data.unique_identifier);
        jq(row_element).find(".no_radio+label").attr("for", "no_boolean_for_concept-"+row_data.unique_identifier);

        return row_element;
    },
    
    create_multi_row_from_data : function(row_data){
        // create deep clone of node
        //console.log(this.template.question);
        var row_element = this.template.question.multi.cloneNode(true);

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
        
        element.querySelector(".heading_text").innerHTML = heading;
        
        return element;
    }
}