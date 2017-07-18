<script type="text/javascript" src="${ ui.resourceLink("simpleformservice", "/initialize.js") }"></script>
<script>
    promise_requested_behavior.then((behavior_object)=>{
        instantiate_form(behavior_object);
    });
    
    function instantiate_form(behavior_object){
        var DOM = {
            holder :  document.getElementById("form_holder"),
        }
        DOM.holder.appendChild(behavior_object.display.form.dom);
    };
</script>
<div id = 'form_holder' style = 'width:100%;'></div>
