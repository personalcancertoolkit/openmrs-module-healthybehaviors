<script type="text/javascript" src="${ ui.resourceLink("healthybehaviors", "/scripts/adviceAndHistory/peer_functionality.js") }"></script>
<script type="text/javascript" src="${ ui.resourceLink("simpleformservice", "/initialize.js") }"></script>
<script>
    // build the peer selection options
    Promise.all([promise_requested_behavior, simpleformservice.promise.loaded])
        .then((data_array)=>{
            var behavior_object = data_array[0];
            return promise_to_access_data = simpleformservice.simple_permission_manager.retreive_data_access({encounter_type : behavior_object.data.encounter_type});
        })
        .then((access_data)=>{
            console.log("access data was recieved:");
            console.log(access_data);
            var DOM = {
                peers_list : document.getElementById("peer_peers_list"),
                peers_template : document.querySelector("#peer_template"),
                peers_none : document.getElementById("peer_peers_none"),
            }
            for(var i = 0; i < access_data.length; i++){
                var this_peer = access_data[i];
                var new_dom = DOM.peers_template.cloneNode(true);
                new_dom.querySelector("input").setAttribute("id", "peer_peer-" + i);
                new_dom.querySelector("input").value = this_peer["access_to_person_id"] + ":||:" + this_peer["access_to_person_name"];
                new_dom.querySelector("label").setAttribute("for", "peer_peer-" + i);
                new_dom.querySelector("label").innerHTML = this_peer["access_to_person_name"].capitalize();
                DOM.peers_list.appendChild(new_dom);
            }
            if(access_data.length == 0){
                DOM.peers_none.style.display = "block";
            }
        });
    
    // build metrics options 
    promise_requested_behavior
        .then((behavior_object)=>{
            var DOM = {
                metrics_list : document.getElementById("peer_metric_list"),
                metrics_template : document.querySelector("#metric_template"),
            }
            var chart_data = behavior_object.display.graph.peer_data;
            for(var i = 0; i < chart_data.length; i++){
                let this_data = chart_data[i];
                let new_dom = DOM.metrics_template.cloneNode(true);
                new_dom.querySelector("input").setAttribute("id", "peer_metric-" + i);
                new_dom.querySelector("input").value = this_data.performance_key;
                new_dom.querySelector("label").setAttribute("for", "peer_metric-" + i);
                new_dom.querySelector("label").innerHTML = this_data.metric_title;
                DOM.metrics_list.appendChild(new_dom);
            }
        });
</script>

<style>
    .healthy_radio label {
        font-weight:300;
        font-size: 14px;
        line-height: 18px;
    }

    .healthy_radio input[type="radio"],input[type="checkbox"] {
      display: none;
    }

    .healthy_radio input[type="radio"] ~ label {
        color: #bebebe;
        position: relative;
        cursor:pointer;
    }

    .healthy_radio input[type="checkbox"] ~ label {
        color: #bebebe;
        position: relative;
        cursor:pointer;
    }

    .healthy_radio input[type="radio"]:checked ~ label {
        color:rgb(8, 160, 255);
    }
    .healthy_radio input[type="checkbox"]:checked ~ label {
        color:rgb(8, 160, 255);
    }

    button {
        font-size: 14px;
        line-height: 18px;
        color:rgb(8, 160, 255);
        position: relative;
        cursor:pointer;
        background-color:white;
        border:1px solid rgb(8, 160, 255);
        border-radius:1px;
    }    
    button:active {
        background-color:rgba(8, 160, 255, 0.10);
    }
</style>


