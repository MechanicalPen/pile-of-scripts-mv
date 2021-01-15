//=============================================================================
//PC9_ClunkyStateFace.js
//=============================================================================
//=============================================================================
 /*:
 * @plugindesc v1.0 Changes player faces based on States, but only in battle.
 * @author PeachClamNine
 *
 *
 * @help
 * I didn't write plugin params so if you need to change anything search for
 * "hero.isStateAffected(4)". the number (4) is the State ID. That's the
 * number on the side of the State in the States tab of the Database.
 * So, change that number to the States you wanna use!
 */
//=============================================================================

(function (){

var _PC9_BattleManager_updateTurnEnd = BattleManager.updateTurnEnd;
BattleManager.updateTurnEnd = function() {
	$gameParty.members().forEach(function(hero) {
		if(!hero._defaultFace){
			hero._defaultFace = hero.faceName();
		}
		if(hero.isStateAffected(4)){
            hero.setFaceImage(hero._defaultFace+"_puffy", hero.faceIndex());
        } else if (hero.isStateAffected(5)){
			hero.setFaceImage(hero._defaultFace+"_heavy", hero.faceIndex());
		} else {
			hero.setFaceImage(hero._defaultFace, hero.faceIndex());
		}
	}, this);
	_PC9_BattleManager_updateTurnEnd.call(this);
};

var _PC9_BattleManager_updateBattleEnd = BattleManager.updateBattleEnd;
BattleManager.updateBattleEnd = function() {
    $gameParty.members().forEach(function(hero) {
        if(!!(hero._defaultFace)){
			hero.setFaceImage(hero._defaultFace, hero.faceIndex());
		}
    }, this);
	_PC9_BattleManager_updateBattleEnd.call(this);
};

}());//EOF