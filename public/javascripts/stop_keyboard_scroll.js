var ar=new Array(33,34,35,36,37,38,39,40);

$(document).keydown(function(e) {
     var key = e.which;
      if($.inArray(key,ar) > -1) {
          e.preventDefault();
          return false;
      }
      return true;
});