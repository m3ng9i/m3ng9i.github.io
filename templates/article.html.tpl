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
    <script type="text/javascript" src="http://tajs.qq.com/stats?sId=42968888" charset="UTF-8"></script>
    <link rel="stylesheet" type="text/css" href="/static/libs/normalize.css">
    <link rel="stylesheet" type="text/css" href="/static/css/style.css">
    <link rel="alternate" type="application/atom+xml" title="My*Candy 最新文章" href="/feed.xml">
    <title>{{article.Title}} - My*Candy</title>
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

</body>

</html>
