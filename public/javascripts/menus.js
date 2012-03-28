function Menus(){
    this.screens = {
        start: $(".screen.start"),
        pause: $(".screen.pause"),
        game: $(".screen.game"),
        highscore: $(".screen.highscore"),
        gameover: $(".screen.gameover"),
        about: $(".screen.about")
    };

    this.screens.start.show();
    var that = this;
    $(".to_start").click(function(){
        that.goto(that.screens.start);
    });
    $(".to_game").click(function(){
        that.game();
    });
    $(".to_about").click(function(){
        that.goto(that.screens.about);
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


$(document).ready(function(){
    window.menus = new Menus();
});
