(function($) {
    "use strict";

    $(document).on ('ready', function (){
        // ----------------------------- Counter Function
        var timer = $('.timer');
        if(timer.length) {
            timer.appear(function () {
              timer.countTo();
          })
        }
    });

})(jQuery)