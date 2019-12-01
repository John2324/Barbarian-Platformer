/* Game namespace */
var game = {
    // Run on page load.
    onload : function () {
        // Initialize the video.
        if (!me.video.init(960, 640, {wrapper : "screen", scale : "auto", scaleMethod: "fixed-width"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    // Run on game resources loaded.
    loaded : function () {
        //Animate certain player sprite motions
        //game.texture = new me.video.renderer.Texture(
          //  me.loader.getJSON("walkingBarbarian"),
            //me.loader.getImage("walkingBarbarian")
        //);

        // Setting up game screens
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // Entities
        me.pool.register("walkingBarbarian", game.PlayerEntity);

        // Set a global fading transition for the screen
        me.state.transition("fade", "#000", 250);

        // Key bindings
        me.input.bindKey(me.input.KEY.A,  "left");
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.SPACE,  "jump", true);

        // Start the game.
        me.state.change(me.state.PLAY);
    }
};
