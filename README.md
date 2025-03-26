# CyberChef

[![](https://github.com/gchq/CyberChef/workflows/Master%20Build,%20Test%20&%20Deploy/badge.svg)](https://github.com/gchq/CyberChef/actions?query=workflow%3A%22Master+Build%2C+Test+%26+Deploy%22)
[![npm](https://img.shields.io/npm/v/cyberchef.svg)](https://www.npmjs.com/package/cyberchef)
[![](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/gchq/CyberChef/blob/master/LICENSE)
[![Gitter](https://badges.gitter.im/gchq/CyberChef.svg)](https://gitter.im/gchq/CyberChef?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

#### *网络瑞士军刀*

CyberChef 是一个简单直观的网页应用，用于在浏览器中执行各类“网络”操作。这些操作包括简单编码（如 XOR 和 Base64）、更复杂的加密（如 AES、DES 和 Blowfish）、生成二进制及十六进制转储、数据压缩与解压缩、计算哈希值和校验和、IPv6 与 X.509 解析、字符编码转换等。

该工具旨在让技术人员和非技术人员无需使用复杂工具或算法，就能以多样化的方式处理数据。它由一位分析师利用其 10% 的创新时间构思、设计、构建并不断改进。

## 在线演示

CyberChef 仍处于积极开发阶段，因此不应被视为成熟产品。仍有大量测试、漏洞修复、新功能添加和补充文档的工作等待完成。欢迎贡献！

请勿在任何情况下依赖 CyberChef 的加密操作提供安全保障，其正确性也不作任何保证。

[点击这里查看在线演示][1] — 玩得开心！

## 容器

如果您希望在本地试用 CyberChef，可以选择自行构建：

```bash
docker build --tag cyberchef --ulimit nofile=10000 .
docker run -it -p 8080:80 cyberchef
```

或者直接使用我们的镜像：

```bash
docker run -it -p 8080:80 kumakaiha/cyberchef_chinese:latest
```

该镜像由我们的 [GitHub 工作流](.github/workflows/releases.yml) 构建并发布。

## 工作原理

CyberChef 主要包含四个区域：

 1. 位于右上角的 **输入** 框，可用于粘贴、键入或拖入您要处理的文本或文件。
 2. 位于右下角的 **输出** 框，用于显示处理结果。
 3. 位于左侧的 **操作** 列表，展示了所有可用操作，可按类别或通过搜索查找。
 4. 位于中间的 **步骤** 区域，您可以将所需操作拖入并指定参数和选项。

您可以以简单或复杂的方式使用任意数量的操作。以下是一些示例：

 - [解码 Base64 编码字符串][2]
 - [将日期和时间转换为不同时区][3]
 - [解析 Teredo IPv6 地址][4]
 - [从十六进制转储转换数据后解压][5]
 - [解密并反汇编 shellcode][6]
 - [将多个时间戳显示为完整日期][7]
 - [对不同类型数据执行不同操作][8]
 - [将输入的部分内容作为操作参数][9]
 - [执行 AES 解密，从密文开头提取 IV][10]
 - [自动检测多层嵌套编码][12]

## 特性

 - 拖放功能
     - 操作可在步骤列表中自由拖动和重排。
     - 文件大小高达 2GB，可通过拖拽直接加载到浏览器。
 - 自动处理
     - 每当您修改输入或步骤时，CyberChef 会自动“处理”并生成输出。
     - 如果输入数据量巨大，也可选择关闭自动处理，手动操作以提升性能。
 - 自动检测编码
     - CyberChef 利用 [多种技术](https://github.com/gchq/CyberChef/wiki/Automatic-detection-of-encoded-data-using-CyberChef-Magic) 自动识别数据编码。如果找到适用的操作，将在输出区域显示魔术图标，点击即可解码。
 - 断点调试
     - 您可以在步骤中的任何操作上设置断点，在执行前暂停操作。
     - 同时支持逐步执行步骤，查看每个阶段的数据状态。
 - 保存与加载步骤
     - 如果您设计出优秀的步骤，可点击“保存步骤”将其存储于本地，下次访问时自动加载。
     - 您也可以复制包含步骤和输入的 URL，方便与他人共享。
 - 搜索
     - 在搜索框中输入操作名称或相关关键字，即可快速显示匹配项。
 - 高亮显示
     - 高亮选中输入或输出中的文本时，会显示相应的偏移量和长度，并尽可能在另一端高亮显示对应数据（例如：[选中输入中的“question”以查看其在输出中的位置][11]）。
 - 保存到文件与从文件加载
     - 您可以随时将输出保存到文件，或通过拖拽加载文件到输入框。支持的文件大小约为 2GB（取决于浏览器），但部分操作处理如此大数据可能需要较长时间。
 - CyberChef 完全在客户端运行
     - 请注意，您的步骤配置和输入（文本或文件）均不会发送到 CyberChef 服务器——所有处理均在您的浏览器中完成。
     - 因此，您可下载并本地运行 CyberChef，使用左上角的链接获取完整副本，将其部署在虚拟机中，与他人共享，或在封闭网络内托管。

## 深度链接

通过操作 CyberChef 的 URL hash，您可以修改页面初始打开时的设置。
格式为：`https://gchq.github.io/CyberChef/#recipe=Operation()&input=...`

支持的参数包括 `recipe`、`input`（Base64 编码）与 `theme`。

## 浏览器支持

CyberChef 支持以下浏览器：

 - Google Chrome 50+
 - Mozilla Firefox 38+

## Node.js 支持

CyberChef 完全支持 Node.js `v16`。更多信息请参见 [“Node API” wiki 页面](https://github.com/gchq/CyberChef/wiki/Node-API)

## 贡献

为 CyberChef 添加新操作非常简单！快速入门脚本将引导您完成整个过程。如果您能编写基础 JavaScript，就可以编写 CyberChef 操作。

关于安装步骤、添加新操作与主题的指南、仓库结构、可用数据类型以及编码规范等详细信息，请参阅 [“贡献” wiki 页面](https://github.com/gchq/CyberChef/wiki/Contributing)。

 - 将您的修改推送至 fork。
 - 提交 pull request。如果您是首次贡献，会提示您通过 CLA 助手签署 [GCHQ 贡献者许可协议](https://cla-assistant.io/gchq/CyberChef)，同时询问您是否同意 GCHQ 与您联系以示感谢或探讨工作机会。

## 许可

CyberChef is released under the [Apache 2.0 Licence](https://www.apache.org/licenses/LICENSE-2.0) and is covered by [Crown Copyright](https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/).


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