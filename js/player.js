game.PlayerEntity = me.Entity.extend({
    /**
     * constructor
     */
    init : function (x, y, settings) {
      // call the constructor
      this._super(me.Entity, 'init', [x, y, settings]);
  
      // max walking & jumping speed
      this.body.setMaxVelocity(5, 18);
      this.body.setFriction(0.5, 0);
  
      // set the display to follow our position on both axis
      me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.5);
  
      // ensure the player is updated even when outside of the viewport
      this.alwaysUpdate = true;

      // define a jumping animation
      this.renderable.addAnimation("jumping", [30, 31, 32, 33, 34, 35], 35);
  
      // define a basic standing animation
      this.renderable.addAnimation("stand", [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 23], 16);
  
      // define a walking animation
      this.renderable.addAnimation("walk", [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], 35);
  
      // set initial standing animation as default
      this.renderable.setCurrentAnimation("stand");
    },
  
    /**
     * update the entity
     */
    update : function (dt) {
  
        if (me.input.isKeyPressed('left')) {
  
            // flip the sprite on horizontal axis
            this.renderable.flipX(true);
            // update the default force
            this.body.force.x = -this.body.maxVel.x;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (me.input.isKeyPressed('right')) {
  
            // unflip the sprite
            this.renderable.flipX(false);
            // update the entity velocity
            this.body.force.x = this.body.maxVel.x;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }            
        } else {
            this.body.force.x = 0;
            // change to the standing animation
            this.renderable.setCurrentAnimation("stand");
        }
  
        if (me.input.isKeyPressed('jump')) {

          if (!this.body.jumping && !this.body.falling)
          {
              // set current vel to the maximum defined value
              // gravity will then do the rest
              this.body.vel.y = -this.body.maxVel.y * me.timer.tick;

              this.body.jumping = true;
          }
        } 

        // apply physics to the body (this moves the entity)
        this.body.update(dt);
  
        // handle collisions against other shapes
        me.collision.check(this);
  
        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
  
    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
      // Make all other objects solid
      return true;
    }
  });
  