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
    this.history = {
        time : behavior_data.history.time,
        performance : behavior_data.history.performance,
    };
    
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
        if(this.chart_static.type == "radar") var transformed_data = this.transform_history_to_radar_chart_data(relevant_history, dataset_options)
        chart_data["data"] = transformed_data;
        
        return chart_data;
    },
    
    ////////////
    // return_chart_data helper methods
    ///////////
    // maps history + dataset_options into data object that ChartJS expects for a chart of type "line"
    transform_history_to_line_chart_data : function(history, dataset_options){
        /*
        "history" : {
            "time": ["-3 Week", "-2 Week", "Last Week"],
            "performance" : {
                "Veggies Eaten": [7, 12, 9],
                "Fast Food Eaten": [3, 0, 1]
            }
        },
        "dataset_options" : [
            {
                "label": "Veggies Eaten",
                "backgroundColor": [
                    "rgba(99, 255, 135, 0.2)"
                ],
                "borderColor": [
                    "rgb(99, 255, 135)"
                ],
                "borderWidth": 1
            },
            {
                "label": "Fast Food Eaten",
                "backgroundColor": [
                    "rgba(255, 62, 62, 0.1)"
                ],
                "borderColor": [
                    "rgb(255, 62, 62)"
                ],
                "borderWidth": 1
            }
        ]
        
        into 
        
        "data" : {
            "labels": ["-3 Week", "-2 Week", "Last Week"],
            "datasets" : [{
                        "label": "Veggies Eaten",
                        "data": [7, 12, 9],
                        "backgroundColor": [
                            "rgba(99, 255, 135, 0.2)"
                        ],
                        "borderColor": [
                            "rgb(99, 255, 135)"
                        ],
                        "borderWidth": 1
                    },{
                        "label": "Fast Food Eaten",
                        "data": [3, 0, 1],
                        "backgroundColor": [
                            "rgba(255, 62, 62, 0.1)"
                        ],
                        "borderColor": [
                            "rgb(255, 62, 62)"
                        ],
                        "borderWidth": 1
                    }],
        },
        
        */
        
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
    // maps history + dataset_options into data object that ChartJS expects for a chart of type "radar"
    transform_history_to_radar_chart_data : function(history, dataset_options){
        /*
        "history" : {
            "time" : ["-4 W", "-3 W", "-2 W", "Last Week"],
            "performance" : {
                "Strength" : [1, 2, 3, 3],
                "Flexibility" : [0, 1, 1, 1],
                "Vigorous" : [0, 0, 1, 1],
                "Moderate" : [1, 1, 1, 1],
                "Light" : [5, 3, 3, 2]
            }
        },
        "dataset_options" : [
            "background_color" : "rgba(1, 119, 199, 0.1)",
            "starting_border_color" : "rgba(1, 119, 199, 1)",
       ]
       
       into 
       
       {
            "labels" : ["Strength","Flexibility","Vigorous","Moderate", "Light"],
            "datasets" : [
                {
                    "label": "-2 Week",
                    "data": [3, 3, 2, 4, 3],
                    "backgroundColor": [
                        "rgba(1, 119, 199, 0.1)"
                    ],
                    "borderColor": [
                        "rgba(1, 119, 199, 1)"
                    ],
                    "borderWidth": 1
                },{
                    "label": "-3 Week",
                    "data": [2, 4, 1, 5, 3],
                    "backgroundColor": [
                        "rgba(54, 162, 235, 0.1)"
                    ],
                    "borderColor": [
                        "rgba(54, 162, 235, 0.8)"
                    ],
                    "borderWidth": 1
                }
            ],
        }
       */
        // assumes that the border-color for each week will decrease linearly per week
        var data = {};
        data["labels"] = Object.keys(history.performance); // time is labels for a line graph
        // TODO - order labels each time, by order defined in dataset_options (order of object keys is not guarenteed)
        
        data["datasets"] = []; // dataset object will need to be created for each time point
        var background_color = dataset_options["background_color"];
        
        var total_opacity_increments = Math.min(history.time.length, 10); // up to 10 increments
        var opacity_step = 1/total_opacity_increments;
        var border_color = dataset_options["background_color"].split(",");
        if(border_color.length < 3) console.error("starting_border_color for a behavior.dataset_options must be defined as RGBA.")
        var a_value = parseFloat(border_color[3].replace(/\D/g,''));
        
        console.log(opacity_step + " = opacity step");
        for(var i = 0; i < history.time.length; i++){
            var this_time_interval = history.time[i];
            
            var performance_data_for_this_time_interval = this.return_performance_data_at_index_for_keys(i, data["labels"], history); 
            
            var this_opacity_difference = -1 * i * opacity_step;
            var this_a_value = a_value + this_opacity_difference;
            var this_border_color = JSON.parse(JSON.stringify(border_color)); // assign by value, not reference
            this_border_color[3] = " " + this_a_value + ")";
            var this_border_color = this_border_color.join(",");
            
            var this_dataset = {
                "label" : this_time_interval,
                "data" : performance_data_for_this_time_interval,
                "backgroundColor" : background_color,
                "borderColor" : this_border_color,
                "borderWidth" : 1,
            }
            
            data["datasets"].push(this_dataset);
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
    return_relevant_history : function(bool_just_a_preview){
        var relevant_history = this.history;
        //console.log("pre-reduction:");
        //console.log(JSON.parse(JSON.stringify(relevant_history)));
        if(bool_just_a_preview !== true) return relevant_history;
        
        // if just a preview, concatenate the data returned to the past `preview_length` data elements
        var preview_length = 3; // only use 3 time points for preivews
        
        // for time and for each performance array, strip it to the last `preview_length` elements
        relevant_history.time = relevant_history.time.slice(-1 * preview_length);
        var performance_keys = Object.keys(relevant_history.performance);
        for(var i = 0; i < performance_keys.length; i++){
            var this_key = performance_keys[i];
            relevant_history.performance[this_key] = relevant_history.performance[this_key].slice(-1*preview_length);
        }
        //console.log("reduced history: ");
        //console.log(JSON.parse(JSON.stringify(relevant_history)));
        //console.log("--");
        return relevant_history;
    },
    
    
    
}