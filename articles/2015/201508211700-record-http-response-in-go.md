Go：使用 ResponseRecorder 记录 HTTP 响应报文
=============================================

*m3ng9i*

Go 的 [net/http](https://golang.org/pkg/net/http/) 包提供了丰富的 API 用来创建 HTTP 服务。在创建自己的 HTTP 服务时，通常会建立一个 [Handler](https://golang.org/pkg/net/http/#Handler) 来处理请求，并将响应内容写入到 [http.ResponseWriter](https://golang.org/pkg/net/http/#ResponseWriter) 中。

下面的代码是一个简单的例子：将当前工作目录作为根目录，利用 http 包的 [FileServer Handler](https://golang.org/pkg/net/http/#FileServer) 创建了一个静态文件服务器，接受 HTTP 请求并做出响应，最后输出日志。

```go
package main

import "os"
import "net/http"
import "fmt"

type Server struct {
    Root string
}

func (this *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    // 创建一个静态文件服务器
    http.FileServer(http.Dir(this.Root)).ServeHTTP(w, r)

    // 输出日志
    fmt.Println(r.URL.Path)
}

func main() {
    root, err := os.Getwd()
    if err != nil {
        fmt.Fprintf(os.Stderr, err.Error())
        os.Exit(1)
    }
    server := &Server{Root:root}
    http.ListenAndServe(":8080", server)
}
```

上面的代码中，主要的工作由 `http.FileServer` 完成，HTTP 服务运行的细节被封装到这个函数内部了，对我们是不可见的。例如完成一个响应后，HTTP 状态码是什么，是 200、404 还是 304，FileServer 并没有提供给我们。如果你想要知道有多少比特被发送到了客户端，也比较困难。

Go 的 [net/http/httptest](https://golang.org/pkg/net/http/httptest/) 包提供了一个 `ResponseRecorder` 可以将原本要发送到客户端的响应报文截获并记录下来，我们可以从中提取到需要的信息。得到所需信息后，我们再将现场还原，把 HTTP 报文头、报文体写入到 ResponseWriter，这样客户端就可以正常收到响应结果。

下面就是一个使用 ResponseRecorder 的例子：

```go
package main

import "os"
import "net/http"
import "net/http/httptest"
import "fmt"

type Server struct {
    Root string
}

func (this *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {

    // 创建一个 recorder 用来保存响应信息
    recorder := httptest.NewRecorder()

    // 将静态文件服务器的响应信息截获并记录到 recorder 中，这时客户端是没有输出的
    http.FileServer(http.Dir(this.Root)).ServeHTTP(recorder, r)

    // 从 recorder 中提取记录下来的 Response Header，设置为 ResponseWriter 的 Header
    for key, value := range recorder.HeaderMap {
        for _, val := range value {
            w.Header().Set(key, val)
        }
    }

    // 提取 recorder 中记录的状态码，写入到 ResponseWriter 中
    w.WriteHeader(recorder.Code)

    var contentLength int
    if recorder.Body != nil {
        // 将 recorder 记录的 Response Body 写入到 ResponseWriter 中，客户端收到响应报文体
        w.Write(recorder.Body.Bytes())

        // 计算 Response Body 的大小（即 Content-Length）
        contentLength = recorder.Body.Len()
    }

    // 将状态码，请求路径，Content-Length 作为日志输出
    fmt.Printf("%d %s, %d\n", recorder.Code, r.URL.Path, contentLength)

}

func main() {
    root, err := os.Getwd()
    if err != nil {
        fmt.Fprintf(os.Stderr, err.Error())
        os.Exit(1)
    }
    server := &Server{Root:root}
    http.ListenAndServe(":8080", server)
}
```
