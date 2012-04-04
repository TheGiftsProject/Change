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
    })
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


$(document).ready(function(){
    window.highscore = new HighScore();
    window.menus = new Menus();
});
