```markdown
# CyberChef

[![](https://github.com/gchq/CyberChef/workflows/Master%20Build,%20Test%20&%20Deploy/badge.svg)](https://github.com/gchq/CyberChef/actions?query=workflow%3A%22Master+Build,%20Test%26Deploy%22)
[![npm](https://img.shields.io/npm/v/cyberchef.svg)](https://www.npmjs.com/package/cyberchef)
[![](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/gchq/CyberChef/blob/master/LICENSE)
[![Gitter](https://badges.gitter.im/gchq/CyberChef.svg)](https://gitter.im/gchq/CyberChef?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)


#### *网络瑞士军刀*

CyberChef 是一款简洁直观的 Web 应用程序，用于在 Web 浏览器中执行各种“网络”操作。 这些操作包括简单的编码（如 XOR 和 Base64）、更复杂的加密（如 AES、DES 和 Blowfish）、创建二进制和十六进制转储、数据的压缩和解压缩、计算哈希和校验和、IPv6 和 X.509 解析、字符编码转换等等。

该工具旨在使技术和非技术分析人员都能够以复杂的方式操作数据，而无需处理复杂的工具或算法。 它是由一位分析师利用其 10% 的创新时间，在数年内构思、设计、构建并逐步改进的。

## 在线演示

CyberChef 仍在积极开发中。 因此，它不应被视为最终产品。 仍有测试和错误修复工作要做，新功能需要添加，额外的文档需要编写。 欢迎贡献！

CyberChef 中的加密操作不应在任何情况下用于提供安全保障。 其正确性不提供任何保证。

[在这里可以找到在线演示][1] - 玩得开心！

## 容器

如果您想在本地试用 CyberChef，您可以自行构建：

```bash
docker build --tag cyberchef --ulimit nofile=10000 .
docker run -it -p 8080:80 cyberchef
```

或者您可以直接使用我们的镜像：

```bash
docker run -it -p 8080:80 ghcr.io/gchq/cyberchef:latest
```

此镜像通过我们的 [GitHub Workflows](.github/workflows/releases.yml) 构建和发布

## 工作原理

CyberChef 主要有四个区域：

 1. 右上角的 **输入** 框，您可以在其中粘贴、键入或拖动要操作的文本或文件。
 2. 右下角的 **输出** 框，其中将显示处理结果。
 3. 最左侧的 **操作** 列表，您可以在其中找到 CyberChef 能够执行的所有操作，这些操作按类别列表显示，或通过搜索查找。
 4. 中间的 **Recipe** 区域，您可以在其中拖动要使用的操作，并指定参数和选项。

您可以以简单或复杂的方式使用任意数量的操作。 以下是一些示例：

 - [解码 Base64 编码的字符串][2]
 - [将日期和时间转换为不同的时区][3]
 - [解析 Teredo IPv6 地址][4]
 - [从 hexdump 转换数据，然后解压缩][5]
 - [解密和反汇编 Shellcode][6]
 - [将多个时间戳显示为完整日期][7]
 - [对不同类型的数据执行不同的操作][8]
 - [使用输入的部分内容作为操作的参数][9]
 - [执行 AES 解密，从密码流的开头提取 IV][10]
 - [自动检测多层嵌套编码][12]


## 功能特性

 - 拖放操作
     - 操作可以拖入和拖出 Recipe 列表，或重新组织。
     - 最大 2GB 的文件可以拖到输入框上方，直接加载到浏览器中。
 - 自动烘焙
     - 每当您修改输入或 Recipe 时，CyberChef 都会自动为您“烘焙”并立即生成输出。
     - 如果影响性能（例如，如果输入非常大），可以关闭此功能并手动操作。
 - 自动编码检测
     - CyberChef 使用[多种技术](https://github.com/gchq/CyberChef/wiki/Automatic-detection-of-encoded-data-using-CyberChef-Magic)尝试自动检测您的数据所使用的编码。 如果它找到适合您数据的操作，它将在“输出”字段中显示“魔术”图标，您可以单击该图标来解码您的数据。
 - 断点
     - 您可以在 Recipe 中的任何操作上设置断点，以便在运行之前暂停执行。
     - 您还可以一次单步执行 Recipe 中的一个操作，以查看每个阶段的数据外观。
 - 保存和加载 Recipe
     - 如果您想出了一个很棒的 Recipe，并且知道您以后还想再次使用它，只需单击“保存 Recipe”并将其添加到您的本地存储。 它将在您下次访问 CyberChef 时等待您。
     - 您还可以复制 URL，其中包含您的 Recipe 和输入，以便轻松与他人共享。
 - 搜索
     - 如果您知道所需操作的名称或与之关联的词，请开始在搜索字段中键入它，任何匹配的操作将立即显示。
 - 高亮显示
     - 当您在输入或输出中突出显示文本时，将显示偏移量和长度值，并且如果可能，将在输出或输入中突出显示相应的数据（示例：[在输入中突出显示单词“question”以查看它在输出中出现的位置][11]）。
 - 保存到文件和从文件加载
     - 您可以随时将输出保存到文件，或通过将文件拖放到输入字段中来加载文件。 支持最大约 2GB 的文件（取决于您的浏览器），但是，某些操作可能需要很长时间才能处理这么多数据。
 - CyberChef 完全在客户端运行
     - 应该注意的是，您的 Recipe 配置或输入（文本或文件）都不会发送到 CyberChef Web 服务器 - 所有处理都在您的浏览器中、在您自己的计算机上进行。
     - 由于此功能，CyberChef 可以下载并在本地运行。 您可以使用应用程序左上角的链接下载 CyberChef 的完整副本，并将其放入虚拟机、与其他人共享或托管在封闭网络中。


## 深度链接

通过操作 CyberChef 的 URL 哈希值，您可以更改页面打开时的初始设置。
格式为 `https://gchq.github.io/CyberChef/#recipe=Operation()&input=...`

