var nutrition_graph_display_builder = {
    holder : null,
    template : {
        row : null,
        example : null,
        bull : null,
    },
    data : null, // defined in this file further below
    used_color_choices : [],
    colors_cached_by_display_title : {},
    color_options : {
        purple: 'rgb(153, 102, 255)',
        green: 'rgb(75, 192, 192)',
        red: 'rgb(255, 99, 132)',
        blue: 'rgb(54, 162, 235)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        grey: 'rgb(201, 203, 207)'
    },

    build_from : function(dom, additional_data){
        // set constants
        var preview_length = 3;
        
        // address from additional_data
        var encounters = additional_data.encounters;
        this.time_interval = additional_data.time_interval;
        
        
        
        // transform history into chart data for this chart type
        var relevant_encounters = this.remove_duplicate_date_encounters(encounters);
        var relevant_encounters_for_preview = relevant_encounters.slice(0, preview_length);
        
        // chart config
        var chart_config = this.build_chart_config_with_encounters(relevant_encounters);
        var preview_chart_config = this.build_chart_config_with_encounters(relevant_encounters_for_preview);
                              
        // peer_data config
        var peer_data = [
            {
                "metric_title" : "Fruits and Veggies",
                "graph_data" : this.build_dataset_from_encounters(relevant_encounters, "fruits_and_veges", "Fruits and Veggies", "green", false),
                "performance_key" : "fruits_and_veges",
            },
            {
                "metric_title" : "Meats and Snacks",
                "graph_data" : this.build_dataset_from_encounters(relevant_encounters, "meat_and_snacks", "Meats and Snacks", "yellow", false),
                "performance_key" : "meat_and_snacks",
            },
        ]
        
        // return built data
        return {
            data : chart_config,
            preview_data : preview_chart_config, 
            peer_data : peer_data, 
            peer_dataset_builder : this.build_dataset_from_encounters.bind(this)
        };
    },
    
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // build chart with encounters
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    build_chart_peer_config_for : function(type, encounters){
       return "placeholder"; 
    }, 
    build_chart_preview_config_with_encounters : function(encounters){
        var config = this.build_chart_config_with_encounters(encounters);
        // modify config to make y axis less dense

        config.options.scales.yAxes[0].ticks = {
            "beginAtZero": true,
            "stepSize":50,
            "max":100,
            "min":-100,
            "userCallback" : function(t, i){
                var mapping_function =  ["", "", "", "", ""];
                //return t;
                return mapping_function[mapping_function.length - (i + 1)];
           },
        }
        return config;
    },
    build_chart_config_with_encounters : function(encounters){
        // helper data
		var color = Chart.helpers.color;
        
        // turning encounters into format chart expects 
        
		var config = {
			type: 'line',
			data: {
				datasets: [
                    this.build_dataset_from_encounters(encounters, "fruits_and_veges", "Fruits and Veggies", "green"),
                    this.build_dataset_from_encounters(encounters, "meat_and_snacks", "Meats and Snacks", "yellow"),
                ]
			},
			options: {
                title:{
                    display:false,
                    text:'Status of the 30 days of exercise prior to each report'
                },
                tooltips: {
                    mode: 'x',
                },
                /*
                horizontalLine: [
                    {
                      "y": (11/35*100), // 11 = threshold, 35 = max points, 100 = percentage that would be displayed on graph at that threshold
                      "style": color(color_options.green).alpha(0.50).rgbString(),
                    },
                    {
                      "y": (-1)*(22/75*100), // 22 = threshold, 75 = max points, 100 = percentage that would be displayed on graph at that threshold
                      "style": color(color_options.yellow).alpha(0.50).rgbString(),
                    },
                ],
                */
				scales: {
					xAxes: [{
						type: "time",
						time: {
							format: "MM/DD/YYYY",
							round: 'week',
                            unit: 'week',
							tooltipFormat: 'll'
						},
						scaleLabel: {
							display: true,
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
						},
                        ticks : {
                            "beginAtZero": true,
                            "stepSize":34,
                            "max":102,
                            "min":0,
                            "userCallback" : function(t, i){
                                var mapping_function =  [ "critical", "needs work",  "good choices", "great choices"];
                                //var mapping_function =  [ "", "😞", "",  "", "😃"];
                                //return t;
                                return mapping_function[mapping_function.length - (i + 1)];
                           },
                        }
					}]
				},
			},
            /*
           plugins: [{
              afterDraw: function(chart) {
                 var ctx = chart.ctx;
                 var yAxis = chart.scales['y-axis-0'];
                 var tickGap = yAxis.getPixelForTick(1) - yAxis.getPixelForTick(0);
                 //var fontArgs = ctx.font.split(' ');
                 //ctx.font = '21px' + ' ' + fontArgs[fontArgs.length - 1]; /// using the last part
                 // loop through ticks array
                 Chart.helpers.each(yAxis.ticks, function(tick, index) {
                    if (index === yAxis.ticks.length - 1) return;
                    var xPos = yAxis.right;
                    var yPos = yAxis.getPixelForTick(index);
                    var xPadding = 10;
                    // draw tick
                    //ctx.save();
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'right';
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.fillText(tick, xPos - xPadding, yPos + tickGap / 2);
                    //ctx.restore();
                 });
                 yAxis.options.ticks.fontColor = 'transparent'; // hide original tick
              }
           }]
           */
		};
        return config;
    },
    
    convert_encounters_to_data_for_performance_type : function(encounters, performance_type){
        var data = [];
        encounters.forEach((encounter)=>{
            if(encounter.time == null) return; // skip invalid encounters
            data.push({
                x : encounter.time,
                y : encounter.performance[performance_type],
            })
        })
        return data;
    },
    return_not_used_color : function(){
        var options = Object.keys(this.color_options);
        for(var i = 0; i < options.length; i++){
            var this_color = options[i];
            if(this.used_color_choices.indexOf(this_color) == -1) return this_color;
        }
    },
    find_color_based_on_display_title : function(display_title){
        var cached = this.colors_cached_by_display_title[display_title];
        if(typeof cached == "undefined") return false;
        return cached;
    },
    build_dataset_from_encounters : function(encounters, performance_key, display_title, color_choice, fill){
        if(typeof fill === "undefined") fill = false;
        // pick color which has not been used
        // helper data
		var color = Chart.helpers.color;
        if(typeof color_choice == "undefined"){
            color_choice = this.find_color_based_on_display_title(display_title);
            if(color_choice == false) color_choice = this.return_not_used_color(); // pick a non used color choice
        }
        if(this.used_color_choices.indexOf(color_choice) == -1)this.used_color_choices.push(color_choice);
        this.colors_cached_by_display_title[display_title] = color_choice;
        
        // get data
        var data = this.convert_encounters_to_data_for_performance_type(encounters, performance_key);
        
        // build dataset object
        var dataset = {
            label: display_title,
            backgroundColor: color(this.color_options[color_choice]).alpha(0.25).rgbString(),
            borderColor: this.color_options[color_choice],
            fill: fill,
            data: data,
        }
        
        return dataset;
    },
    
    
    
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // history helper
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    remove_duplicate_date_encounters : function(encounters){
        var dates_found = [];
        var valid_encounters = [];
        
        // keep last, so order the encounters by time descending initially
        encounters.sort((a, b)=>{
            return b.time - a.time;
        })
        
        // if a date is found, then skip it, if not, add the date and add the encounter
        encounters.forEach((encounter)=>{
            if(dates_found.indexOf(encounter.formatted_time) > -1) return; // skip it
            dates_found.push(encounter.formatted_time);
            valid_encounters.push(encounter);
        })

        return valid_encounters;
    },
     
    
}


