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
    this.resource_root = behavior_data.resource_root;
    this.image_root = behavior_data.resource_root + "images/";
    this.header_src = behavior_data.header_src;
    this.wow_facts = behavior_data.wow_facts;
    
    // define history/reporting specific data
    this.uptodate = behavior_data.uptodate;
    this.time_interval = behavior_data.time_interval;
    this.chart_static = {
        type : behavior_data.chart_static.type,
        options : behavior_data.chart_static.options,
        dataset_options : behavior_data.chart_static.dataset_options,
    }
    this.encounters = behavior_data.encounters;
    
    // convert encounters to performance data
    this.encounter_null_performance = behavior_data.data_converter.null_performance_object;
    this.encounter_performance_data = behavior_data.data_converter.transform_encounters_into_encounter_performance_data(this.encounters);
    this.history = this.organize_encounter_performance_data_by_time_intervals(this.encounter_performance_data);
    
    /*
    this.history = {
        time : behavior_data.history.time,
        performance : behavior_data.history.performance,
    };
    */
    
    
    // define advice specific data
    this.personalized_advice = behavior_data.personalized_advice;
}
abstract_behavior_class.prototype = {
    get wow_fact(){
        return "Did you know that "  + this.wow_facts[Math.floor(Math.random() * (this.wow_facts.length))] + "?";
    },
    
    get chart_data(){
        return this.return_chart_data();
    },
    get chart_preview_data(){
        return this.return_chart_data(true);  
    },
    
    ////////////////////////////////////////////////////////////
    // Return Chart Data
    ////////////////////////////////////////////////////////////
    return_chart_data : function(bool_just_a_preview){
        var chart_data = {};
        chart_data["type"] = this.chart_static.type;
        chart_data["options"] = this.chart_static.options;
        
        // transform history into chart data for this chart type
        var relevant_history = this.return_relevant_history(bool_just_a_preview);
        
        var dataset_options = this.chart_static.dataset_options;
        if(this.chart_static.type == "line") var transformed_data = this.transform_history_to_line_chart_data(relevant_history, dataset_options)
        //if(this.chart_static.type == "radar") var transformed_data = this.transform_history_to_radar_chart_data(relevant_history, dataset_options)
        chart_data["data"] = transformed_data;
        
        return chart_data;
    },
    
    
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////
    // Convert encounter_performance type data into history
    ///////////////////////////////////////////////////////////////////////////////////////////
    // TODO: consider using moment.js if intervals get more complex than just months or weeks.
    organize_encounter_performance_data_by_time_intervals : function(encounter_data){
        
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
            console.log("for period of month " + this_period); 
            console.log(relevant_encounters);
            
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
        
        console.log("---");
        console.log(timed_data);
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
        console.log(encounters);
        for(var i = 0; i < encounters.length; i++){
            var this_encounter = encounters[i];
            if(this_encounter.time > the_encounter.time){
                console.log("update the datetime from " + the_encounter.time + " to " + this_encounter.time)
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
    
    
    
    
    
    
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // return_chart_data helper methods
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // maps history + dataset_options into data object that ChartJS expects for a chart of type "line"
    transform_history_to_line_chart_data : function(raw_history, dataset_options){
        var history = {
            "time" : [],
            "performance" : {}    
        }
        
        
        // sort by datetime ascending to order in graph as expected, with most recent last
        raw_history.sort((a, b)=>{
            return b.index - a.index;
        })
        
        // ensure performance keys exist
        var performance_keys = Object.keys(raw_history[0].performance);
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
        
        var data = {};
        data["labels"] = history["time"]; // time is labels for a line graph
        data["datasets"] = dataset_options; // the base of the datasets object is the dataset_options
        
        // map performance history to the appropriate dataset object, by label
        var dataset_labels_list = data["datasets"].map(function(a) {return a.label;});
        //console.log("dataset labels list:");
        //console.log(dataset_labels_list);
        var performance_keys = Object.keys(history.performance);
        for(var i = 0; i < performance_keys.length; i++){
            var this_performance_label = performance_keys[i];
            var performance_data = history.performance[this_performance_label];
            
            // get index of label associated with this history.performance in the data["dataset"]
            var dataset_index_of_this_performance_label = dataset_labels_list.indexOf(this_performance_label);
            //console.log(this_performance_label + " is at dataset index " + dataset_index_of_this_performance_label);
            if(dataset_index_of_this_performance_label == -1) console.error("performance label in behavior.history ("+this_performance_label+") is not defined in behavior.chart_static.dataset_options.");
            
            // now that we have the index, we can append the data to that object.
            data["datasets"][dataset_index_of_this_performance_label]["data"] = performance_data;
        }
        return data;
    },
    return_performance_data_at_index_for_keys : function(time_interval_index, performance_keys, history){
        var data = [];
        for(var i = 0; i < performance_keys.length; i++){
            var this_key = performance_keys[i];
            var this_data = history.performance[this_key][time_interval_index];
            data.push(this_data);
        }
        return data;
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
        relevant_history = array.slice(0, preview_length);
        
        return relevant_history;
    },
    
    
    
}