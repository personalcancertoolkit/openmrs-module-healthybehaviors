var peer_functionality = {
    
    the_chart_object : null,
    DOM : {
        holder : null,
    },
    initialized : false,
    
    initialize : function(){
        this.DOM.holder = document.getElementById("peer_graph_holder");
    },
    
    display_options : function(){
        document.getElementById("peer_options").style.display = "block";
        document.getElementById("peer_display").style.display = "none";
        document.getElementById("peer_submission_button").style.display = "flex";
        document.getElementById("peer_back_button").style.display = "none";
    },

    display_chart : function(performance_key){
        document.getElementById("peer_options").style.display = "none";
        document.getElementById("peer_display").style.display = "block";
        document.getElementById("peer_submission_button").style.display = "none";
        document.getElementById("peer_back_button").style.display = "flex";
        return promise_requested_behavior.then((behavior_object)=>{
            var chart_data = behavior_object.display.graph.data;
            var base_datasets =  behavior_object.display.graph.peer_data;
            
            // find the correct dataset to use for this metric
            var this_base_dataset = null;
            for(var i = 0; i < base_datasets.length; i++){
                if(base_datasets[i].performance_key == performance_key) this_base_dataset = [base_datasets[i].graph_data];
            }
            
            // create the chart object if it has not been created already
            var chart_canvas = this.DOM.holder.querySelector("canvas");
            if(this.the_chart_object === null){
                var ctx = chart_canvas.getContext('2d');
                this.the_chart_object = (function(chart_data){
                    return new Chart(ctx, chart_data); // do this in an anonymous function so as to pass chart data by value
                })(chart_data);
            }
            
            // ensure chart data is cleaned each time
            (function(chart_object, base_datasets){
                chart_object.data.datasets = this_base_dataset; // do this in an anonymous function so as to pass chart data by value - (VERY IMPORTANT)
                chart_object.update();
            })(this.the_chart_object, this_base_dataset);
            
            return this.the_chart_object;
        });
    },
    change_loading_display_to : function(bool_display){
        if(bool_display){
            document.getElementById("peer_chart_loading").style.display = "flex";   
        } else {
            document.getElementById("peer_chart_loading").style.display = "none";  
        }
    },
    
    //////////////////////////////////////////////////
    // trigger comparison
    //////////////////////////////////////////////////
    attempt_comparison : function(){
        if(this.initialized !== true) this.initialize();
        
        // first check that it is valid, if not then the user will already be alerted and we can abort
        if(this.check_validity() !== true) return;
        
        // grab the user inputs
        var performance_key = this.get_performance_key();
        var peers = this.get_peers();
        
        // display the graph with the current users data and show loading
        var promise_the_chart = this.display_chart(performance_key);
        this.change_loading_display_to(true);
        
        
        // set promises which will load the user data, add it to the graph, and update the graph display when finished
        var promises_for_peer_encounters = [];
        for(let i = 0; i < peers.length; i++){
            var this_promise_of_peer_data = promise_requested_behavior
                .then((behavior_object)=>{
                    var person_data = peers[i].split(":||:");
                    var person_id = person_data[0];
                    var person_name = person_data[1];
                    var encounter_type = behavior_object.data.encounter_type;
                    var promise_encounters_for_peer = simpleformservice.encounter_retreiver.promise_encounters_for_encounter_type(encounter_type, person_id);
                    var Encounter_Class = behavior_object.Encounter_Class;
                    var dataset_builder = behavior_object.display.graph.peer_dataset_builder;
                    return Promise.all([promise_encounters_for_peer, person_name, Encounter_Class, dataset_builder, promise_the_chart]);
                })
                .then((data_array)=>{
                    var encounters = data_array[0];
                    var person_name = data_array[1];
                    var Encounter_Class = data_array[2];
                    var dataset_builder = data_array[3];
                    var the_chart = data_array[4];
                    
                    // convert encounter data into encounter objects
                    var encounter_objects = [];
                    encounters.forEach(function(encounter){
                        var this_encounter = new Encounter_Class(encounter);
                        if(this_encounter.time !== null) encounter_objects.push(this_encounter); // skip null encounters
                    })
                    
                    // genererate data to insert into graph from the encounter objects
                    var this_dataset = dataset_builder(encounter_objects, performance_key, person_name, "grey");
                    
                    // add dataset to the chart
                    the_chart.data.datasets.push(this_dataset);
                    the_chart.update();
                })
        }
            
        // remove loading diagram after all have loaded
        Promise.all(promises_for_peer_encounters)
            .then(()=>{
                this.change_loading_display_to(false);
            })
    },
    
    ///////////////////////////////////////////////
    // input retreival
    ///////////////////////////////////////////////        
    get_performance_key : function(){
        return [...document.querySelectorAll("input[name='peer_metric_option']:checked")].map(function(element){ return element.value })[0];
    },     
    get_peers : function(){
        return [...document.querySelectorAll("input[name='peer_peers_option']:checked")].map(function(element){ return element.value });
    },
    
    ///////////////////////////////////////////////
    // input validation
    ///////////////////////////////////////////////
    check_validity : function(from_who){
        //Check if inputs for peer comparisons are valid. Update the input button accordingly. 
        //  also, use the `from_who` parameter when displaying errors. If metrics are changed and there was an error with peers, dont re-alert that peers error. That would get confusing and annoying.
        var metrics_valid = this.check_metrics();
        var peers_valid = this.check_peers();
        
        if(metrics_valid !== true && (from_who == "metrics" || typeof from_who === "undefined")) alert(metrics_valid);
        if(peers_valid !== true && (from_who == "peers" || typeof from_who === "undefined")) alert(peers_valid);
        
        if(metrics_valid === true && peers_valid === true){
            document.getElementById("peer_submission_button").classList.remove("behavior_tile_button_disabled_modifier");
            return true;
        } else {
            document.getElementById("peer_submission_button").classList.add("behavior_tile_button_disabled_modifier");
            return false;
        }
        
    },
    check_metrics : function(){
        var selected_count = document.querySelectorAll("input[name='peer_metric_option']:checked").length;
        if(selected_count !== 1) return ("Please ensure a metric is selected.");
        return true;
    },
    check_peers : function(){
        var selected_count = document.querySelectorAll("input[name='peer_peers_option']:checked").length;
        if(selected_count > 5) return ("Please ensure that no more than 5 peers are selected");
        if(selected_count < 1) return ("Please ensure to choose atleast one peer");
        return true;
    },
}
    