function IPhone(){
    this.currentWidth = window.innerWidth;
    this.checkOrientationChange();
    this.hideAddressBar();
    this.pad();
    if(("standalone" in window.navigator) && window.navigator.standalone ){
        document.getElementsByClassName("scores")[0].setAttribute("class","fullscreen");
    }
}

IPhone.prototype.hideAddressBar= function(){
    window.scrollTo(0,1);
};

IPhone.prototype.setOrientation = function(){
    if (window.innerWidth > window.innerHeight){
        document.body.setAttribute("class","horizontal");
    } else {
        document.body.setAttribute("class","vertical");
    }
};

IPhone.prototype.checkOrientationChange = function(){
    var that = this;
    setInterval(function(){
        if (that.currentWidth != window.innerWidth){
            that.currentWidth = window.innerWidth;
            that.setOrientation();
            that.hideAddressBar();
        }
    }, 100);
    this.setOrientation();
};

IPhone.prototype.pad = function(){
    var that = this;
    var pad = document.getElementsByClassName("pad")[0];

    var up = pad.getElementsByClassName("up")[0];
    new Tap(up);
    up.addEventListener("tap", function(){window.hoboman.keys = {"up": 1, "left":0, "right":0,"down":0}});

    var right = pad.getElementsByClassName("right")[0];
    new Tap(right);
    right.addEventListener("tap", function(){window.hoboman.keys = {"up": 0, "left":0, "right":1,"down":0}});

    var down = pad.getElementsByClassName("down")[0];
    new Tap(down);
    down.addEventListener("tap", function(){window.hoboman.keys = {"up": 0, "left":0, "right":0,"down":1}});

    var left = pad.getElementsByClassName("left")[0];
    new Tap(left);
    left.addEventListener("tap", function(){window.hoboman.keys = {"up": 0, "left":1, "right":0,"down":0}});
};

window.iphoneSupport = new IPhone();