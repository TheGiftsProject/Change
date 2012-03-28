function Menus(){
    this.screens = {
        start: $(".screen.start"),
//        pause: $(".screen.pause"),
        game: $(".screen.game")
//        highscore: $(".screen.highscore"),
//        gameover: $(".screen.gameover"),
//        about: $(".screen.about")
    };

    this.screens.start.show();
    var that = this;
    this.screens.start.find(".startgame").click(function(){
        console.log("HUH?");
        that.slideUp(that.screens.start);
        that.game();
    })
}

Menus.prototype.slideUp = function(screen){
    screen.css({top:"-744px"});
};

Menus.prototype.game = function(){
    this.screens.game.show();
    window.hoboman = new HoboMan(document.getElementsByTagName('canvas')[0]);
};


$(document).ready(function(){
    window.menus = new Menus();
});
