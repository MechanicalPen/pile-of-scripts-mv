(function() {
	
    var _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
Window_Base.prototype.convertEscapeCharacters = function(text) {
	var temptext = _Window_Base_convertEscapeCharacters.call(this, text);
	temptext = temptext.replace(/\x1bS\[(\d+)\]/gi, function() {
        return $gameSwitches.value(parseInt(arguments[1])) ? 'ON' : 'OFF';
    }.bind(this));
    return temptext;
};

})();