var exercise_form_DOM_builder = {
    holder : null,
    template : {
        question : null,
    },
    data : null, // i.e., concepts
    encounter_type : null,

    initialize : function(){
        // assign to object properties
        this.simpleform = document.getElementById("exercise_simpleform_element"),
        this.holder = document.getElementById("exercise_form_question_holder"),
        this.template = {
            question : document.getElementById("exercise_form_template_question"),
        };
        this.submission_button = document.getElementById("exercise_form_submission_button");
        
        // set required attributes
        this.submission_button.onclick = function(unique_identifier){
            simpleformservice.simple_submission.submit_encounter(this.encounter_type.unique_identifier, function(){})
        }.bind(this);
        jq(this.simpleform).attr("encounter_type", this.encounter_type.unique_identifier);
    },

    build : function(){
        var data = this.data;
        for(var i = 0; i < data.length; i++){
            //console.log("row " + i);
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
        jq(row_element).find(".yes_radio").attr("name", "boolean_for_concept-"+row_data.unique_identifier);
        jq(row_element).find(".no_radio").attr("name", "boolean_for_concept-"+row_data.unique_identifier);
        
        // update the identifiers for the radio buttons, so that labels trigger their respective radio buttons correctly
        jq(row_element).find(".yes_radio").attr("id", "yes_boolean_for_concept-"+row_data.unique_identifier);
        jq(row_element).find(".yes_radio+label").attr("for", "yes_boolean_for_concept-"+row_data.unique_identifier);
        
        jq(row_element).find(".no_radio").attr("id", "no_boolean_for_concept-"+row_data.unique_identifier);
        jq(row_element).find(".no_radio+label").attr("for", "no_boolean_for_concept-"+row_data.unique_identifier);

        return row_element;
    },
}