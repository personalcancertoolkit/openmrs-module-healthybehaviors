// define structure behavior_data_loader_metadata
var behavior_data_loader_metadata = {
    resource_root : null,
    object : null, // also addressable as behavior_data_loader
    promise : {
        object : null,           
        enabled_behaviors : null,
        loaded : null, // this should be used in global scope to assess when behavior data is loaded.
    }
}

// set resource root
behavior_data_loader_metadata.resource_root = "/openmrs/ms/uiframework/resource/healthybehaviors/",
    
// promise to load the object
behavior_data_loader_metadata.promise.object = new Promise((resolve, reject)=>{
    var script_url = behavior_data_loader_metadata.resource_root + "scripts/_global/behavior_data_loader/object.js";
    var script = document.createElement('script');
    script.setAttribute("src", script_url);
    script.onload = function(){
        behavior_data_loader_metadata.object = behavior_data_loader;
        behavior_data_loader.resource_root = behavior_data_loader_metadata.resource_root;
        resolve("success");
    };
    document.getElementsByTagName('head')[0].appendChild(script);
})

// promise to load module_settings/enabled_behaviors
behavior_data_loader_metadata.promise.enabled_behaviors = new Promise((resolve, reject)=>{
    var request = jQuery.ajax({
        type:"HEAD", //Not get
        url: behavior_data_loader_metadata.resource_root + "_module_settings/enabled_behaviors.json",
    })
    request.onload()
    if(request.status == 404){  
        console.log("enabled_behaviors could not be found.")
        reject();
    } else {
        console.log("enabled_behaviors was successfully found!")
        resolve(); 
    }
})
    .then((data)=>{ // if enabled_behaviors.json exists
        return fetch(behavior_data_loader_metadata.resource_root + "_module_settings/enabled_behaviors.json")
          .then(function(response){ return response.json()})
    })
    .catch((data)=>{ // if enabled_behaviors.json does not exist
        return fetch(behavior_data_loader_metadata.resource_root + "_module_settings/enabled_behaviors.default.json")
          .then(function(response){ return response.json()})
    })


behavior_data_loader_metadata.promise.loaded = Promise.all([behavior_data_loader_metadata.promise.object, behavior_data_loader_metadata.promise.enabled_behaviors])
    .then((data_array)=>{
        var enabled_behaviors = data_array[1];
        console.log(data_array);
        behavior_data_loader_metadata.object.enabled_behaviors = enabled_behaviors;
        console.log("data loaded");
    })
    
    
    