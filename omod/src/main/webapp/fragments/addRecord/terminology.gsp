<div class = '' style = 'width:100%; display:flex; padding:20px 10px; '>
    <div class = 'healthy_tile' style = 'min-height:50px; margin:auto; width:100%; max-width:900px; padding:10px; ' >
        
        
        <div style = 'height:10px;'></div>
        
        <!-- intro -->
        <div style = 'display:flex; width:100%; '>
            <div id = '' style = 'width:100%; max-width:800px;margin:auto; padding:5px; '>
                <div id = '' style = 'display:'>
                    <div style = ''>
                        Examples of Physical Intensity Levels
                    </div>
                </div>
            </div>
        </div>
        

        <div style = 'height:15px;'></div>
        <div style = 'display:flex;'>
            <div style = 'margin:auto; width:90%; border-bottom:1px solid rgba(128, 128, 128, 0.17);'></div>
        </div>
        <div style = 'height:15px;'></div>
        
        
        <style>
            .exercise_terminology_example_image_description{
                
            }
        </style>
        <script>
            var exercise_terminology_DOM_builder = {
                holder : null,
                template : {
                    row : null,
                    example : null,
                    bull : null,
                },
                data : null,
                
                initialize : function(){
                    var data = this.data;
                    for(var i = 0; i < data.length; i++){
                        console.log("row " + i);
                        var this_row_data = data[i];
                        var row_element = this.create_row_from_data(this_row_data); 
                        this.holder.appendChild(row_element);
                    }
                },
                
                create_row_from_data : function(row_data){
                    // create deep clone of node
                    var row_element = this.template.row.cloneNode(true);
                    
                    // update head title
                    jq(row_element).find(".exercise_terminology_activity_type").html(row_data.head.title);
                    
                    // add bullet points to head
                    for(var i = 0; i < row_data.head.bulls.length; i++){
                        var this_bull_data = row_data.head.bulls[i];
                        var this_bull_element = this.template.bull.cloneNode(true);
                        jq(this_bull_element).find(".exercise_terminology_bullet_point_text").html(this_bull_data); 
                        jq(row_element).find(".exercise_terminology_activity_type_bullet_point_holder").append(this_bull_element);
                    }
                    
                    // add examples to body
                    for(var i = 0; i < row_data.examples.length; i++){
                        var this_example_data = row_data.examples[i];
                        var this_example_element = this.template.example.cloneNode(true);
                        jq(this_example_element).find(".exercise_terminology_example_image").attr('src', this_example_data.src);
                        if(typeof this_example_data.max_width !== "undefined") jq(this_example_element).css('width', (this_example_data.max_width+30) + "px");
                        if(typeof this_example_data.max_width !== "undefined") jq(this_example_element).find(".exercise_terminology_example_image").css('max-width', this_example_data.max_width + "px");
                        jq(this_example_element).find(".exercise_terminology_example_description").html(this_example_data.desc);
                        jq(row_element).find(".terminology_exercise_example_image_holder").append(this_example_element);
                    }
                    
                    return row_element;
                },
                
            }
            window.addEventListener("load", function(){
                exercise_terminology_DOM_builder.holder = document.getElementById("terminology_exercise_example_holder"),
                exercise_terminology_DOM_builder.template = {
                    row : document.getElementById("exercise_terminology_row_template"),
                    example : document.getElementById("exercise_terminology_example_template"),
                    bull : document.getElementById("exercise_terminology_bullet_point_template"),
                };
                exercise_terminology_DOM_builder.data = [
                    {
                        head : {
                            title : "Light Activities",
                            bulls : [
                                "Your heart beats slightly faster than normal",
                                "You can talk and sing"
                            ]
                        },
                        examples : [
                            {
                                src : "/openmrs/ms/uiframework/resource/healthybehaviors/images/behavior_specific/exercise/walking_leisurely.png",
                                desc : "Walking Leisurely",
                            },
                            {
                                src : "/openmrs/ms/uiframework/resource/healthybehaviors/images/behavior_specific/exercise/stretching.png",
                                desc : "Stretching",
                            },
                            {
                                src : "/openmrs/ms/uiframework/resource/healthybehaviors/images/behavior_specific/exercise/vacuuming_etc.png",
                                desc : "Vacuuming or Light Yard Work",
                            }
                        ]
                    }, 
                    {
                        head : {
                            title : "Moderate Activities",
                            bulls : [
                                "Your heart beats faster than normal",
                                "You can talk but not sing"
                            ]
                        },
                        examples : [
                            {
                                src : "/openmrs/ms/uiframework/resource/healthybehaviors/images/behavior_specific/exercise/fast_walking.png",
                                desc : "Fast Walking",
                            },
                            {
                                src : "/openmrs/ms/uiframework/resource/healthybehaviors/images/behavior_specific/exercise/aerobics_class.png",
                                desc : "Aerobics Class",
                                max_width : 100,
                            },
                            {
                                src : "/openmrs/ms/uiframework/resource/healthybehaviors/images/behavior_specific/exercise/strength_training.png",
                                desc : "Strength Training",
                            },
                            {
                                src : "/openmrs/ms/uiframework/resource/healthybehaviors/images/behavior_specific/exercise/swimming_gently.png",
                                desc : "Swimming Gently",
                                max_width : 100,
                            }
                        ]
                    },
                    {
                        head : {
                            title : "Vigorous Activities",
                            bulls : [
                                "Your heart rate increases a lot",
                                "You can't talk or your talking is broken up by large breaths"
                            ]
                        },
                        examples : [
                            {
                                src : "/openmrs/ms/uiframework/resource/healthybehaviors/images/behavior_specific/exercise/stair_machine.png",
                                desc : "Stair Machine",
                            },
                            {
                                src : "/openmrs/ms/uiframework/resource/healthybehaviors/images/behavior_specific/exercise/jogging_or_running.png",
                                desc : "Jogging or Running",
                            },
                            {
                                src : "/openmrs/ms/uiframework/resource/healthybehaviors/images/behavior_specific/exercise/tennis_etc.png",
                                desc : "Tennis, Racquetball, Pickleball, or Badminton",
                                max_width : 170,
                            }
                        ]
                    }
                ];
                exercise_terminology_DOM_builder.initialize();
            });
        </script>
        
        <div style = 'display:flex; width:100%; '>
            <div id = '' style = 'width:100%; max-width:800px;margin:auto; padding:5px; '>
                <div id = 'terminology_exercise_example_holder' style = 'display:'>

                    <!-- row -->
                    
                    
                    
                </div>
            </div>
        </div>
        
        <div style = 'height:10px;'></div>
    </div>
