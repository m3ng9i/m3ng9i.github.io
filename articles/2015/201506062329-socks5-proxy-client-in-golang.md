使用 Golang 通过 Proxy 抓取网页
===============================

*m3ng9i*

使用 Go 自带的 `http` 包可以很方便的抓取网页，例如下面这个例子：

```go
package main

import "fmt"
import "net/http"
import "io/ioutil"

func main() {
    resp, err := http.Get("http://mengqi.info")
    if err != nil {
        fmt.Println(err)
    } else {

        b, err := ioutil.ReadAll(resp.Body)
        resp.Body.Close()
        if err != nil {
            fmt.Println(err)
        } else {
            fmt.Println(string(b))
        }
    }
}
```

但是如果想要通过代理服务器抓取网页该怎么办呢？我们可以尝试下 [golang.org/x/net/proxy](https://godoc.org/golang.org/x/net/proxy) 这个包。由于这个包并不在 Go 的标准库中，需要使用 `go get` 命令进行安装。

下面是利用 proxy 包创建 socks5 proxy client 并抓取网页的例子。

首先需要创建一个 *dialer*，它包含了 sock5 代理服务器的地址、用户名、密码。[net 包文档](http://golang.org/pkg/net/#Dialer)提到：

> A Dialer contains options for connecting to an address.

下面是创建 dialer 的代码，这里假设代理服务器的 IP 为 127.0.0.1，端口为 8080，用户名为 username, 密码为 password：

```go
dialer, err := proxy.SOCKS5("tcp", "127.0.0.1:8080",
    &proxy.Auth{User:"username", Password:"password"},
    &net.Dialer {
        Timeout: 30 * time.Second,
        KeepAlive: 30 * time.Second,
    },
)
```

如果代理服务器并不需要用户名、密码，可以将 proxy.SOCKS5 函数的第三个参数设置为 `nil`。

接下来需要创建一个 *transport*，它会利用刚才创建的 dialer 进行 TCP 连接。[net/http 包文档](http://golang.org/pkg/net/http/#pkg-overview)提到：

> For control over proxies, TLS configuration, keep-alives, compression, and other settings, create a Transport.

创建 transport 的代码：

```go
transport := &http.Transport{
    Proxy: nil,
    Dial: dialer.Dial,
    TLSHandshakeTimeout: 10 * time.Second,
}
```

现在，创建一个 *http client*，它会用到刚才创建的 transport：

```go
client := &http.Client { Transport: transport }
```

有了 http client，就可以通过代理服务器发起 http 请求了：

```go
response, err := client.Get("http://mengqi.info")
```

下面是完整的例子代码，client 的创建过程被封装成了一个函数：

```go
package main

import "fmt"
import "net"
import "time"
import "os"
import "net/http"
import "io/ioutil"
import "golang.org/x/net/proxy"


func Socks5Client(addr string, auth ...*proxy.Auth) (client *http.Client, err error) {

    dialer, err := proxy.SOCKS5("tcp", addr,
        nil,
        &net.Dialer {
            Timeout: 30 * time.Second,
            KeepAlive: 30 * time.Second,
        },
    )
    if err != nil {
        return
    }

    transport := &http.Transport{
        Proxy: nil,
        Dial: dialer.Dial,
        TLSHandshakeTimeout: 10 * time.Second,
    }

    client = &http.Client { Transport: transport }

    return
}


func main() {

    client, err := Socks5Client("127.0.0.1:8080")
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }

    // ip138 可以显示请求客户端的 IP
    resp, err := client.Get("http://1111.ip138.com/ic.asp")
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }

    b, err := ioutil.ReadAll(resp.Body)
    resp.Body.Close()
    if err != nil {
        fmt.Println(err)
    } else {
        fmt.Println(string(b))
    }

}
```

