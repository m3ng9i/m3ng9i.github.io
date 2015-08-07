Golang 中的 UTF-8 与 GBK 编码转换
==================================

*m3ng9i*

在 Golang 中转换 UTF-8 与 GBK 编码的文本，可以使用 Go 官方的 [golang.org/x/text](https://godoc.org/golang.org/x/text) 包实现，这个包可以通过下面的命令安装：

```bash
go get golang.org/x/text
```

如果访问 golang.org 站点存在困难，也可以使用下面的命令通过 github 下载 text 包的代码，下载完成后，再手工将其移动至 `$GOPATH/src/golang.org/x/text` 目录中完成安装。

```bash
git clone --depth 1 https://github.com/golang/text.git
```

下面就是 UTF-8 与 GBK 编码转换的例子代码。这里创建了两个函数：`GbkToUtf8()` 和 `Utf8ToGbk()`，分别进行 GBK 到 UTF-8 和 UTF-8 到 GBK 的转换。

```go
package main

import (
    "bytes"
    "golang.org/x/text/encoding/simplifiedchinese"
    "golang.org/x/text/transform"
    "io/ioutil"
    "fmt"
)

func GbkToUtf8(s []byte) ([]byte, error) {
    reader := transform.NewReader(bytes.NewReader(s), simplifiedchinese.GBK.NewDecoder())
    d, e := ioutil.ReadAll(reader)
    if e != nil {
        return nil, e
    }
    return d, nil
}

func Utf8ToGbk(s []byte) ([]byte, error) {
    reader := transform.NewReader(bytes.NewReader(s), simplifiedchinese.GBK.NewEncoder())
    d, e := ioutil.ReadAll(reader)
    if e != nil {
        return nil, e
    }
    return d, nil
}

func main() {

    s := "GBK 与 UTF-8 编码转换测试"
    gbk, err := Utf8ToGbk([]byte(s))
    if err != nil {
        fmt.Println(err)
    } else {
        fmt.Println(string(gbk))
    }

    utf8, err := GbkToUtf8(gbk)
    if err != nil {
        fmt.Println(err)
    } else {
        fmt.Println(string(utf8))
    }
}
```
