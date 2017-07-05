<script>
promise_to_load_requested_behavior.then(function(){
    data_control_singleton.DOM.history = {
        chart_canvas : document.getElementById("history_chart_canvas"),
    }
    data_control_singleton.instantiate_history();
});
</script>

<div class = '' style = 'width:100%; display:flex; padding:20px 10px; '>
    <div class = 'healthy_tile' style = 'min-height:50px; margin:auto; width:100%; max-width:800px; padding:10px; ' >
        <!-- history graph -->
        <div style = 'display:flex; width:100%; '>
            <div style = 'width:100%; max-width:700px; min-height:100px; margin:auto; padding:5px; '>
                <canvas id="history_chart_canvas" style = ''></canvas>
            </div>
        </div>
        <div style = 'height:15px;'></div>

        
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

