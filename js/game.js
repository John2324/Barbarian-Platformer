/* Game namespace */
var game = {
    // Run on page load.
    onload : function () {
        // Initialize the video.
        if (!me.video.init(960, 640, {wrapper : "screen", scale : "auto"})) {
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
        me.state.set(me.state.PLAY, new game.PlayScreen());

        //set a global fading transition for the screen
        me.state.transition("fade", "#000", 250);

        // Start the game.
        me.state.change(me.state.PLAY);
    }
};
