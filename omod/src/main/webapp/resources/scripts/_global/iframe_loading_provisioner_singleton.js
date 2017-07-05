/*
    This object is responsible for ensuring that when the module is displayed through an iframe, the parent window experiences an optimal environment
    
    Note, if a page is loaded in an iframe, this object sends a message to the parent window with the current height upon resize or dom change (mutation).
    Parent window should have a listener, for example
    
    window.addEventListener("message", function(e){
        var this_frame = document.getElementById("healthy_behavior_iframe");
        if (this_frame.contentWindow === e.source) {
            this_frame.height = e.data.height + "px";
            this_frame.style.height = e.data.height + "px";
        }
    })
*/
var iframe_loading_provisioner_singleton = {
    initialize : function(){
        if(window.self === window.top) return; // if w.self === w.top, we are not in an iframe 
        
        // remove buffers if we're loaded in an iframe
        window.addEventListener("load", this.remove_buffers_if_in_iframe.bind(this));

        // send message to parent about height updates
        this.send_height_to_parent(); // on page load
        window.addEventListener("resize", this.send_height_to_parent.bind(this)); // whenever the page is resized
        var observer = new MutationObserver(this.send_height_to_parent.bind(this));           // whenever DOM changes PT1
        var config = { attributes: true, childList: true, characterData: true, subtree:true}; // PT2
        observer.observe(window.document, config);                                            // PT3
    },
    
    

    remove_buffers_if_in_iframe : function(){
        jq(document).find(".margintop_buffers_hidden_in_iframe").css("margin-top", "0px;");
    },

    send_height_to_parent : function(){
        //console.log(parent);
        var height = document.getElementsByTagName("html")[0].clientHeight;
        //console.log("Sending height as " + height + "px");
        parent.postMessage({"height" : height }, "*");
    },
}