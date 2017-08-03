<script>
    
    // instantiate the history
    promise_requested_behavior.then((behavior_object)=>{
        var DOM = {
            holder : document.getElementById("graph_holder"),
            chart_canvas : document.getElementById("history_chart_canvas"),
        }
        var chart_data = behavior_object.display.graph.data;
        var chart_canvas = DOM.chart_canvas;
        var ctx = chart_canvas.getContext('2d');
        //console.log(ctx);
        new Chart(ctx, chart_data)  
    });

</script>

<div class = '' style = 'width:100%; display:flex; padding:20px 10px; '>
    <div class = 'healthy_tile' style = 'min-height:50px; margin:auto; width:100%; max-width:800px; padding:10px; ' > 
        <div style = 'height:15px;'></div>       
        <!-- intro -->
        <div style = 'display:flex; width:100%; '>
            <div id = '' style = 'width:100%; max-width:700px;margin:auto; padding:5px; '>
                <div id = '' style = 'display:'>
                    <div style = 'font-size:18px;'>
                        Your Performance History
                    </div>
                </div>
            </div>
        </div>
        
        <div style = 'height:15px;'></div>
        <!-- history graph -->
        <div style = 'display:flex; width:100%; '>
            <div id = 'graph_holder' style = 'width:100%; max-width:700px; min-height:100px; margin:auto; padding:5px; '>
                <canvas id="history_chart_canvas" style = ''></canvas>
            </div>
        </div>

        
        <!-- history data -->
        <!--
        <div style = 'display:flex; width:100%; '>
            <div style = 'width:100%; max-width:700px; min-height:100px; margin:auto; padding:5px; '>
                <TABLE style = 'width:100%;  '>
                    <TR style = 'font-size:18px;   '>
                        <TD> Time Period </TD>
                        <TD> Veggies Eaten</TD>
                        <TD> Fast Food Eaten </TD>
                    </TR> 
                    <TR>
                        <TD> Last Week </TD>
                        <TD> Place Holder </TD>
                        <TD> Place Holder </TD>
                    </TR>
                    <TR>
                        <TD> -2 Week </TD>
                        <TD> Place Holder </TD>
                        <TD> Place Holder </TD>
                    </TR>
                </TABLE>
            </div>
        </div>
        -->
        
    </div>
</div>

