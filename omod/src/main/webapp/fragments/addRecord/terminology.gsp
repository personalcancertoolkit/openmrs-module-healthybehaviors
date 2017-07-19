<script>
    promise_requested_behavior.then((behavior_object)=>{
        instantiate_terminology(behavior_object);
    });
    
    function instantiate_terminology(behavior_object){
        if(behavior_object.data.uptodate !== false) return;
        var DOM = {
            holder :  document.getElementById("terminology_holder"),
        }
        DOM.holder.appendChild(behavior_object.display.terminology.dom);
    };
</script>

<div id = 'terminology_holder' style = 'width:100%;'></div>
