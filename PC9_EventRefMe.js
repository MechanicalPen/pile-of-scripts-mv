//=============================================================================
// PC9 Plugins - Self Reference for Events
// PC9_EventRefMe.js
//=============================================================================

//=============================================================================
/*:
 * @plugindesc v1.0 use this.me() to refer to event in Event Editor
 * @author PeachClamNine
 *
 * @help
 * Use this.me() instead of this.character(0)
 * extra tips!:
 * this.character(-1) is the player, but you can just use $gamePlayer.
 *
 * version 1.0
 * - Finished plugin!
 */
//=============================================================================

Game_Interpreter.prototype.me = function() {
    if ($gameParty.inBattle() || !this.isOnCurrentMap()) {
        return null;
    } else {
        return $gameMap.event(this._eventId);
    }
};