function Menus(){
    this.screens = {
        start: $(".screen.start"),
        pause: $(".screen.pause"),
        game: $(".screen.game"),
        gameover: $(".screen.gameover")
    };

    this.screens.start.show();
    this.start();
    var that = this;
    $(".to_start").click(function(){
        that.goto(that.screens.start);
    });

    $(".to_game").click(function(){
        that.game();
    });

    $('.mute').click(function(){
        $(this).toggleClass("on").toggleClass("off");
        if ($(this).hasClass("on")){
            window.hoboman.mute();
            $(this).text("unmute");
        } else {
            window.hoboman.unmute();
            $(this).text("mute");
        }
    });
    this.currentScore = 0;
    $('.newhs .save').click(function(){
        window.highscore.set({score: that.currentScore, name: $(".newhs input").val() || "hoboman"});
        window.highscore.render();
        $(".newhs").addClass("hidden");
    });

}

Menus.prototype.goto = function(screen){
    var currentScreen = $(".screen:visible");
    currentScreen.css({top:"-744px"});

    screen.css({top:"0"});
    screen.show()
};

Menus.prototype.game = function(){
    this.goto(this.screens.game);
    window.hoboman = new HoboMan(document.getElementsByTagName('canvas')[0]);
};

Menus.prototype.start = function(){
    window.highscore.render()
};

Menus.prototype.gameOver = function(score){
    this.currentScore = score;
    this.goto(this.screens.gameover);

    var newhs = this.screens.gameover.find(".newhs").addClass("hidden");
    this.screens.gameover.find(".yourscore").text(score);
    if (window.highscore.isHighScore(score)){
        newhs.removeClass("hidden");
    }
};


$(document).ready(function(){
    window.highscore = new HighScore();
    window.menus = new Menus();
});
