//=============================================================================
// PC9_less_wide_ui.js
//=============================================================================
/*:
 * @plugindesc Adjust some UI stuff to not be so wide.
 *
 * @author PC9
 *
 * @help
 *
 * place this plugin near the top!
 *
 *
 * TERMS OF USE
 * Take what you need and give freely.
 *
 */
 
 (function() {

//-----------------------------------------------------------------------------
// Window_Message
Window_Message.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    Window_Base.prototype.initialize.call(this, x, 0, width, height);
    this.openness = 0;
    this.initMembers();
    this.createSubWindows();
    this.updatePlacement();
};

Window_Message.prototype.windowWidth = function() {
    return 816;//Graphics.boxHeight;
};

Window_Message.prototype.createSubWindows = function() {
    this._goldWindow = new Window_Gold(0, 0);
    this._goldWindow.x = this.windowWidth() - this._goldWindow.width;
    this._goldWindow.openness = 0;
    this._choiceWindow = new Window_ChoiceList(this);
    this._numberWindow = new Window_NumberInput(this);
    this._itemWindow = new Window_EventItem(this);
};
    
 })();