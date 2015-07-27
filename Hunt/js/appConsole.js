(function ($, undefined) {

    window.appConsole = {
        log: function (message, isError, container) {
            var lastContainer = $(".console div:first", container),
                lastMessage = lastContainer.text();

            if (!lastContainer.length || message !== lastMessage) {
                $("<div" + (isError ? " class='error'" : "") + "/>")
                    .css({
                        marginTop: -24,
                        backgroundColor: isError ? "#ffbbbb" : "#FFEF72"
                    })
                    .html(message)
                    .prependTo($(".console", container))
                    .animate({
                        marginTop: 0
                    }, 300)
                    .animate({
                        backgroundColor: isError ? "#FFEF72" : "#ffffff"
                    }, 800)
                	.animate({
                        opacity: 0
                    }, 1200)
                	.animate({
                        marginTop: -24
                    }, 1200);
            } 
        },

        error: function (message) {
            this.log(message, true);
        },
        
        clear: function () {
        	$(".console").html("");
        }
    };
})(jQuery);