</div>

<div style = 'display:none;'>
    
    <div id = 'exercise_terminology_bullet_point_template' style = 'font-size:14px; display:flex;'>
        <div>&bull; &nbsp;</div>
        <div class = 'exercise_terminology_bullet_point_text'>Your heart beats slightly faster than normal</div>
    </div>
    
    <div id = 'exercise_terminology_example_template' style = 'display:flex;  margin:auto; display:flex; flex-direction:column; width:120px; text-align:center;'>
        <div style = 'display:flex; height:130px;'>
            <div style = 'margin:auto;'>
                <img class = 'exercise_terminology_example_image' src = '' style = 'max-width:90px; max-height:130px;'>
            </div>
        </div>
        <div style = 'display:flex; width:100%; min-height:40px;'>
            <div class = 'exercise_terminology_example_description' style = 'margin:auto; margin-top:0px;'>

            </div>
        </div>
    </div>
    
    <div id = 'exercise_terminology_row_template' style = 'display:flex; width:100%; flex-wrap:wrap; '>
        <div style = 'display:flex; flex:1 1 30%; '>
            <div style = 'margin:auto; margin-left:0px;'>
                <div style = 'margin-top:-10px;'></div>
                <div class = 'exercise_terminology_activity_type' style = 'font-size:18px;'>Light Activities</div>
                <div style = 'height:5px;'></div>
                <div class = 'exercise_terminology_activity_type_bullet_point_holder'></div>
            </div>
        </div>

        <div class = 'terminology_exercise_example_image_holder' style = 'display:flex; flex-grow:1;  justify-content:center;'>


        </div>
    </div>
</div>