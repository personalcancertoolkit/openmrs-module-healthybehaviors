<script>
window.addEventListener("load", function(){
    var ctx = document.getElementById("adviceAndHistory_history_graph").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
});
</script>


<div class = '' style = 'width:100%; display:flex; padding:20px 10px; '>
    <div class = 'healthy_tile' style = 'min-height:50px; margin:auto; width:100%; max-width:800px; padding:10px; ' >
        <!-- history graph -->
        <div style = 'display:flex; width:100%; '>
            <div style = 'width:100%; max-width:700px; min-height:100px; margin:auto; padding:5px; '>
                <canvas id="adviceAndHistory_history_graph"></canvas>
            </div>
        </div>
        <div style = 'height:15px;'></div>
        
        <!-- history data -->
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
        
    </div>
</div>

