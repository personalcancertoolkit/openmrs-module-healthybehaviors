var exercise_graph_display_builder = {
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
        var relevant_encounters = encounters;
        var relevant_encounters_for_preview = relevant_encounters.slice(0, preview_length);
        //console.log(relevant_encounters);
        
        // chart config
        var chart_config = this.build_chart_config_with_encounters(relevant_encounters);
        var preview_chart_config = this.build_chart_config_with_encounters(relevant_encounters_for_preview);
        
        // peer_data config
        var peer_data = [
            {
                "metric_title" : "Aerobic Activity",
                "graph_data" : this.build_dataset_from_encounters(relevant_encounters, "RAPA1", "Aerobic", "purple"),
                "performance_key" : "RAPA1",
            },
            {
                "metric_title" : "Strength Training",
                "graph_data" : this.build_dataset_from_encounters(relevant_encounters, "RAPA2", "Strength", "red"),
                "performance_key" : "RAPA2",
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
    build_chart_data_for : function(type, encounters){
       return "placeholder"; 
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
            grey: 'rgb(201, 203, 207)'
        };
		var color = Chart.helpers.color;
        
       
        
		var config = {
			type: 'line',
			data: {
				datasets: [
                    this.build_dataset_from_encounters(encounters, "RAPA1", "Aerobic", "purple"),
                    this.build_dataset_from_encounters(encounters, "RAPA2", "Strength", "red"),
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
                            "stepSize":1,
                            "max":3,
                            "userCallback" : function(t, i){
                                var mapping_function =  ["sedentary", "under-active", "regular", "active"];
                                return mapping_function[mapping_function.length - (i + 1)];
                           },
                        }
					}]
				},
			}
		};
        return config;
    },
    
    convert_encounters_to_data_for_performance_type : function(encounters, rapa_type){
        encounters = this.remove_duplicate_date_encounters(encounters);
        var data = [];
        encounters.forEach((encounter)=>{
            if(encounter.time == null) return; // skip invalid encounters
            data.push({
                x : encounter.time,
                y : encounter.performance[rapa_type],
            })
        })
        return data;
    },
    
    build_dataset_from_encounters : function(encounters, performance_key, display_title, color_choice, fill){
        if(typeof fill === "undefined") fill = false;
        
        // pick color which has not been used
        // helper data
        var color_options = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };
		var color = Chart.helpers.color;
        
        // get data
        var data = this.convert_encounters_to_data_for_performance_type(encounters, performance_key);
        
        // build dataset object
        var dataset = {
            label: display_title,
            backgroundColor: color(color_options[color_choice]).alpha(0.5).rgbString(),
            borderColor: color_options[color_choice],
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
        encounters.sort((a, b)=>{ return b.time - a.time; }) // sort encounters by time descending
        
        // if a date is found, then skip it, if not, add the date and add the encounter
        encounters.forEach((encounter)=>{
            if(dates_found.indexOf(encounter.formatted_time) > -1) return; // skip it
            dates_found.push(encounter.formatted_time);
            valid_encounters.push(encounter);
        })

        return valid_encounters;
    },
     
    
}


