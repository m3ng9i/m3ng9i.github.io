<!DOCTYPE HTML>
<html lang='zh-cn'>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1,width=device-width">
    <meta name="author" content="{{article.Author}}">
    <meta name="title" content="{{article.Title}}">
    <meta name="pubtime" content="{{article.PubTime|time:"2006-01-02T15:04:05Z07:00"}}">
    <meta name="url" content="{{url}}">
    <script type="text/javascript" src="/static/libs/html5shiv.min.js"></script>
    <script type="text/javascript" src="/static/libs/jquery-1.11.2.min.js"></script>
    <link rel="stylesheet" type="text/css" href="/static/libs/normalize.css">
    <link rel="stylesheet" type="text/css" href="/static/libs/font-awesome-4.3.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="/static/include/style.css">
    <link rel="alternate" type="application/atom+xml" title="My Candy 最新文章" href="/feed.xml">
    <title>{{article.Title}} - My Candy</title>
</head>

<body>
    <div id="container">
        <div id="container_inner">
            <article>
                <header>
                    <h1 class="title"><a href="{{url}}">{{article.Title}}</a></h1>
                    <p class="pubtime">{{article.Author}} 发表于 <time datetime="{{article.PubTime|time:"2006-01-02T15:04:05Z07:00"}}" pubdate>{{article.PubTime|time:"2006-01-02 15:04"}}</time></p>
                </header>
                {{article.Content|markdown}}
            </article>

            <nav>
                <p><a href="/">首页</a> <a href="/html/about.html">关于</a> <a href="/feed.xml" title="atom 1.0 feed">订阅</a></p>
            </nav>
        </div>
    </div>

    <div class="hidden">
        <script async type="text/javascript" src="http://s95.cnzz.com/z_stat.php?id=1255242145&web_id=1255242145"></script>
        <script type="text/javascript">
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-63483419-1', 'auto');
            ga('send', 'pageview');
        </script>
    </div>
</body>

</html>
