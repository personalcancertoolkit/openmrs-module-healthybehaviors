<script type="text/javascript" src="${ ui.resourceLink("simpleformservice", "/initialize.js") }"></script>
<script>
    promise_to_load_requested_behavior.then(function(){
        data_control_singleton.DOM.form = document.getElementById("form_holder");
        data_control_singleton.instantiate_form();
    })
</script>
<div id = 'form_holder' style = 'width:100%;'></div>