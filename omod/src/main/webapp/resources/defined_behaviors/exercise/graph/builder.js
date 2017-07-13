var exercise_graph_display_builder = {
    holder : null,
    template : {
        row : null,
        example : null,
        bull : null,
    },
    data : null, // defined in this file further below
    chart_static :  {
        "type" : "line",
        "options" :  {
            "responsive" : true,
            "yaxis_to_text_mapping_array" : ["sedentary", "under-active", "regular", "active"],
            "scales": {
                "yAxes": [{
                    "ticks": {
                        "beginAtZero": true,
                        "stepSize":1,
                        "maxTicksLimit": 4, 
                        "beginAtZero":true
                    }
                }]
            }
        },
        "dataset_options" : [
            {
                "label" : "Aerobic",
                "performance_identifier": "RAPA1",
                "backgroundColor": [
                    "rgba(99, 255, 135, 0.2)"
                ],
                "borderColor": [
                    "rgb(99, 255, 135)"
                ],
                "borderWidth": 1
            },
            {
                "label": "Strength and Flexibility",
                "performance_identifier": "RAPA2",
                "backgroundColor": [
                    "rgba(255, 62, 62, 0.1)"
                ],
                "borderColor": [
                    "rgb(255, 62, 62)"
                ],
                "borderWidth": 1
            }
        ]
    },

    build_from : function(dom, additional_data){
        console.log(additional_data);
        
        var bool_just_a_preview = additional_data.preview;
        var encounters = additional_data.encounters;
        this.time_interval = additional_data.time_interval;
        

        // convert encounters to performance data and then into history
        encounter_null_performance = this.data_converter.null_performance_object;
        this.encounter_null_performance = encounter_null_performance;
        encounter_performance_data = this.data_converter.transform_encounters_into_encounter_performance_data(encounters);
        performance_history = this.organize_encounter_performance_data_by_time_intervals(encounter_performance_data);
        this.history = performance_history;
        console.log(performance_history);
        // define elements 
        
        // build chart data
        var chart_data = {};
        chart_data["type"] = this.chart_static.type;
        chart_data["options"] = this.parse_static_chart_options(this.chart_static.options);
        
        
        
            // transform history into chart data for this chart type
        var relevant_history = this.return_relevant_history(bool_just_a_preview);
        console.log(relevant_history);
        
        var dataset_options = this.chart_static.dataset_options;
        if(this.chart_static.type == "line") var transformed_data = this.transform_history_to_line_chart_data(relevant_history, dataset_options)
        //if(this.chart_static.type == "radar") var transformed_data = this.transform_history_to_radar_chart_data(relevant_history, dataset_options)
        chart_data["data"] = transformed_data;
        
        console.log(chart_data);
        
        dom.onresize = function(){
            console.log("resized");
        }
        dom.style.backgroundColor = "red";
        var ctx = dom.getContext('2d');
        new Chart(ctx, chart_data)  
        
        // return built template
        console.log(dom);
        return {dom : dom, data : chart_data};
    },
    
    
    // convert encounters into performance objects, TODO - create an encounter object which does this automatically given an encounter
    //                                              TODO - instead of passing encounter data, just pass the encounters w/ expected encounter.performance method
    data_converter : {
        null_performance_object : { // null performance object is used outside of this object in order to missing records
            RAPA1 : null,
            RAPA2 : null,
        }, 

        transform_encounters_into_encounter_performance_data : function(encounters){
            // transform encounters into time+performance data
            var transformed_data = [];
            for(var i = 0; i < encounters.length; i++){
                //console.log("another encounter starts here............");
                var this_encounter = encounters[i];
                var this_transformed_data = this.transform_an_encounter(this_encounter);
                if(this_transformed_data == false) {
                    console.warn("Invalid data was returned as an encounter for exercise history...");
                    continue; // not a full encounter
                }
                transformed_data.push(this_transformed_data);
            }

            return transformed_data;
        },

        transform_an_encounter : function(encounter){
            var this_data = {
                id : null,
                time : null,
                performance : JSON.parse(JSON.stringify(this.null_performance_object)),
            }

            // encounter observations
            if(encounter.observations.length < 9) return false;
            //console.log("observations are longer than 9 !!!!!!!!!!!!!!!!!!!!!!!!!!!");
            //console.log(encounter.observations);

            // create an object of observations keyed by concept
            var observation_keys = encounter.observations.map(function(a) {return a.concept;});
            var observations = {};
            for(var i = 0; i < observation_keys.length; i++){
                var this_observation_data = encounter.observations[i]; 
                //console.log("observation for id = " + this_observation_data);
                //console.log(this_observation_data);
                observations[observation_keys[i]] = encounter.observations[i]; 
            }
            //console.log(observations);

            // find the highest rapa value that is available for rapa1_x
            var highest_rapa1_value = 0;
            for(i = 1; i < 8; i++){
                var this_key = "RAPA1_q"+i;
                //console.log(this_key + " = " + observations[this_key].value);
                if(observations[this_key].value === "true") highest_rapa1_value = i;
            }
            //console.log("highest rapa1 = " + highest_rapa1_value);
            // note, ["sedentary", "under-active", "under-active", "regular", "regular", "active", "active"], must be equal to ["sedentary", "under-active",  "regular", "active"],
            var final_rapa1 = ["sedentary", "under-active",  "regular", "active"];
            var initial_rapa1 = ["sedentary", "under-active", "under-active", "regular", "regular", "active", "active"];
            var rapa1_value = final_rapa1.indexOf(initial_rapa1[highest_rapa1_value - 1]);


            // find the total rapa2 value
            var total_rapa2_value = 0;
            for(i = 1; i < 3; i++){
                var this_key = "RAPA2_q"+i;
                //console.log(this_key + " = " + observations[this_key].value);
                if(observations[this_key].value === "true") total_rapa2_value += i;
            }
            //console.log("total rapa2 = " + total_rapa2_value);

            // set data into data object
            this_data.id = encounter.id;
            this_data.time = encounter.datetime;
            this_data.formatted_time = encounter.datetime_formatted;
            this_data.performance.RAPA1 = rapa1_value;
            this_data.performance.RAPA2 = total_rapa2_value;
            //console.log(this_data);
            return this_data;
        },

    },
    
    
    // TODO - in addition to behavior specific encounter objects, create a global Encounter Manager object. Pass the organized data to the converter.
    ///////////////////////////////////////////////////////////////////////////////////////////
    // Convert encounter_performance type data into history
    ///////////////////////////////////////////////////////////////////////////////////////////
    // TODO: consider using moment.js if intervals get more complex than just months or weeks.
    organize_encounter_performance_data_by_time_intervals : function(encounter_data){
        console.log(encounter_data);
        // merge encounters into time intervals
        /*
              - employ a heuristic for merging the performance data for that interval's encounters
                  - heuristic: "keep most recent data only"
         note - since we want to display missed intervals, we need to keep going back from current period and check if any fall in it, untill:
                   - all encounter data are assigned or we cover as many periods as we desire.
         So, we need a `max_intervals` field 
        */
        var min_intervals = 8;
        var max_intervals = 16;
        var time_interval = this.time_interval;
        
        var timed_data = [];
        var next_data_index = 0;
        var unused_encounter_data = encounter_data;
        
        var this_datetime = new Date();
        //console.log("Period current = " + this.get_period_identifier_for_datetime(this_datetime));
        var i = 0;
        while((timed_data.length < min_intervals) || (timed_data.length < max_intervals && unused_encounter_data.length > 0)){ // ensure min-periods and max-periods/all-data-used
            i++; if(!(i < 20)) break; //developer mode infinite loop prevention
            
            var this_datetime = this.subtract_one_interval_from_datetime(this_datetime); // go back one period
            var this_period = this.get_period_identifier_for_datetime(this_datetime);
            //console.log("Period -" + i + " = " + this_period);  
            
            // find relevant encounters (those pertaining to this period)
            var relevant_encounters = this.find_encounters_for_this_period(unused_encounter_data, this_period); 
            //console.log("relevant encounters");
            
            // remove relevant encounters from encounter_data
            //console.log(JSON.parse(JSON.stringify(unused_encounter_data)));
            unused_encounter_data = unused_encounter_data.filter(function(x) { return relevant_encounters.map(function(e) {return e.id;}).indexOf(x.id) < 0 }); // if id exists in rel_encs, dont keep it
            //console.log(JSON.parse(JSON.stringify(unused_encounter_data)));
            
            // get performance for this period from rel encounters
            //console.log(relevant_encounters);
            if(relevant_encounters.length == 0){
                // if no encounters exist for this period,
                var this_performance = this.encounter_null_performance;
                var this_id = null;
                var bool_record_exists = false;
            } else {
                // keep only the latest encounter (merge strategy)
                var relevant_encounter = this.return_latest_encounter(relevant_encounters);
                var this_performance = relevant_encounter.performance;
                var this_id = relevant_encounter.id;
                var bool_record_exists = true;
            }
            
            // create data for this period
            var this_period_data = {
                id : this_id,
                index : i, // convinience property for sorting 
                time : this.get_time_label_for_period(i),
                exists : bool_record_exists, // convinence property for detecting whether behavior is up to date or not
                performance : this_performance,
            }
            
            // append to data
            timed_data.push(this_period_data);
        }
        
        return timed_data;
    },
    get_period_identifier_for_datetime : function(the_date){
        var time_interval = this.time_interval;
        if(time_interval == "month") return the_date.getMonth();
    },
    get_time_label_for_period : function(intervals_ago){
        var time_interval = this.time_interval;
        /*
        if(time_interval == "month"){
            var label = intervals_ago + " mo. ago";
            if(intervals_ago == 1) label = "last month";
            return label;
        }
        */
        if(time_interval == "month"){
            var month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return month_names[(60 + new Date().getMonth() - intervals_ago) % 12]; // + 60 so that if intervals_ago > getMonth but <= 60, month will still be accurate
        }
        
    },
    subtract_one_interval_from_datetime : function(this_time){
        var new_time = new Date(this_time.getTime());
        var time_interval = this.time_interval;
        if(time_interval == "month") {
            new_time.setMonth(new_time.getMonth() - 1);
            return new_time;
        }
    },
    return_latest_encounter : function(encounters){
        var the_encounter = encounters[0];
        //console.log(encounters);
        for(var i = 0; i < encounters.length; i++){
            var this_encounter = encounters[i];
            if(this_encounter.time > the_encounter.time){
                //console.log("update the datetime from " + the_encounter.time + " to " + this_encounter.time)
                the_encounter = this_encounter;
            }
        }
        return the_encounter;
    },
    find_encounters_for_this_period : function(encounter_data, target_period){
        if(encounter_data.length == 0) return [];
        
        var dev_mode = false; // if dev_mode, each encounter should be placed in a seperate time interval, regardless of the date time
        if(dev_mode === true) {
            // order matters in dev mode because we are not matching by time in this case.
            encounter_data.sort((a, b)=>{
                return b.time - a.time;
            })
            return [encounter_data[0]]
        };

        // find encounters which came from this interval
        var relevant_encounters = [];
        for(var i = 0; i < encounter_data.length; i++){
            // TODO - ensure no bugs due to timezones are occuring
            var this_encounter = encounter_data[i]; 
            var this_datetime = this.subtract_one_interval_from_datetime(new Date(this_encounter.time));
            
            // Assumption - assume that user's response is always pertaining to the period /before/ submission. 
            //      - e.g., if interval is monthly and user submits in april, then response is pertaining to month (april - 1) = march
            //      - TODO(?) : explicitly define which interval a response is for in form's encounter
            var this_period = this.get_period_identifier_for_datetime(this_datetime);
            
            if(this_period == target_period) relevant_encounters.push(this_encounter);
        }
        
        return relevant_encounters;
    },
    
    
    // TODO - dont parse options anymore, just explicitly define them for each chart.builder
    parse_static_chart_options : function(options){
        var options = options;
        if(typeof options.yaxis_to_text_mapping_array !== "undefined"){
            // we need to set 
            /*
               userCallback: function(t, i) {
                  return mapping_function[mapText.length - (i + 1)];
               }
            */
            options.scales.yAxes[0].ticks.userCallback = function(t, i){
                var mapping_function = options.yaxis_to_text_mapping_array;
                return mapping_function[mapping_function.length - (i + 1)];
           }
        }
        
        return options;
    },
    
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // history helper
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return_relevant_history : function(bool_just_a_preview){
        var relevant_history = this.history;
        //console.log("pre-reduction:");
        //console.log(JSON.parse(JSON.stringify(relevant_history)));
        if(bool_just_a_preview !== true) return relevant_history;
        
        // if just a preview, concatenate the data returned to the past `preview_length` data elements
        var preview_length = 3; // only use 3 time points for preivews
        relevant_history = relevant_history.slice(0, preview_length);
        
        return relevant_history;
    },
     
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // return_chart_data helper methods
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // maps history + dataset_options into data object that ChartJS expects for a chart of type "line"
    transform_history_to_line_chart_data : function(raw_history, dataset_options){
        var history = {
            "time" : [],
            "performance" : {}    
        }
        
        
        console.log(raw_history);
        
        //////////////////////////////////////////
        // Convert raw history into history that is easy to plug into chart data
        //////////////////////////////////////////
        // sort by datetime ascending to order in graph as expected, with most recent last
        raw_history.sort((a, b)=>{
            return b.index - a.index;
        })
        
        
        // ensure performance keys exist
        var performance_keys = Object.keys(this.encounter_null_performance);
        for(var i = 0; i < performance_keys.length; i++){
            history.performance[performance_keys[i]] = [];
        }
        
        // TODO : error proof merging raw_history into history that this object expects
        for(var i = 0; i < raw_history.length; i++){
            this_raw_history = raw_history[i];
            history.time.push(this_raw_history.time);
            for(var j = 0; j < performance_keys.length; j++){
                var this_key = performance_keys[j];
                history.performance[this_key].push(this_raw_history.performance[this_key]);
            }
        }
        
        
        //////////////////////////////////////////
        // build data object
        //////////////////////////////////////////
        // initialize chart data object
        var data = {};
        
        // set chart labels
        data["labels"] = history["time"]; // time is labels for a line graph
        
        // set chart data 
        data["datasets"] = dataset_options; // the base of the datasets object is the dataset_options
        // map performance history to the appropriate dataset object, by identifier
        var dataset_performance_identifier_list = data["datasets"].map(function(a) {return a.performance_identifier;}); // note, this was dataset_labels_list
        var performance_keys = Object.keys(history.performance);
        for(var i = 0; i < performance_keys.length; i++){
            var this_performance_identifier = performance_keys[i];
            var performance_data = history.performance[this_performance_identifier];
            
            // get index of label associated with this history.performance in the data["dataset"]
            var dataset_index_of_this_performance_identifier = dataset_performance_identifier_list.indexOf(this_performance_identifier);
            //console.log(this_performance_label + " is at dataset index " + dataset_index_of_this_performance_label);
            if(dataset_index_of_this_performance_identifier == -1) console.error("performance identifier in behavior.history ("+this_performance_identifier+") is not defined in behavior.chart_static.dataset_options.");
            
            // now that we have the index, we can append the data to that object.
            data["datasets"][dataset_index_of_this_performance_identifier]["data"] = performance_data;
        }
        return data;
    },
}