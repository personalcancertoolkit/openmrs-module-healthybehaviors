<script>
    promise_to_load_requested_behavior.then(function(){
        data_control_singleton.DOM.terminology = document.getElementById("terminology_holder");
        data_control_singleton.instantiate_terminology();
    })
</script>
<div id = 'terminology_holder' style = 'width:100%;'></div>