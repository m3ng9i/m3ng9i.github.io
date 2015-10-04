$(function() {
    // set color of asterisk
    $(".mycandy-brand").hover(function() {
        $(this).children("sup").removeClass("mycandy-asterisk").addClass("mycandy-asterisk-hover");
    }, function() {
        $(this).children("sup").removeClass("mycandy-asterisk-hover").addClass("mycandy-asterisk");
    });

    // set color of rss logo
    $("#navbar-links ul[class~='navbar-right'] span[class~='fa-rss-square']").parent().hover(function() {
        $(this).children("span[class~='fa-rss-square']").removeClass("mycandy-rss").addClass("mycandy-rss-hover");
    }, function() {
        $(this).children("span[class~='fa-rss-square']").removeClass("mycandy-rss-hover").addClass("mycandy-rss");
    });

    // set responsive image
    $("article .mycandy-article img").addClass("img-responsive");

    // open a new window when click a github project url
    $("#navbar-links ul.mycandy-github a").each(function() {
        $(this).click(function() {
            window.open(this.href);
            return false;
        });
    });

    // set active class on navbar
    (function() {
        var navButton = $("#navbar-links > ul > li");

        var setNavActiveState = function() {
            var selected = null;

            switch(window.location.pathname) {
                case "/":                   selected = navButton.get(0); break;
                case "/html/about.html":    selected = navButton.get(2); break;
                case "/html/about_en.html": selected = navButton.get(3); break;
            }

            if (selected !== null) {
                $(selected).addClass("active");
            }
        };

        setNavActiveState();

        $(navButton.get(1)).on("show.bs.dropdown", function() {
            $(navButton.get(0)).removeClass("active");
            $(navButton.get(1)).removeClass("active");
        });

        $(navButton.get(1)).on("hide.bs.dropdown", function() {
            setNavActiveState();
        });
    })();


    // add "https://" or "http://" for pagelink in article page.
    (function() {
        var protocol = window.location.protocol;
        if (protocol != "") {
            var node = $("#content .mycandy-pagelink a").get(0);
            if (node) {
                node.innerText = protocol + "//" + node.innerText;
            }
        }
    })();

});
