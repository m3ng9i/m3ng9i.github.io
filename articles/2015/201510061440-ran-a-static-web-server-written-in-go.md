Ran: 使用 Go 语言开发的静态 Web 服务器
======================================

*m3ng9i*

最近用 Go 语言写了一款静态 Web 服务器："[Ran](https://github.com/m3ng9i/ran)"，支持如下功能：

- 列出目录下的文件
- gzip 压缩
- digest 身份认证
- 日志记录
- 自定义 404 文件

适合如下应用场景：

- 文件共享
- Web 应用程序开发测试
- 个人站点演示

以后还会添加更多功能，例如：

- 配置文件
- TLS 加密 (https)
- IP 过滤器
- 自定义日志格式

Ran 通过命令行运行，使用 `-h` 参数可以查看使用帮助。我已经用 Ran 代替了以前经常使用的 python 的单线程服务器：`python3 -m http.server`。

你可以直接下载适用于 Windows、Linux 或 Mac OS X 的可执行文件，对于其他操作系统，也可以自行编译。

更多内容，请访问 Ran 的 Github 页面：<https://github.com/m3ng9i/ran>

下载 Ran：<https://github.com/m3ng9i/ran/releases>

欢迎品尝。
