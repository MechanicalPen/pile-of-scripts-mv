/**
 * @method _updateDimmer
 * @private
 */
Weather.prototype._updateDimmer = function() {
    this._dimmerSprite.opacity = Math.floor(this.power * 12);
};

/**
 * @method _updateSnowSprite
 * @param {Sprite} sprite
 * @private
 */
Weather.prototype._updateSnowSprite = function(sprite) {
    sprite.bitmap = this._snowBitmap;
    sprite.rotation = Math.PI / 16;
    sprite.ax -= (3 + (this.power * 0.1)) * Math.sin(sprite.rotation);
    sprite.ay += (3 + (this.power * 0.1)) * Math.cos(sprite.rotation);
    sprite.opacity -= 3;
	//todo: do the proper plugin thing of calling the previous and running our code.
	sprite.scale.x = 1.0 + (this.power * 0.05);
	sprite.scale.y = 1.0 + (this.power * 0.05);
};