编译时向 go 程序写入 git 版本信息
=================================

*m3ng9i*

如何在 [go](https://golang.org "点击前往 golang 官方网站") 程序中记录版本信息？最简单的办法就是手工输入。下面是一个例子。

程序 `myproject.go` 代码：

```go
package main

import "fmt"
import "flag"

var _version_ = "v0.1"

func main() {
    var version bool
    flag.BoolVar(&version, "v", false, "-v")
    flag.Parse()

    if version {
        fmt.Printf("Version: %s", _version_)
    }
}
```

版本信息被保存到变量 `_version_` 中，当程序编译后，生成可执行文件 myproject。在命令行运行 `./myproject -v` 后，显示：

```nohighlight
Version: v0.1
```

这么做并没有什么不妥，但如果你的程序经常进行更新，那么频繁的修改 \_version\_ 变量的值会显得非常繁琐。

# go build

go 程序的编译命令 `go build` 包含一个 `-ldflags` 选项，可以向链接器传递指令。向链接器传一个 `-X` 指令可以设置程序中字符串变量的值。利用这个方法能够实现在编译时设置程序的版本信息。对于上面的那个 go 程序，使用下面的编译命令可以将 main 包中的 \_version\_ 变量的值设置为 v0.2：

```bash
go build -ldflags "-X main._version_ 'v0.2'"
```

编译后，运行 `./myproject -v` 将显示：

```nohighlight
Version: v0.2
```

如果要同时设置多个变量，可以参照以下格式：

```bash
go build -ldflags "-X importpath.name value -X importpath_2.name_2 value_2 ..."
```

现在我们从 go 程序中离开一下，看一下 git。

# git

在使用 [git](http://git-scm.com "点击前往 git 官方网站") 作为程序开发的版本控制软件时，每向 git 做一次提交，都会生成一个 sha1 格式的 commit id。由于每一个 commit id 都不相同，这样我们就可以把 commit id 作为程序的特征值，在编译程序时，将其写入到程序中。

下图是在 [SourceTree](http://sourcetreeapp.com) 中查看 git log 的截图。可以看到，除了 commit id，git 日志还可以包含分支名称、标签等信息：

![git 日志](/static/2015/build_go_program_with_git_version_1.png)

以上信息可以通过 git 命令提取出来。

下面的命令可以提取出最近一条 git 日志的 commit id：

```bash
git log --pretty=format:"%h" -1
```

下面的命令可以提取出当前的 git 分支名称：

```bash
git rev-parse --abbrev-ref HEAD
```

下面的命令可以提取出最近一个标签的名称，如果当前分支没有创建过标签则会报错：

```bash
git describe --abbrev=0 --tags
```

# 构造 go 编译程序

为了进行演示，我修改了上面的 go 程序，加入了分支名称、commit id、编译时间 3 个变量。修改后的 `myproject.go` 代码如下：

```go
package main

import "fmt"
import "flag"

var _version_   = ""
var _branch_    = ""
var _commitId_  = ""
var _buildTime_ = ""

func main() {
    var version bool
    flag.BoolVar(&version, "v", false, "-v")
    flag.Parse()

    if version {
        fmt.Printf("Version: %s, Branch: %s, Build: %s, Build time: %s\n",
            _version_, _branch_, _commitId_, _buildTime_)
    }
}
```

为了实现自动化的提取 git 日志信息并将其编译进 go 程序，我用 [python](http://python.org) 写了一个脚本程序 `build.py` 来完成这个任务。这个程序会调用上述的若干 git 命令，将提取到的信息拼装为一个 go build 命令，然后运行此命令完成编译。

完整的 `build.py` 代码如下：

```python
#!/usr/bin/env python3

import os, time, subprocess

def runCmd(cmd):
    p = subprocess.Popen(cmd, shell = True, stdout = subprocess.PIPE, stderr = subprocess.PIPE)
    stdout = p.communicate()[0].decode('utf-8').strip()
    return stdout

# Get last tag.
def lastTag():
    return runCmd('git describe --abbrev=0 --tags')

# Get current branch name.
def branch():
    return runCmd('git rev-parse --abbrev-ref HEAD')

# Get last git commit id.
def lastCommitId():
    return runCmd('git log --pretty=format:"%h" -1')

# Assemble build command.
def buildCmd():
    buildFlag = []

    version = lastTag()
    if version != "":
        buildFlag.append("-X main._version_ '{}'".format(version))

    branchName = branch()        
    if branchName != "":
        buildFlag.append("-X main._branch_ '{}'".format(branchName))

    commitId = lastCommitId()
    if commitId != "":
        buildFlag.append("-X main._commitId_ '{}'".format(commitId))

    # current time
    buildFlag.append("-X main._buildTime_ '{}'".format(time.strftime("%Y-%m-%d %H:%M %z")))

    return 'go build -ldflags "{}"'.format(" ".join(buildFlag))

if subprocess.call(buildCmd(), shell = True) == 0:
    print("build finished.")
```

然后运行 `./build.py` 对 go 程序进行编译。编译完成后，再运行编译好的程序：`./myproject -v`。可以看到，标签：`v1.0`、分支名称：`master`、commit id：`e5b593c` 以及编译时间都被写入到了 go 程序中：

```bash
Version: v1.0, Branch: master, Build: e5b593c, Build time: 2015-02-17 15:46 +0800
```

是不是很方便？

# 参考资料

- [go command tutorial](https://github.com/hyper-carrot/go_command_tutorial)
- [Command go](http://golang.org/cmd/go/)
- [Command ld](http://golang.org/cmd/ld/)
- [Git Documentation](http://git-scm.com/doc)

