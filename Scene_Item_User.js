Scene_Item.prototype.user = function() {
    var members = $gameParty.movableMembers();
    var bestActor = members[0];
    for (var i = 0; i < members.length; i++) {
        if (members[i].actorId() == 2) {
            bestActor = members[i];
        }
    }
    return bestActor;
};
