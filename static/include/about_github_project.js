var REPOS = [
    "Ran",          "使用 Go 写的静态 web 服务器。支持 gzip 压缩、digest 身份认证、日志输出、自定义 404 文件等功能。",
    "QReader",      "一个使用 Go 和 JavaScript 编写的 RSS 阅读器。支持标签、文章加星、设置 feed 更新周期与文章保留数量、文章搜索等功能。",
    "Feedreader",   "RSS 2.0 和 Atom 1.0 解析模块，供 QReader 调用。",
    "go-utils",     "Go 工具包。",
    "godi",         "用来检查一个 Go 程序包依赖哪些其他包的命令行工具，调用 go list 命令获取包依赖信息。",
    "IP-resolver",  "一个命令行工具，同时调用多个 DNS 查询同一个域名的 IP 地址，并显示对比结果。",
];

function createReposHtml() {
    var apiurl = "https://api.github.com/users/m3ng9i/repos";

    $("#project").html("<span><span class='fa fa-refresh fa-spin'></span> 加载中 ...</span>");

    var githubHtml = localStorage.aboutPageGithubHtml || "";
    var timeDiff = Math.round(($.now() - parseInt(localStorage.aboutPageLastRequest || 0)) / 60000); // minutes from last request

    // if githubHtml is not empty and last request time < 15 minutes, load the cache.
    if (githubHtml != "" && timeDiff < 15) {
        showRepos(githubHtml);
        console.log("Load github project cache saved " + timeDiff + " minutes ago.");
        return;
    }

    $.getJSON(apiurl, function(data) {

        githubHtml = createReposTable(data, REPOS);

        // save cache
        localStorage.aboutPageGithubHtml = githubHtml;
        localStorage.aboutPageLastRequest = $.now();

        // display repos info
        showRepos(githubHtml);

    }).fail(function() {

        var error = "<span class='text-danger'>" +
            "<span class='fa fa-warning'></span> 获取 github 项目信息出错，请稍后" +
            "<a href='' onclick='createReposHtml();return false;'>刷新</a>重试。</span>";

        // if cache is too old (saved 6 hours ago), show error
        if (timeDiff > 360 || githubHtml == "") {
            $("#project").html(error);
        } else {
            showRepos(githubHtml);
            console.warn("Could not fetch " + apiurl + ", load cache saved " + timeDiff + " minutes ago.");
        }
    });

}

function createReposTable(data, repos) {

    var dateString = function(date) {
        var d = new Date(date);
        if (isNaN(d.valueOf())) {
            return "无法获取";
        }

        var month = d.getMonth() + 1;
        month = (month < 10) ? "0" + month : month;

        var day = d.getDate();
        day = (day < 10) ? "0" + day : day;

        var hours = d.getHours();
        hours = (hours < 10) ? "0" + hours : hours;

        var minutes = d.getMinutes();
        minutes = (minutes < 10) ? "0" + minutes : minutes;

        var timezone = (0 - Math.round(d.getTimezoneOffset() / 60)) * 100;
        var sign = (timezone > 0) ? "+" : "-";
        timezone = sign + ((timezone < 1000) ? "0" + timezone : timezone);
        return d.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + " " + timezone;
    };

    var html = "";

    for (var i = 0; i < repos.length; i += 2) {
        for (var j = 0; j < data.length; j++) {
            if (repos[i].toLowerCase() == data[j].name.toLowerCase()) {
                var size = data[j].size;
                if (size == 0) {
                    size = "未知";
                } else {
                    size = size + "KB";
                }
                html += "<tbody title='点击跳转到 github 页面' tabindex='0' data-github-url='" + data[j].html_url + "'>" +
                    "<tr><th>" +
                    "<span><span class='fa fa-github-alt'></span> " + repos[i] + "</span>" +
                    "<span>" + data[j].stargazers_count + " <span class='fa fa-star-o star-o mycandy-github-star'></span></span>" +
                    "</th></tr>" +
                    "<tr><td>" + repos[i + 1] + "</td></tr>" +
                    "<tr><td>Github 地址：" + data[j].html_url + "</td></tr>" +
                    "<tr><td>主要语言：" + data[j].language + "</td></tr>" +
                    "<tr><td>大小：" + size + "</td></tr>" +
                    "<tr><td>最近更新：" + dateString(data[j].pushed_at) + "</td></tr>" +
                    "<tr><td>&nbsp;</td></tr>" +
                    "</tbody>";
            }
        }
    }

    html = "<table class='mycandy-about-github'>" + html + "</table>";

    return html;
}

function showRepos(html) {
    $("#project").html(html);

    var tbody =$("table.mycandy-about-github > tbody");

    // bind onclick and onkeypress event
    tbody.each(function() {
        var url = $(this).attr("data-github-url");
        $(this).click(function() {
            window.open(url);
        });
        $(this).keypress(function(event) {
            if (event.keyCode == 13) {
                window.open(url);
            }
        });
    });

    var mouseover = function(one) {
        // if other tbody is highlighted, remove the highlight style.
        tbody.each(function() {
            if (this != one) {
                mouseout(this);
            }
        });

        $(one).addClass("mycandy-about-mouseover");
        var e = $(one.getElementsByClassName("mycandy-github-star"));
        e.addClass("mycandy-star");
        e.removeClass("mycandy-star-o");
        e.addClass("fa-star");
        e.removeClass("fa-star-o");
    };

    var mouseout = function(one) {
        $(one).removeClass("mycandy-about-mouseover");
        var e = $(one.getElementsByClassName("mycandy-github-star"));
        e.addClass("mycandy-star-o");
        e.removeClass("mycandy-star");
        e.addClass("fa-star-o");
        e.removeClass("fa-star");
    };

    // set css effect
    tbody.on("mouseover focus touchstart", function() {
        mouseover(this);
    });
    tbody.on("mouseout blur touchend", function() {
        mouseout(this);
    });
}