支持的参数有 `recipe`、`input`（以 Base64 编码）和 `theme`。


## 浏览器支持

CyberChef 旨在支持

 - Google Chrome 50+
 - Mozilla Firefox 38+


## Node.js 支持

CyberChef 旨在完全支持 Node.js `v16`。 有关更多信息，请参阅 ["Node API" Wiki 页面](https://github.com/gchq/CyberChef/wiki/Node-API)


## 贡献

向 CyberChef 贡献新操作非常容易！ 快速入门脚本将引导您完成整个过程。 如果您会编写基本的 JavaScript，您就可以编写 CyberChef 操作。

安装指南、添加新操作和主题的操作指南、存储库结构的描述、可用的数据类型和编码约定都可以在 ["Contributing" Wiki 页面](https://github.com/gchq/CyberChef/wiki/Contributing)中找到。

 - 将您的更改推送到您的 Fork。
 - 提交 Pull Request。 如果您是第一次执行此操作，系统将提示您通过 Pull Request 上的 CLA 助手签署 [GCHQ 贡献者许可协议](https://cla-assistant.io/gchq/CyberChef)。 这还将询问您是否愿意 GCHQ 就感谢您贡献的谢意或 GCHQ 的工作机会与您联系。


## 许可协议

CyberChef 在 [Apache 2.0 许可协议](https://www.apache.org/licenses/LICENSE-2.0) 下发布，并受 [英国皇家版权](https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/) 保护。


  [1]: https://gchq.github.io/CyberChef
  [2]: https://gchq.github.io/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)&input=VTI4Z2JHOXVaeUJoYm1RZ2RHaGhibXR6SUdadmNpQmhiR3dnZEdobElHWnBjMmd1
  [3]: https://gchq.github.io/CyberChef/#recipe=Translate_DateTime_Format('Standard%20date%20and%20time','DD/MM/YYYY%20HH:mm:ss','UTC','dddd%20Do%20MMMM%20YYYY%20HH:mm:ss%20Z%20z','Australia/Queensland')&input=MTUvMDYvMjAxNSAyMDo0NTowMA
  [4]: https://gchq.github.io/CyberChef/#recipe=Parse_IPv6_address()&input=MjAwMTowMDAwOjQxMzY6ZTM3ODo4MDAwOjYzYmY6M2ZmZjpmZGQy
  [5]: https://gchq.github.io/CyberChef/#recipe=From_Hexdump()Gunzip()&input=MDAwMDAwMDAgIDFmIDhiIDA4IDAwIDEyIGJjIGYzIDU3IDAwIGZmIDBkIGM3IGMxIDA5IDAwIDIwICB8Li4uLi6881cu/y7HwS4uIHwKMDAwMDAwMTAgIDA4IDA1IGQwIDU1IGZlIDA0IDJkIGQzIDA0IDFmIGNhIDhjIDQ0IDIxIDViIGZmICB8Li7QVf4uLdMuLsouRCFb/3wKMDAwMDAwMjAgIDYwIGM3IGQ3IDAzIDE2IGJlIDQwIDFmIDc4IDRhIDNmIDA5IDg5IDBiIDlhIDdkICB8YMfXLi6%2BQC54Sj8uLi4ufXwKMDAwMDAwMzAgIDRlIGM4IDRlIDZkIDA1IDFlIDAxIDhiIDRjIDI0IDAwIDAwIDAwICAgICAgICAgICB8TshObS4uLi5MJC4uLnw
  [6]: https://gchq.github.io/CyberChef/#recipe=RC4(%7B'option':'UTF8','string':'secret'%7D,'Hex','Hex')Disassemble_x86('64','Full%20x86%20architecture',16,0,true,true)&input=MjFkZGQyNTQwMTYwZWU2NWZlMDc3NzEwM2YyYTM5ZmJlNWJjYjZhYTBhYWJkNDE0ZjkwYzZjYWY1MzEyNzU0YWY3NzRiNzZiM2JiY2QxOTNjYjNkZGZkYmM1YTI2NTMzYTY4NmI1OWI4ZmVkNGQzODBkNDc0NDIwMWFlYzIwNDA1MDcxMzhlMmZlMmIzOTUwNDQ2ZGIzMWQyYmM2MjliZTRkM2YyZWIwMDQzYzI5M2Q3YTVkMjk2MmMwMGZlNmRhMzAwNzJkOGM1YTZiNGZlN2Q4NTlhMDQwZWVhZjI5OTczMzYzMDJmNWEwZWMxOQ
  [7]: https://gchq.github.io/CyberChef/#recipe=Fork('%5C%5Cn','%5C%5Cn',false)From_UNIX_Timestamp('Seconds%20(s)')&input=OTc4MzQ2ODAwCjEwMTI2NTEyMDAKMTA0NjY5NjQwMAoxMDgxMDg3MjAwCjExMTUzMDUyMDAKMTE0OTYwOTYwMA
  [8]: https://gchq.github.io/CyberChef/#recipe=Fork('%5C%5Cn','%5C%5Cn',false)Conditional_Jump('1',false,'base64',10)To_Hex('Space')Return()Label('base64')To_Base64('A-Za-z0-9%2B/%3D')&input=U29tZSBkYXRhIHdpdGggYSAxIGluIGl0ClNvbWUgZGF0YSB3aXRoIGEgMiBpbiBpdA
  [9]: https://gchq.github.io/CyberChef/#recipe=Register('key%3D(%5B%5C%5Cda-f%5D*)',true,false)Find_/_Replace(%7B'option':'Regex','string':'.*data%3D(.*)'%7D,'$1',true,false,true)RC4(%7B'option':'Hex','string':'$R0'%7D,'Hex','Latin1')&input=aHR0cDovL21hbHdhcmV6LmJpei9iZWFjb24ucGhwP2tleT0wZTkzMmE1YyZkYXRhPThkYjdkNWViZTM4NjYzYTU0ZWNiYjMzNGUzZGIxMQ
  [10]: https://gchq.github.io/CyberChef/#recipe=Register('(.%7B32%7D)',true,false)Drop_bytes(0,32,false)AES_Decrypt(%7B'option':'Hex','string':'1748e7179bd56570d51fa4ba287cc3e5'%7D,%7B'option':'Hex','string':'$R0'%7D,'CTR','Hex','Raw',%7B'option':'Hex','string':''%7D)&input=NTFlMjAxZDQ2MzY5OGVmNWY3MTdmNzFmNWI0NzEyYWYyMGJlNjc0YjNiZmY1M2QzODU0NjM5NmVlNjFkYWFjNDkwOGUzMTljYTNmY2Y3MDg5YmZiNmIzOGVhOTllNzgxZDI2ZTU3N2JhOWRkNmYzMTFhMzk0MjBiODk3OGU5MzAxNGIwNDJkNDQ3MjZjYWVkZjU0MzZlYWY2NTI0MjljMGRmOTRiNTIxNjc2YzdjMmNlODEyMDk3YzI3NzI3M2M3YzcyY2Q4OWFlYzhkOWZiNGEyNzU4NmNjZjZhYTBhZWUyMjRjMzRiYTNiZmRmN2FlYjFkZGQ0Nzc2MjJiOTFlNzJjOWU3MDlhYjYwZjhkYWY3MzFlYzBjYzg1Y2UwZjc0NmZmMTU1NGE1YTNlYzI5MWNhNDBmOWU2MjlhODcyNTkyZDk4OGZkZDgzNDUzNGFiYTc5YzFhZDE2NzY3NjlhN2MwMTBiZjA0NzM5ZWNkYjY1ZDk1MzAyMzcxZDYyOWQ5ZTM3ZTdiNGEzNjFkYTQ2OGYxZWQ1MzU4OTIyZDJlYTc1MmRkMTFjMzY2ZjMwMTdiMTRhYTAxMWQyYWYwM2M0NGY5NTU3OTA5OGExNWUzY2Y5YjQ0ODZmOGZmZTljMjM5ZjM0ZGU3MTUxZjZjYTY1MDBmZTRiODUwYzNmMWMwMmU4MDFjYWYzYTI0NDY0NjE0ZTQyODAxNjE1YjhmZmFhMDdhYzgyNTE0OTNmZmRhN2RlNWRkZjMzNjg4ODBjMmI5NWIwMzBmNDFmOGYxNTA2NmFkZDA3MWE2NmNmNjBlNWY0NmYzYTIzMGQzOTdiNjUyOTYzYTIxYTUzZg
  [11]: https://gchq.github.io/CyberChef/#recipe=XOR(%7B'option':'Hex','string':'3a'%7D,'Standard',false)To_Hexdump(16,false,false)&input=VGhlIGFuc3dlciB0byB0aGUgdWx0aW1hdGUgcXVlc3Rpb24gb2YgbGlmZSwgdGhlIFVuaXZlcnNlLCBhbmQgZXZlcnl0aGluZyBpcyA0Mi4
  [12]: https://gchq.github.io/CyberChef/#recipe=Magic(3,false,false)&input=V1VhZ3dzaWFlNm1QOGdOdENDTFVGcENwQ0IyNlJtQkRvREQ4UGFjZEFtekF6QlZqa0syUXN0RlhhS2hwQzZpVVM3UkhxWHJKdEZpc29SU2dvSjR3aGptMWFybTg2NHFhTnE0UmNmVW1MSHJjc0FhWmM1VFhDWWlmTmRnUzgzZ0RlZWpHWDQ2Z2FpTXl1QlY2RXNrSHQxc2NnSjg4eDJ0TlNvdFFEd2JHWTFtbUNvYjJBUkdGdkNLWU5xaU45aXBNcTFaVTFtZ2tkYk51R2NiNzZhUnRZV2hDR1VjOGc5M1VKdWRoYjhodHNoZVpud1RwZ3FoeDgzU1ZKU1pYTVhVakpUMnptcEM3dVhXdHVtcW9rYmRTaTg4WXRrV0RBYzFUb291aDJvSDRENGRkbU5LSldVRHBNd21uZ1VtSzE0eHdtb21jY1BRRTloTTE3MkFQblNxd3hkS1ExNzJSa2NBc3lzbm1qNWdHdFJtVk5OaDJzMzU5d3I2bVMyUVJQ
```