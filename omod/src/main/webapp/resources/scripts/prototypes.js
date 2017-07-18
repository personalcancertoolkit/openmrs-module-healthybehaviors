Date.prototype.getWeek = function () { return $.datepicker.iso8601Week(this); }
String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); }