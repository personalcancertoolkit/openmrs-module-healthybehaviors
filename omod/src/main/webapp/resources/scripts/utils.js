utils = {};

utils.cookies = {
    create : function(name, value, days) {
        if(typeof value !== "string") value = JSON.stringify(value);
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    },
    read :  function(name, dont_decode) {
        var the_cookie = this.read_all()[name];
        if(typeof the_cookie == "undefined")
            return false;
        else if(dont_decode !== true) 
            return JSON.parse(the_cookie);
        else
            return the_cookie;
    },
    read_all : function(){
        var ca = document.cookie.split(';');
        var cookies = {};
        ca.forEach((c)=>{
            parts = c.split("=");
            cookies[parts[0].replace(/\s/g,'')] = parts[1];
        })
        return cookies;
    },
    erase : function(name){
        this.create(name,"",-1);
    }
}



utils.dev = {
    force_not_uptodate : function(behavior, uptodate_boolean){
        if(behavior == "e") behavior = "exercise";
        if(behavior == "n") behavior = "nutrition";
        utils.cookies.create("force_"+behavior, uptodate_boolean);
        console.log("scs");
    }
}