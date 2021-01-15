//=============================================================================
// PressOnceMove.js
//=============================================================================
/*:
 * @plugindesc Moves one tile per keypress.
 *
 * @author CakebBakeMaker
 *
 * @help
 *
 * Anything users might need to know about using your plugin.
 *
 * TERMS OF USE
 * Take only what you need and give freely.
 * MIT licensed.
 *
 */
 
 (function() {
	 
    var _Game_Player_initMembers = Game_Player.prototype.initMembers;
	Game_Player.prototype.initMembers = function() {
		_Game_Player_initMembers.call(this);
		this._hasStoppedMovemnt = true;
	};
	
	// override
	Game_Player.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove() && this._hasStoppedMovemnt) {
        var direction = this.getInputDirection();
        if (direction > 0) {
            $gameTemp.clearDestination();
        } else if ($gameTemp.isDestinationValid()){
            var x = $gameTemp.destinationX();
            var y = $gameTemp.destinationY();
            direction = this.findDirectionTo(x, y);
        }
        if (direction > 0) {
            this.executeMove(direction);
			this._hasStoppedMovemnt = false;
        }
    }
	
	if (!this.isMoving() && this.canMove() && !this._hasStoppedMovemnt) {
        var direction = this.getInputDirection();
        if (direction == 0) {
			this._hasStoppedMovemnt = true;
        }
    }
};
 })();