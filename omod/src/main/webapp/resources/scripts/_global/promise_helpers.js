if(typeof window.global === "undefined") window["global"] = {};
global.promise_helpers = {
    
    // check if file exists, resolve or reject accordingly
    promise_that_file_exists : function(file_path){
        return new Promise((resolve, reject)=>{
            jQuery.get(file_path)
                .done(function() { 
                    resolve();
                    // exists code 
                }).fail(function(e) { 
                    if(e.status == 200) {
                        resolve();
                    } else {
                        reject(e);
                    }
                })
        });
    },
    
    promise_to_retreive_html : function(file_path){
        return new Promise((resolve, reject)=>{
            var view_url = file_path;
            jq.get( view_url, function( data ){
                resolve(data);
            });
        })
    }, 
    
    promise_to_load_javascript : function(file_path){
        return new Promise((resolve, reject)=>{
            var script_url = file_path;
            var script = document.createElement('script');
            script.setAttribute("src", script_url);
            script.onload = function(){
                resolve(true);
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }, 
    
    promise_to_load_css : function(file_path){
        return new Promise((resolve, reject)=>{
            var styles = document.createElement('link');
            styles.type = "text/css";
            styles.rel = 'stylesheet';
            styles.href = file_path;
            styles.onload = function(){
                //console.log("loaded style");
                resolve("success"); 
            };
            document.getElementsByTagName('head')[0].appendChild(styles);
        })
    },
    
    promise_to_retrieve_and_parse_json : function(file_path){
        return fetch(file_path)
            .then(function(response){ return response.json()})
    }, 
}