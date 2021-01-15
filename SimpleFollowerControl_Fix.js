//============================================================================
// Karberus - Simple Follower Control
// SimpleFollowerControl.js
// Version 1.2+
// Editing by PeachClamNine to be able to look up followers by name and actorId.
// Now you can play ballons on followers by actor name and id too.

// No credit required. Can be used commercially or non commercially
//============================================================================
//============================================================================
var Imported = Imported || {};
Imported.SimpleFollowerOptions = true;

var Karberus = Karberus || {};
Karberus.FollowerOpt = Karberus.FollowerOpt || {};
//============================================================================
//============================================================================
/*:
 * @plugindesc v1.2 Allows you simple control over your followers.
 * @author Karberus (edited by PeachClamNine)
 * @version 1.2
 *
 *
 *
 * @param Follower Collision
 * @desc Whether events collide with your followers.
 * Default: false
 * @default false
 *
 *
 *@help This Plugin allows you to have some control over your followers.
 *
 *After using the Plugin Command to choose which follower to move,
 *in an event, use the Set Movement Route: Player command.
 *
 * The MoveActor or MoveActorId commands also can target the player.
 *
 *By default, your followers will go through walls and such. You must set
 *Through OFF in the set move route in order to disable this.
 *
 *If Through is set to OFF they will automatically skip if cannot move.
 *As of now, you can't change their speed or frequency.
 *You may only move one follower at a time.
 *
 *
 * //==============================================================================
 * //                  Plugin Commands
 * //==============================================================================
 *
 * //Overrides Set Move Route to allow you some control over your followers.
 *
 * MoveFollower x   //Where x equals: 0 = Player, 1 = First Follower, and so on.
 *
 * MoveActor x   //Where x equals actor name: MoveActor Harold for example.
 *
 * MoveActorId x   //Where x equals the actor's ID in the database: MoveActorId 3 for example.
 *
 * //Stops all follower movement, allowing you to move without them following you.
 *
 * StopFollowers true/false  //Example: StopFollowers true
 *
 * //Allows you to show balloon animation on your followers
 *
 * BalloonFollower x  //Where x equals: 0 = player, 1 = First Follower, and so on.
 *
 * BalloonActor x  //Where x equals actor name: BalloonActor Harold for example.
 *
 * BalloonActorID x //Where x equals the actor's ID in the database: BalloonActorID 3 for example.
 *
 * //==============================================================================
 * //==============================================================================
 *
 *
 */
 (function() {

Karberus.Parameters = PluginManager.parameters("SimpleFollowerControl");

Karberus.FollowerOpt.WhichFollower = 0;
Karberus.FollowerOpt.StopFollowers = false;
Karberus.FollowerOpt.FollowerCollision = String(Karberus.Parameters["Follower Collision"]);
Karberus.FollowerOpt.getIDforBalloon = 0;

var Karb_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        Karb_Game_Interpreter_pluginCommand.call(this, command, args);
         if (command === "MoveFollower") {
           Karberus.FollowerOpt.WhichFollower = args;
         }
		 if (command === "MoveActor") {
			 Karberus.FollowerOpt.WhichFollower = Karberus.FollowerOpt.getFollowerActorName(args.join(' '));
		 }
		 if (command === "MoveActorId" || command === "MoveActorID") {
			 Karberus.FollowerOpt.WhichFollower = Karberus.FollowerOpt.getFollowerActorId(args);
		 }
         if (command === "StopFollowers") {
           Karberus.FollowerOpt.StopFollowers = String(args);
         }
		 if (command === "BalloonFollower") {
           Karberus.FollowerOpt.getIDforBalloon = args[0];
         }
         if (command === "BalloonActor") {
           Karberus.FollowerOpt.getIDforBalloon = Karberus.FollowerOpt.getFollowerActorName(args.join(' '));
         }
		 if (command === "BalloonActorId" || command === "BalloonActorID") {
           Karberus.FollowerOpt.getIDforBalloon = Karberus.FollowerOpt.getFollowerActorId(args);
         }
};

Karberus.FollowerOpt.getFollowerActorId = function(actorId) {
	var foundFollower = -1;
	var followerCounter = 0;
	// check leader.
	if ($gameParty.leader() && $gameParty.leader().actorId() == actorId) {
		return -2;
	}
	// then check followers.
	$gamePlayer._followers.forEach(function(follower) {
		followerCounter++;
		if (follower.actor() && follower.actor().actorId() == actorId) {
				foundFollower = followerCounter;
			}
    }, this);
	return foundFollower;
};

Karberus.FollowerOpt.getFollowerActorName = function(actorName) {
	var foundFollower = -1;
	var followerCounter = 0;
	// check leader.
	if ($gameParty.leader() && $gameParty.leader().name() == actorName) {
		return -2;
	}
	// then check followers.
	$gamePlayer._followers.forEach(function(follower) {
		followerCounter++;
		if (follower.actor() && (follower.actor().name() == actorName ||
			"'" + follower.actor().name() + "'" == actorName ||
			'"' + follower.actor().name() + '"' == actorName)) {
				foundFollower = followerCounter;
			}
    }, this);
	return foundFollower;
};

_karb_Game_Interpreter_command213 = Game_Interpreter.prototype.command213;
Game_Interpreter.prototype.command213 = function() {
  if (Karberus.FollowerOpt.getIDforBalloon == -1){
	  Karberus.FollowerOpt.getIDforBalloon = 0;
	  return true;
  } else if (Karberus.FollowerOpt.getIDforBalloon > 0 || 
			 Karberus.FollowerOpt.getIDforBalloon == -2) {
    this._character = (Karberus.FollowerOpt.getIDforBalloon == -2) ? $gamePlayer : $gamePlayer._followers._data[Karberus.FollowerOpt.getIDforBalloon-1];
    if (this._character) {
        this._character.requestBalloon(this._params[1]);
        if (this._params[2]) {
            this.setWaitMode('balloon');
       }
	   Karberus.FollowerOpt.getIDforBalloon = 0;
    }
  }
  else {
    _karb_Game_Interpreter_command213.call(this);
  }
    return true;
};

// Set Movement Route
_karb_Game_Interpreter_command205 = Game_Interpreter.prototype.command205;
Game_Interpreter.prototype.command205 = function() {
	if (Karberus.FollowerOpt.WhichFollower == -1) {
		Karberus.FollowerOpt.WhichFollower = 0;
		return true;
	} else if (Karberus.FollowerOpt.WhichFollower > 0 ||
				Karberus.FollowerOpt.WhichFollower == -2) {
		$gameMap.refreshIfNeeded();
		this._character = (Karberus.FollowerOpt.WhichFollower == -2) ? $gamePlayer : $gamePlayer._followers._data[Karberus.FollowerOpt.WhichFollower-1];
		if (this._character) {
			this._character.forceMoveRoute(this._params[1]);
			if (this._params[1].wait) {
				this.setWaitMode('route');
			}
			Karberus.FollowerOpt.WhichFollower = 0;
		}
	} else {
		_karb_Game_Interpreter_command205.call(this);
	}
    return true;
};

Game_Player.prototype.isCollided = function(x, y) {
  if (eval(Karberus.FollowerOpt.FollowerCollision) === false) {
    if (this.isThrough()) {
        return false;
    } else {
        return this.pos(x, y);
    }
  }
  else {
    if (this.isThrough()) {
        return false;
    } else {
        return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
    }
  }
};


Game_Player.prototype.moveStraight = function(d) {
  if (eval(Karberus.FollowerOpt.StopFollowers) === false) {
    if (this.canPass(this.x, this.y, d)) {
        this._followers.updateMove();
    }
  }
    Game_Character.prototype.moveStraight.call(this, d);
};

})();
//============================================================================================
//=======================================END FILE=============================================
//============================================================================================
