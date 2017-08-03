Date.prototype.getWeek = function () { return $.datepicker.iso8601Week(this); }
String.prototype.capitalize = function() { 
    var string = this;
    parts = string.split(" ");
    final_parts = [];
    parts.forEach(function(part){
        final_parts.push(part.charAt(0).toUpperCase() + part.slice(1));
    })
    return final_parts.join(" ") 
}