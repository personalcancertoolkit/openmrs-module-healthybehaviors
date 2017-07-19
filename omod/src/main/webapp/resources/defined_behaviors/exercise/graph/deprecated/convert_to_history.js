
    ///////////////////////////////////////////////////////////////////////////////////////////
    // Convert encounter_performance type data into history
    ///////////////////////////////////////////////////////////////////////////////////////////
    // TODO: consider using moment.js if intervals get more complex than just months or weeks.
    organize_encounters_by_time_intervals : function(encounter_data){
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
    