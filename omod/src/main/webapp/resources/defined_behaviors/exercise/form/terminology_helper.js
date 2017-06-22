var exercise_terminology_DOM_builder = {
    holder : null,
    template : {
        row : null,
        example : null,
        bull : null,
    },
    data : null,

    initialize : function(){
        this.define_data_and_elements();
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
    define_data_and_elements : function(){
        this.holder = document.getElementById("terminology_exercise_example_holder"),
        this.template = {
            row : document.getElementById("exercise_terminology_row_template"),
            example : document.getElementById("exercise_terminology_example_template"),
            bull : document.getElementById("exercise_terminology_bullet_point_template"),
        };
        this.data = [
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
                        src : "/openmrs/ms/uiframework/resource/healthybehaviors/defined_behaviors/exercise/images/walking_leisurely.png",
                        desc : "Walking Leisurely",
                    },
                    {
                        src : "/openmrs/ms/uiframework/resource/healthybehaviors/defined_behaviors/exercise/images/stretching.png",
                        desc : "Stretching",
                    },
                    {
                        src : "/openmrs/ms/uiframework/resource/healthybehaviors/defined_behaviors/exercise/images/vacuuming_etc.png",
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
                        src : "/openmrs/ms/uiframework/resource/healthybehaviors/defined_behaviors/exercise/images/fast_walking.png",
                        desc : "Fast Walking",
                    },
                    {
                        src : "/openmrs/ms/uiframework/resource/healthybehaviors/defined_behaviors/exercise/images/aerobics_class.png",
                        desc : "Aerobics Class",
                        max_width : 100,
                    },
                    {
                        src : "/openmrs/ms/uiframework/resource/healthybehaviors/defined_behaviors/exercise/images/strength_training.png",
                        desc : "Strength Training",
                    },
                    {
                        src : "/openmrs/ms/uiframework/resource/healthybehaviors/defined_behaviors/exercise/images/swimming_gently.png",
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
                        src : "/openmrs/ms/uiframework/resource/healthybehaviors/defined_behaviors/exercise/images/stair_machine.png",
                        desc : "Stair Machine",
                    },
                    {
                        src : "/openmrs/ms/uiframework/resource/healthybehaviors/defined_behaviors/exercise/images/jogging_or_running.png",
                        desc : "Jogging or Running",
                    },
                    {
                        src : "/openmrs/ms/uiframework/resource/healthybehaviors/defined_behaviors/exercise/images/tennis_etc.png",
                        desc : "Tennis, Racquetball, Pickleball, or Badminton",
                        max_width : 170,
                    }
                ]
            }
        ];
    }
}