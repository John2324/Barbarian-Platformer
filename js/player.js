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
      switch (response.b.body.collisionType) {
        case me.collision.types.WORLD_SHAPE:
          // Simulate a platform object
          if (other.type === "platform") {
            if (this.body.falling &&
              !me.input.isKeyPressed('down') &&
    
              // Shortest overlap would move the player upward
              (response.overlapV.y > 0) &&
    
              // The velocity is reasonably fast enough to have penetrated to the overlap depth
              (~~this.body.vel.y >= ~~response.overlapV.y)
            ) {
              // Disable collision on the x axis
              response.overlapV.x = 0;
    
              // Repond to the platform (it is solid)
              return true;
            }
    
            // Do not respond to the platform (pass through)
            return false;
          }
          break;
    
        case me.collision.types.ENEMY_OBJECT:
          if ((response.overlapV.y>0) && !this.body.jumping) {
            // bounce (force jump)
            this.body.falling = false;
            this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
    
            // set the jumping flag
            this.body.jumping = true;
          }
          else {
            // let's flicker in case we touched an enemy
            this.renderable.flicker(750);
          }
    
          // Fall through
    
        default:
          // Do not respond to other objects (e.g. coins)
          return false;
      }
    
      // Make the object solid
      return true;
    }
  });