<div id = 'peer_review_holder' style = 'width:100%; display:flex; padding:20px 10px; '>
    <div class = 'healthy_tile' style = 'min-height:50px; margin:auto; width:100%; max-width:800px; ' > 
        <div style = 'height:15px;'></div>       
        <!-- intro -->
        <div style = 'display:flex; width:100%; padding:0px 10px; '>
            <div id = '' style = 'width:100%; max-width:700px;margin:auto; padding:5px; '>
                <div id = '' style = 'display:'>
                    <div style = 'font-size:18px;'>
                        Compare Your Performance
                    </div>
                </div>
            </div>
        </div>
        
        <!-- comparison options -->
        <div  id = 'peer_options' style ='width:100%; max-width:700px;margin:auto; padding:5px;'>
            <!-- metrics list -->
            <div id = 'peer_metric_list' style = '  display:flex; margin:auto; justify-content:flex-start; text-align:center;'>
                <div style = 'font-size:15px; display:flex; padding-left:15px;'>
                    <div style = 'margin:auto; margin:auto 15px;'>
                        Select a Metric : 
                    </div>
                </div>
                <div style = 'display:none' id = ''>
                    <div id = 'metric_template' class="healthy_radio" title = "" style = 'margin:5px 10px; display:flex;'>
                        <input onchange = 'peer_functionality.attempt_comparison("metric")' type="radio" id = 'peer_metric-' name="peer_metric_option" value="0"  />
                        <label for ='peer_metric-' style = 'font-size:15px; margin:auto;'>   </label>
                    </div>
                </div>
            </div>
            
            <!-- peers list -->
            <div id = 'peer_peers_list' style = '  display:flex; margin:auto; justify-content:flex-start; text-align:center;'>
                <div style = 'font-size:15px; display:flex; padding-left:15px;'>
                    <div style = 'margin:auto; margin:auto 15px;'>
                        Select up to 5 Peers : 
                    </div>
                </div>
                <div style = 'display:none' id = 'peer_peers_none'>
                    <div id = '' class="" title = "" style = 'margin:5px 10px; display:flex;'>
                        Sorry, you have no buddies that have shared their data with you!
                    </div>
                </div>
                <div style = 'display:none' id = ''>
                    <div id = 'peer_template' class="healthy_radio" title = "" style = 'margin:5px 10px; display:flex;'>
                        <input onchange = 'peer_functionality.attempt_comparison("peer")' type = 'checkbox' id = 'peer_peer-' name="peer_peers_option" value="0"  />
                        <label for ='peer_peer-' style = 'font-size:15px; margin:auto;'>   </label>
                    </div>
                </div>
            </div>
            
            <div style = 'height:15px;'></div>
            <!-- action button -->
        </div>
        
        
        

        <div  id = 'peer_display' style = 'display:none' >
            
                
                
            <!-- history graph -->
            <div style = 'display:flex; width:100%; position:relative;'>
                    
                <div id = 'peer_chart_loading' style = 'position:absolute; display:flex; top:0px; left:0px; right:0px; bottom:0px; background-image: linear-gradient(to bottom right,rgba(255, 255, 255, 0.8),rgba(255, 255, 255, 0.3));'>
                    <div id = '' style = 'margin:auto;'>
                        <style>
                            .loader {
                                border: 12px solid #f3f3f3; /* Light grey */
                                border-top: 12px solid #3498db; /* Blue */
                                border-radius: 50%;
                                width: 75px;
                                height: 75px;
                                animation: spin 1.3s linear infinite;
                            }

                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        </style>
                        <div class="loader" style = 'margin-top:-35px;'></div>
                    </div>
                </div>
                <style>
                    #peer_graph_holder{
                        width:100%; max-width:700px; min-height:100px; margin:auto; padding:5px; 
                    }
                </style>
                <div id = 'peer_graph_holder'>
                    <canvas></canvas>
                </div>
            </div>
        </div>
        
        <!-- 
        <a id = 'peer_submission_button' onclick = 'peer_functionality.attempt_comparison()' style = 'padding:10px; display:flex; min-height:60px; ' class = 'behavior_tile_button  behavior_tile_button_disabled_modifier '>
            <div style = 'width:45px'></div>
            <div style = 'display:flex; min-width:35px; '>
                <div style = 'margin:auto; '>
                    <span class = 'glyphicon glyphicon-stats' style = 'font-size:18px;'></span>
                </div>
            </div> 
            <div style = 'min-width:10px;'></div>
            <div style = 'display:flex;'>
                <div class = '' style = 'margin:auto;'>
                    COMPARE
                </div>
            </div> 
        </a>        
        <a id = 'peer_back_button' onclick = 'peer_functionality.display_options()' style = 'padding:10px; display:none; min-height:60px; ' class = 'behavior_tile_button   '>
            <div style = 'width:45px'></div>
            <div style = 'display:flex; min-width:35px; '>
                <div style = 'margin:auto; '>
                    <span class = 'glyphicon glyphicon-triangle-left' style = 'font-size:18px;'></span>
                </div>
            </div> 
            <div style = 'min-width:10px;'></div>
            <div style = 'display:flex;'>
                <div class = '' style = 'margin:auto;'>
                    BACK
                </div>
            </div> 
        </a>
        -->
        
        
        
    </div>
    

</div>

