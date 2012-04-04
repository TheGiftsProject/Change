function HighScore(){
    this.scores = [];
    this.store = new Store("highscore");
    this.load();
}

HighScore.prototype.load = function(){
    this.scores = this.store.get("topscores");
};

HighScore.prototype.save = function(){
    this.store.set("topscores", this.scores);
};

HighScore.prototype.set = function(score){
    if (score.score == 0) return;
    this.scores.push(score);
    this.scores.sort(function(x,y){
        return y.score - x.score;
    });
    this.save()
};

HighScore.prototype.bestScore = function(){
    return this.scores[0].score;
};

HighScore.prototype.topScores = function(){
    return this.scores.slice(0,5);
};


HighScore.prototype.render = function(){
    var parent = $("ul.highscores").empty();
    $(this.topScores()).each(function(){
        var li = $("<li>");
        li.append($("<span>").addClass("name").text(this.name));
        li.append($("<span>").addClass("hscore").text(this.score));
        parent.append(li);
    })
};

