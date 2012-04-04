function HighScore(){
    this.store = new Store("highscore");
    this.load();
}

HighScore.prototype.load = function(){
    this.scores = this.store.get("topscores") || [];
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
    if (this.scores.length == 0) return 0;
    return this.scores[0].score;
};

HighScore.prototype.topScores = function(){
    return this.scores.slice(0,5);
};

HighScore.prototype.isHighScore = function(score){
    if (this.scores.length < 5) return true;
    return score > this.topScores().reverse()[0].score;
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

