//=============================================================================
// PC9 Plugins - Followers Follow Less Close.
// PC9_FollowerSpace.js
//=============================================================================

//It's important that this goes before anything otehr plug-in that modifies:
// Game_Follower.updateMove();

var Imported = Imported || {};
Imported.PC9_FollowerSpace = true;

var PeachClam9 = PeachClam9 || {};
PeachClam9.FollowerSpace = PeachClam9.FollowerSpace || {};
PeachClam9.FollowerSpace.version = 1.1;

//=============================================================================
 /*:
 * @plugindesc v1.1 Lets party followers lag a set number of tiles behind. 
 * Useful if your character sprites are large (or fat :P ).
 * @author PeachClamNine
 *
 * @param Follower Distance
 * @desc How many tiles are between each character.
 * Default: 1
 * @default 1
 *
 * @help
 * Be careful about putting this plug-in above any other plug-in that
 * modifies Game_Follower.updateMove(); or else that plug-in might not work.
 * 
 * Also: You can't set Follower Distance less than 1. It would make no sense to stack
 * the followers like that!
 * version 1.1
 * - Fixed bug with Gathering, if the player hadn't walked enough to fill out his last positions.
 * version 1.0
 * - Finished plugin!
 */
//=============================================================================

PeachClam9.Parameters = PluginManager.parameters('PC9_FollowerSpace');
PeachClam9.Param = PeachClam9.Param || {};
PeachClam9.Param.FollowerSpaceDistance = Math.max((Number(PeachClam9.Parameters['Follower Distance']) || 1), 1);

//=============================================================================
// Game_Player
//=============================================================================
PeachClam9.FollowerSpace.Game_Player_initialize = Game_Player.prototype.initialize;
Game_Player.prototype.initialize = function() {
    PeachClam9.FollowerSpace.Game_Player_initialize.call(this);
    this._lastPositions = new Array();
};

PeachClam9.FollowerSpace.Game_Player_clearTransferInfo = Game_Player.prototype.clearTransferInfo;
Game_Player.prototype.clearTransferInfo = function() {
    PeachClam9.FollowerSpace.Game_Player_clearTransferInfo.call(this);
	this.clearLastPositions();
};

Game_Player.prototype.getLastPositions = function() {
	return this._lastPositions;
};

Game_Player.prototype.popLastPositions = function() {
	this._lastPositions.pop();
};

Game_Player.prototype.clearLastPositions = function() {
	this._lastPositions.length = 0;
};

Game_Player.prototype.repeatLastPositions = function() {
	var currentPosition = [this.x, this.y];
	this._lastPositions.unshift(currentPosition)
};

PeachClam9.FollowerSpace.Game_Player_moveStraight = Game_Player.prototype.moveStraight;
Game_Player.prototype.moveStraight = function(d) {
    PeachClam9.FollowerSpace.Game_Player_moveStraight.call(this, d);
	if (this.isMovementSucceeded()) {
		var currentPosition = [this.x, this.y];
		this._lastPositions.unshift(currentPosition);
	}
};

PeachClam9.FollowerSpace.Game_Player_moveDiagonally = Game_Player.prototype.moveDiagonally;
Game_Player.prototype.moveDiagonally = function(horz, vert) {
    PeachClam9.FollowerSpace.Game_Player_moveDiagonally.call(this, horz, vert);
	if (this.isMovementSucceeded()) {
		var currentPosition = [this.x, this.y];
		this._lastPositions.unshift(currentPosition);
	}
};

//=============================================================================
// Game_Follower
//=============================================================================
Game_Follower.prototype.chasePlayerAtDistance = function(character, distance) {
	var spacesAway = distance;
	var spaces = $gamePlayer.getLastPositions();
	if (spaces.length < spacesAway) { return; }
	
    var sx = this.deltaXFrom(spaces[spacesAway - 1][0]);
    var sy = this.deltaYFrom(spaces[spacesAway - 1][1]);
	//TODO: reoptimize.
    if (Math.abs(sx) > 0 && Math.abs(sy) > 0) {
        this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
    } else if (Math.abs(sx) > 0) {
        this.moveStraight(sx > 0 ? 4 : 6);
    } else if (Math.abs(sy) > 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
    }
    this.setMoveSpeed($gamePlayer.realMoveSpeed());
};


//=============================================================================
// Game_Followers
//=============================================================================
Game_Followers.prototype.updateMove = function() {
	var spacing = 0;
	//for (var i = this._data.length - 1; i >= 0; i--) {
	for (var i = 0; i < this._data.length; i++) {
        var precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
		spacing += PeachClam9.Param.FollowerSpaceDistance;
        this._data[i].chasePlayerAtDistance(precedingCharacter, spacing);
    }
	
	//TODO: for weight gain script, set spacing based on this.actor().weightLvl()
	
	if ($gamePlayer.getLastPositions().length - 1 > spacing * (this._data[this._data.length - 1]._memberIndex + 1))
	{
		$gamePlayer.popLastPositions();
	}
	
	if (this.areGathering())
	{
		$gamePlayer.repeatLastPositions();
	}
};

PeachClam9.FollowerSpace.Game_Followers_jumpAll = Game_Followers.prototype.jumpAll;
Game_Followers.prototype.jumpAll = function() {
	PeachClam9.FollowerSpace.Game_Followers_jumpAll.call(this);
	$gamePlayer.clearLastPositions();
};

Game_Followers.prototype.synchronize = function(x, y, d) {
    this.forEach(function(follower) {
        follower.locate(x, y);
        follower.setDirection(d);
    }, this);
};