var nutrition_graph_display_builder = {
    holder : null,
    template : {
        row : null,
        example : null,
        bull : null,
    },
    data : null, // defined in this file further below
   

    build_from : function(dom, additional_data){
        // set constants
        var preview_length = 3;
        
        // address from additional_data
        var encounters = additional_data.encounters;
        this.time_interval = additional_data.time_interval;
        
        // transform history into chart data for this chart type
        var relevant_encounters = this.remove_duplicate_date_encounters(encounters);
        var relevant_encounters_for_preview = relevant_encounters.slice(0, preview_length);
        //console.log(relevant_encounters);
        
        // chart config
        var chart_config = this.build_chart_config_with_encounters(relevant_encounters);
        var preview_chart_config = this.build_chart_preview_config_with_encounters(relevant_encounters_for_preview);
        
        // return built data
        return {data : chart_config, preview_data : preview_chart_config};
    },
    
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // build chart with encounters
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    build_chart_preview_config_with_encounters : function(encounters){
        var config = this.build_chart_config_with_encounters(encounters);
        // modify config to make y axis less dense

        config.options.scales.yAxes[0].ticks = {
            "beginAtZero": true,
            "stepSize":50,
            "max":100,
            "min":-100,
            "userCallback" : function(t, i){
                var mapping_function =  ["", "Needs Work", "Good", "Getting There", "Great Choices"];
                //return t;
                return mapping_function[mapping_function.length - (i + 1)];
           },
        }
        return config;
    },
    build_chart_config_with_encounters : function(encounters){
        // helper data
        var color_options = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)',
            black: 'rgb(0, 0, 0)'
        };
		var color = Chart.helpers.color;
        
        // turning encounters into format chart expects 
        /*
        [{
            x: newDateString(0),
            y: randomScalingFactor()
        }, {
            x: newDateString(30),
            y: randomScalingFactor()
        }, {
            x: newDateString(62),
            y: randomScalingFactor()
        }, {
            x: newDateString(70),
            y: randomScalingFactor()
        }]
        */
        var fruits_and_veges_data = this.convert_encounters_to_data_for_performance_type(encounters, "fruits_and_veges");
        var meat_and_snacks_data = this.convert_encounters_to_data_for_performance_type(encounters, "meat_and_snacks");
        
		var config = {
			type: 'line',
			data: {
				datasets: [{
					label: "Fruits and Vegetables",
					backgroundColor: color(color_options.green).alpha(0.25).rgbString(),
					borderColor: color_options.green,
					data: fruits_and_veges_data,
                    fill : "origin",
				},
                {
					label: "Meats and Snacks",
					backgroundColor: color(color_options.yellow).alpha(0.25).rgbString(),
					borderColor: color_options.yellow,
					data: meat_and_snacks_data,
                    fill : "origin",
				}]
			},
			options: {
                title:{
                    display:false,
                    text:'Status of the 30 days of exercise prior to each report'
                },
                tooltips: {
                    mode: 'x',
                },
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
				scales: {
					xAxes: [{
						type: "time",
						time: {
							format: "MM/DD/YYYY",
							// round: 'day'
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
                            "stepSize":33,
                            "max":99,
                            "min":-99,
                            "userCallback" : function(t, i){
                                var mapping_function =  [ "", "Critical", "Needs Work", "Good", "Needs Work", "Good Choices", "Great Choices"];
                                //return t;
                                return mapping_function[mapping_function.length - (i + 1)];
                           },
                        }
					}]
				},
			},
           plugins: [{
              afterDraw: function(chart) {
                 var ctx = chart.ctx;
                 var yAxis = chart.scales['y-axis-0'];
                 var tickGap = yAxis.getPixelForTick(1) - yAxis.getPixelForTick(0);
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


