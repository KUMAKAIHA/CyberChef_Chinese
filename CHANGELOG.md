# Changelog

## 版本控制

CyberChef 使用 [semver](https://semver.org/) 系统进行版本控制：`<主版本号>.<次版本号>.<补丁号>`。

- 主版本号的更改代表 CyberChef 基础架构的重大更改，并且可能（但不总是）会引入不向后兼容的重大更改。
- 次版本号的更改通常意味着添加了新操作或相当重要的新功能。
- 补丁号版本用于错误修复和任何其他小的调整，以修改或改进现有功能。

所有主版本号和次版本号的更改都将记录在此文件中。补丁级别的版本更改的详细信息可以在 [commit messages](https://github.com/gchq/CyberChef/commits/master) 中找到。


## 详细信息

### [10.19.0] - 2024-06-21
- 在 'Parse CSR' 中添加了对 ECDSA 和 DSA 的支持 [@robinsandhu] | [#1828]
- 修复了 SIGABA.mjs 中的拼写错误 [@eltociear] | [#1834]

### [10.18.0] - 2024-04-24
- 添加了 'XXTEA Encrypt' 和 'XXTEA Decrypt' 操作 [@n1474335] | [0a353ee]

### [10.17.0] - 2024-04-13
- 修复了单元测试 'expectOutput' 的实现 [@zb3] | [#1783]
- 为图标添加了辅助功能标签 [@e218736] | [#1743]
- 为键盘导航添加了焦点样式 [@e218736] | [#1739]
- 添加了对操作选项隐藏的支持 [@TheZ3ro] | [#541]
- 提高了 RAKE 实现的效率 [@sw5678] | [#1751]
- 在 'Affine Encode' 中要求 (a, 26) 互质 [@EvieHarv] | [#1788]
- 添加了 'JWK to PEM' 操作 [@cplussharp] | [#1277]
- 添加了 'PEM to JWK' 操作 [@cplussharp] | [#1277]
- 添加了 'Public Key from Certificate' 操作 [@cplussharp] | [#1642]
- 添加了 'Public Key from Private Key' 操作 [@cplussharp] | [#1642]

### [10.16.0] - 2024-04-12
- 添加了 'JA4Server Fingerprint' 操作 [@n1474335] | [#1789]

### [10.15.0] - 2024-04-02
- 修复了 Ciphersaber2 密钥连接 [@zb3] | [#1765]
- 修复了 DeriveEVPKey 的数组解析 [@zb3] | [#1767]
- 修复了 JWT 操作 [@a3957273] | [#1769]
- 添加了 'Parse Certificate Signing Request' 操作 [@jkataja] | [#1504]
- 添加了 'Extract Hash Values' 操作 [@MShwed] | [#512]
- 添加了 'DateTime Delta' 操作 [@tomgond] | [#1732]

### [10.14.0] - 2024-03-31
- 添加了 'To Float' 和 'From Float' 操作 [@tcode2k16] | [#1762]
- 修复了 ChaCha 原始导出选项 [@joostrijneveld] | [#1606]
- 更新了 x86 反汇编器供应商库 [@evanreichard] | [#1197]
- 允许可变的 Blowfish 密钥大小 [@cbeuw] | [#933]
- 添加了 'XXTEA' 操作 [@devcydo] | [#1361]

### [10.13.0] - 2024-03-30
- 添加了 'FangURL' 操作 [@breakersall] [@arnydo] | [#1591] [#654]

### [10.12.0] - 2024-03-29
- 添加了 'Salsa20' 和 'XSalsa20' 操作 [@joostrijneveld] | [#1750]

### [10.11.0] - 2024-03-29
- 添加了 HEIC/HEIF 文件签名 [@simonw] | [#1757]
- 更新了 xmldom 以修复中等安全漏洞 [@chriswhite199] | [#1752]
- 更新了 JSONWebToken 以修复中等安全漏洞 [@chriswhite199] | [#1753]

### [10.10.0] - 2024-03-27
- 添加了 'JA4 Fingerprint' 操作 [@n1474335] | [#1759]

### [10.9.0] - 2024-03-26
- 现在可以自动检测行尾序列和 UTF-8 字符编码 [@n1474335] | [65ffd8d]

### [10.8.0] - 2024-02-13
- 添加了官方 Docker 镜像 [@AshCorr] | [#1699]

### [10.7.0] - 2024-02-09
- 添加了 'File Tree' 操作 [@sw5678] | [#1667]
- 添加了 'RISON' 操作 [@sg5506844] | [#1555]
- 添加了 'MurmurHash3' 操作 [@AliceGrey] | [#1694]

### [10.6.0] -  2024-02-03
- 更新了 'Forensics Wiki' URL 到新域名 [@a3957273] | [#1703]
- 添加了 'LZNT1 Decompress' 操作 [@0xThiebaut] | [#1675]
- 更新了 'Regex Expression' UUID 匹配器 [@cnotin] | [#1678]
- 移除了 baking 信息中重复的 'hover' 消息 [@KevinSJ] | [#1541]

### [10.5.0] - 2023-07-14
- 添加了 GOST 加密、解密、签名、验证、密钥包装和密钥解包装操作 [@n1474335] | [#592]

### [10.4.0] - 2023-03-24
- 添加了 'Generate De Bruijn Sequence' 操作 [@gchq77703] | [#493]

### [10.3.0] - 2023-03-24
- 添加了 'Argon2' 和 'Argon2 compare' 操作 [@Xenonym] | [#661]

### [10.2.0] - 2023-03-23
- 添加了 'Derive HKDF key' 操作 [@mikecat] | [#1528]

### [10.1.0] - 2023-03-23
- 添加了 'Levenshtein Distance' 操作 [@mikecat] | [#1498]
- 添加了 'Swap case' 操作 [@mikecat] | [#1499]

## [10.0.0] - 2023-03-22
- [完整细节在此处解释](https://github.com/gchq/CyberChef/wiki/Character-encoding,-EOL-separators,-and-editor-features)
- 在输入和输出中添加了状态栏 [@n1474335] | [#1405]
- 在输入和输出中添加了字符编码选择 [@n1474335] | [#1405]
- 在输入和输出中添加了行尾分隔符选择 [@n1474335] | [#1405]
- 不可打印字符呈现为控制字符图片 [@n1474335] | [#1405]
- 加载的文件现在可以在输入中编辑 [@n1474335] | [#1405]
- 添加了各种编辑器功能，例如多选和括号匹配 [@n1474335] | [#1405]
- 添加了上下文帮助，悬停在功能上并按下 F1 即可激活 [@n1474335] | [#1405]
- 为 I/O 功能和操作添加了许多 UI 测试 [@n1474335] | [#1405]

<details>
    <summary>点击展开 v9 次版本</summary>

### [9.55.0] - 2022-12-09
- 添加了 'AMF Encode' 和 'AMF Decode' 操作 [@n1474335] | [760eff4]

### [9.54.0] - 2022-11-25
- 添加了 'Rabbit' 操作 [@mikecat] | [#1450]

### [9.53.0] - 2022-11-25
- 添加了 'AES Key Wrap' 和 'AES Key Unwrap' 操作 [@mikecat] | [#1456]

### [9.52.0] - 2022-11-25
- 添加了 'ChaCha' 操作 [@joostrijneveld] | [#1466]

### [9.51.0] - 2022-11-25
- 添加了 'CMAC' 操作 [@mikecat] | [#1457]

### [9.50.0] - 2022-11-25
- 添加了 'Shuffle' 操作 [@mikecat] | [#1472]

### [9.49.0] - 2022-11-11
- 添加了 'LZ4 Compress' 和 'LZ4 Decompress' 操作 [@n1474335] | [31a7f83]

### [9.48.0] - 2022-10-14
- 添加了 'LM Hash' 和 'NT Hash' 操作 [@n1474335] [@brun0ne] | [#1427]

### [9.47.0] - 2022-10-14
- 添加了 'LZMA Decompress' 和 'LZMA Compress' 操作 [@mattnotmitt] | [#1421]

### [9.46.0] - 2022-07-08
- 添加了 'Cetacean Cipher Encode' 和 'Cetacean Cipher Decode' 操作 [@valdelaseras] | [#1308]

### [9.45.0] - 2022-07-08
- 添加了 'ROT8000' 操作 [@thomasleplus] | [#1250]

### [9.44.0] - 2022-07-08
- 添加了 'LZString Compress' 和 'LZString Decompress' 操作 [@crespyl] | [#1266]

### [9.43.0] - 2022-07-08
- 添加了 'ROT13 Brute Force' 和 'ROT47 Brute Force' 操作 [@mikecat] | [#1264]

### [9.42.0] - 2022-07-08
- 添加了 'LS47 Encrypt' 和 'LS47 Decrypt' 操作 [@n1073645] | [#951]

### [9.41.0] - 2022-07-08
- 添加了 'Caesar Box Cipher' 操作 [@n1073645] | [#1066]

### [9.40.0] - 2022-07-08
- 添加了 'P-list Viewer' 操作 [@n1073645] | [#906]

### [9.39.0] - 2022-06-09
- 添加了 'ELF Info' 操作 [@n1073645] | [#1364]

### [9.38.0] - 2022-05-30
- 添加了 'Parse TCP' 操作 [@n1474335] | [a895d1d]

### [9.37.0] - 2022-03-29
- 添加了 'SM4 Encrypt' 和 'SM4 Decrypt' 操作 [@swesven] | [#1189]
- 在 AES、DES 和 Triple DES 解密操作的 CBC 和 ECB 模式中添加了 NoPadding 选项 [@swesven] | [#1189]

### [9.36.0] - 2022-03-29
- 添加了 'SIGABA' 操作 [@hettysymes] | [#934]

### [9.35.0] - 2022-03-28
- 添加了 'To Base45' 和 'From Base45' 操作 [@t-8ch] | [#1242]

### [9.34.0] - 2022-03-28
- 添加了 'Get All Casings' 操作 [@n1073645] | [#1065]

### [9.33.0] - 2022-03-25
- 更新以支持 Node 17 [@n1474335] [@john19696] [@t-8ch] | [[#1326] [#1313] [#1244]
- 改进了 CJS 和 ESM 模块支持 [@d98762625] | [#1037]

### [9.32.0] - 2021-08-18
- 添加了 'Protobuf Encode' 操作，并修改了解码操作以允许使用完整和部分模式进行解码 [@n1474335] | [dd18e52]

### [9.31.0] - 2021-08-10
- 添加了 'HASSH Client Fingerprint' 和 'HASSH Server Fingerprint' 操作 [@n1474335] | [e9ca4dc]

### [9.30.0] - 2021-08-10
- 添加了 'JA3S Fingerprint' 操作 [@n1474335] | [289a417]

### [9.29.0] - 2021-07-28
- 添加了 'JA3 Fingerprint' 操作 [@n1474335] | [9a33498]

### [9.28.0] - 2021-03-26
- 添加了 'CBOR Encode' 和 'CBOR Decode' 操作 [@Danh4] | [#999]

### [9.27.0] - 2021-02-12
- 添加了 'Fuzzy Match' 操作 [@n1474335] | [8ad18b]

### [9.26.0] - 2021-02-11
- 添加了 'Get Time' 操作 [@n1073645] [@n1474335] | [#1045]

### [9.25.0] - 2021-02-11
- 添加了 'Extract ID3' 操作 [@n1073645] [@n1474335] | [#1006]

### [9.24.0] - 2021-02-02
- 添加了 'SM3' 哈希函数，以及用于其他哈希操作的更多配置选项 [@n1073645] [@n1474335] | [#1022]

### [9.23.0] - 2021-02-01
- 添加了各种 RSA 操作，用于加密、解密、签名、验证和生成密钥 [@mattnotmitt] [@GCHQ77703] | [#652]

### [9.22.0] - 2021-02-01
- 添加了 'Unicode Text Format' 操作 [@mattnotmitt] | [#1083]

### [9.21.0] - 2020-06-12
- Node API 现在导出 `magic` 操作 [@d98762625] | [#1049]

### [9.20.0] - 2020-03-27
- 添加了 'Parse ObjectID Timestamp' 操作 [@dmfj] | [#987]

### [9.19.0] - 2020-03-24
- 改进了 'Magic' 操作，使其能够识别更多数据格式并提供更准确的结果 [@n1073645] [@n1474335] | [#966] [b765534b](https://github.com/gchq/CyberChef/commit/b765534b8b2a0454a5132a0a52d1d8844bcbdaaa)

### [9.18.0] - 2020-03-13
- 添加了 'Convert to NATO alphabet' 操作 [@MarvinJWendt] | [#674]

### [9.17.0] - 2020-03-13
- 添加了 'Generate Image' 操作 [@pointhi] | [#683]

### [9.16.0] - 2020-03-06
- 添加了 'Colossus' 操作 [@VirtualColossus] | [#917]

### [9.15.0] - 2020-03-05
- 添加了 'CipherSaber2 Encrypt' 和 'CipherSaber2 Decrypt' 操作 [@n1073645] | [#952]

### [9.14.0] - 2020-03-05
- 添加了 'Luhn Checksum' 操作 [@n1073645] | [#965]

### [9.13.0] - 2020-02-13
- 添加了 'Rail Fence Cipher Encode' 和 'Rail Fence Cipher Decode' 操作 [@Flavsditz] | [#948]

### [9.12.0] - 2019-12-20
- 添加了 'Normalise Unicode' 操作 [@matthieuxyz] | [#912]

### [9.11.0] - 2019-11-06
- 为 Blowfish 操作实现了 CFB、OFB 和 CTR 模式 [@cbeuw] | [#653]

### [9.10.0] - 2019-11-06
- 添加了 'Lorenz' 操作 [@VirtualColossus] | [#528]

### [9.9.0] - 2019-11-01
- 添加了对 109 种以上字符编码的支持 [@n1474335]

### [9.8.0] - 2019-10-31
- 添加了 'Avro to JSON' 操作 [@jarrodconnolly] | [#865]

### [9.7.0] - 2019-09-13
- 添加了 'Optical Character Recognition' 操作 [@MShwed] [@n1474335] | [#632]

### [9.6.0] - 2019-09-04
- 添加了 'Bacon Cipher Encode' 和 'Bacon Cipher Decode' 操作 [@kassi] | [#500]

### [9.5.0] - 2019-09-04
- 添加了各种隐写术操作：'Extract LSB'、'Extract RGBA'、'Randomize Colour Palette' 和 'View Bit Plane' [@Ge0rg3] | [#625]

### [9.4.0] - 2019-08-30
- 添加了 'Render Markdown' 操作 [@j433866] | [#627]

### [9.3.0] - 2019-08-30
- 添加了 'Show on map' 操作 [@j433866] | [#477]

### [9.2.0] - 2019-08-23
- 添加了 'Parse UDP' 操作 [@h345983745] | [#614]

### [9.1.0] - 2019-08-22
- 添加了 'Parse SSH Host Key' 操作 [@j433866] | [#595]
- 添加了 'Defang IP Addresses' 操作 [@h345983745] | [#556]

</details>

## [9.0.0] - 2019-07-09
- [多输入](https://github.com/gchq/CyberChef/wiki/Multiple-Inputs) 现在在主 Web UI 中受支持，允许您一次上传和处理多个文件 [@j433866] | [#566]
- 已经实现了 [Node.js API](https://github.com/gchq/CyberChef/wiki/Node-API)，这意味着 CyberChef 现在可以用作库，可以提供特定操作或整个 baking 环境 [@d98762625] | [#291]
- 还包括一个 [read-eval-print loop (REPL)](https://github.com/gchq/CyberChef/wiki/Node-API#repl)，以支持使用 API 进行原型设计和实验 [@d98762625] | [#291]
- 添加了浅色和深色 Solarized 主题 [@j433866] | [#566]

<details>
    <summary>点击展开 v8 次版本</summary>

### [8.38.0] - 2019-07-03
- 添加了 'Streebog' 和 'GOST hash' 操作 [@MShwed] [@n1474335] | [#530]

### [8.37.0] - 2019-07-03
- 添加了 'CRC-8 Checksum' 操作 [@MShwed] | [#591]

### [8.36.0] - 2019-07-03
- 添加了 'PGP Verify' 操作 [@artemisbot] | [#585]

### [8.35.0] - 2019-07-03
- 添加了 'Sharpen Image'、'Convert Image Format' 和 'Add Text To Image' 操作 [@j433866] | [#515]

### [8.34.0] - 2019-06-28
- 为 'Entropy' 操作添加了各种新的可视化效果 [@MShwed] | [#535]
- 提高了 'Entropy' 操作对于大型文件支持的效率 [@n1474335]

### [8.33.0] - 2019-06-27
- 添加了 'Bzip2 Compress' 操作，并大大改进了 'Bzip2 Decompress' 操作 [@artemisbot] | [#531]

### [8.32.0] - 2019-06-27
- 添加了 'Index of Coincidence' 操作 [@Ge0rg3] | [#571]

### [8.31.0] - 2019-04-12
- CyberChef 的可下载版本现在是一个 .zip 文件，其中包含单独的模块，而不是单个 .htm 文件。它仍然是完全独立的，并且不会发出任何外部网络请求。此更改显着降低了构建过程的复杂性。 [@n1474335]

### [8.30.0] - 2019-04-12
- 添加了 'Decode Protobuf' 操作 [@n1474335] | [#533]

### [8.29.0] - 2019-03-31
- 添加了 'BLAKE2s' 和 'BLAKE2b' 哈希操作 [@h345983745] | [#525]

### [8.28.0] - 2019-03-31
- 添加了 'Heatmap Chart'、'Hex Density Chart'、'Scatter Chart' 和 'Series Chart' 操作 [@artemisbot] [@tlwr] | [#496] [#143]

### [8.27.0] - 2019-03-14
- 添加了 'Enigma'、'Typex'、'Bombe' 和 'Multiple Bombe' 操作 [@s2224834] | [#516]
- 有关这些操作的完整说明，请参阅 [此 Wiki 文章](https://github.com/gchq/CyberChef/wiki/Enigma,-the-Bombe,-and-Typex)。
- 为长时间运行的操作添加了新的 Bombe 风格加载动画 [@n1474335]
- 添加了新的操作参数类型：`populateMultiOption` 和 `argSelector` [@n1474335]

### [8.26.0] - 2019-03-09
- 添加了各种图像处理操作 [@j433866] | [#506]

### [8.25.0] - 2019-03-09
- 添加了 'Extract Files' 操作，并支持更多文件格式 [@n1474335] | [#440]

### [8.24.0] - 2019-02-08
- 添加了 'DNS over HTTPS' 操作 [@h345983745] | [#489]

### [8.23.1] - 2019-01-18
- 添加了 'Convert co-ordinate format' 操作 [@j433866] | [#476]

### [8.23.0] - 2019-01-18
- 添加了 'YARA Rules' 操作 [@artemisbot] | [#468]

### [8.22.0] - 2019-01-10
- 添加了 'Subsection' 操作 [@j433866] | [#467]

### [8.21.0] - 2019-01-10
- 添加了 'To Case Insensitive Regex' 和 'From Case Insensitive Regex' 操作 [@masq] | [#461]

### [8.20.0] - 2019-01-09
- 添加了 'Generate Lorem Ipsum' 操作 [@klaxon1] | [#455]

### [8.19.0] - 2018-12-30
- 添加了 UI 测试套件，以确认应用程序在合理的时间内正确加载，并且可以运行来自每个模块的各种操作 [@n1474335] | [#458]

### [8.18.0] - 2018-12-26
- 添加了 'Split Colour Channels' 操作 [@artemisbot] | [#449]

### [8.17.0] - 2018-12-25
- 添加了 'Generate QR Code' 和 'Parse QR Code' 操作 [@j433866] | [#448]

### [8.16.0] - 2018-12-19
- 添加了 'Play Media' 操作 [@anthony-arnold] | [#446]

### [8.15.0] - 2018-12-18
- 添加了 'Text Encoding Brute Force' 操作 [@Cynser] | [#439]

### [8.14.0] - 2018-12-18
- 添加了 'To Base62' 和 'From Base62' 操作 [@tcode2k16] | [#443]

### [8.13.0] - 2018-12-15
- 添加了 'A1Z26 Cipher Encode' 和 'A1Z26 Cipher Decode' 操作 [@jarmovanlenthe] | [#441]

### [8.12.0] - 2018-11-21
- 添加了 'Citrix CTX1 Encode' 和 'Citrix CTX1 Decode' 操作 [@bwhitn] | [#428]

### [8.11.0] - 2018-11-13
- 添加了 'CSV to JSON' 和 'JSON to CSV' 操作 [@n1474335] | [#277]

### [8.10.0] - 2018-11-07
- 添加了 'Remove Diacritics' 操作 [@klaxon1] | [#387]

### [8.9.0] - 2018-11-07
- 添加了 'Defang URL' 操作 [@arnydo] | [#394]

### [8.8.0] - 2018-10-10
- 添加了 'Parse TLV' 操作 [@GCHQ77703] | [#351]

### [8.7.0] - 2018-08-31
- 添加了 'JWT Sign'、'JWT Verify' 和 'JWT Decode' 操作 [@GCHQ77703] | [#348]

### [8.6.0] - 2018-08-29
- 添加了 'To Geohash' 和 'From Geohash' 操作 [@GCHQ77703] | [#344]

### [8.5.0] - 2018-08-23
- 添加了 'To Braille' 和 'From Braille' 操作 [@n1474335] | [#255]

### [8.4.0] - 2018-08-23
- 添加了 'To Base85' 和 'From Base85' 操作 [@PenguinGeorge] | [#340]

### [8.3.0] - 2018-08-21
- 添加了 'To MessagePack' 和 'From MessagePack' 操作 [@artemisbot] | [#338]

### [8.2.0] - 2018-08-21
- 为大多数操作添加了信息链接，可在描述弹出窗口中访问 [@PenguinGeorge] | [#298]

### [8.1.0] - 2018-08-19
- 添加了 'Dechunk HTTP response' 操作 [@sevzero] | [#311]

</details>

## [8.0.0] - 2018-08-05
- 使用 [ES 模块](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/) 和 [类](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 重写了代码库 [@n1474335] [@d98762625] [@artemisbot] [@picapi] | [#284]
- 重构了操作架构，使添加新操作变得更加简单 [@n1474335] | [#284]
- 添加了一个脚本，通过运行 `npm run newop` 来帮助创建新操作 [@n1474335] | [#284]
- 添加了 'Magic' 操作 - [自动检测编码数据](https://github.com/gchq/CyberChef/wiki/Automatic-detection-of-encoded-data-using-CyberChef-Magic) [@n1474335] | [#239]
- UI 更新为使用 [Bootstrap Material Design](https://fezvrasta.github.io/bootstrap-material-design/) [@n1474335] | [#248]
- 添加了 `JSON`、`File` 和 `List<File>` Dish 类型 [@n1474335] | [#284]
- 添加了 `OperationError` 类型，以便更好地处理操作抛出的错误 [@d98762625] | [#296]
- 添加了 `present()` 方法，允许操作将机器友好的数据传递给后续操作，同时向用户呈现人类友好的数据 [@n1474335] | [#284]
- 添加了集合操作 [@d98762625] | [#281]
- 添加了 'To Table' 操作 [@JustAnotherMark] | [#294]
- 添加了 'Haversine distance' 操作 [@Dachande663] | [#325]
- 开始维护更新日志 [@n1474335]

## [7.0.0] - 2017-12-28
- 添加了对加载、处理和下载高达 500MB 的文件的支持 [@n1474335] | [#224]

## [6.0.0] - 2017-09-19
- 添加了线程支持。所有 recipe 处理都移至 [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) 以提高性能并允许取消长时间运行的操作 [@n1474335] | [#173]
- 创建了模块系统，以便可以根据需要单独下载依赖于大型库的操作，从而减少应用程序的初始加载时间 [@n1474335] | [#173]

## [5.0.0] - 2017-03-30
-  Webpack 构建过程配置了 Babel 转译以及 ES6 导入和导出 [@n1474335] | [#95]

## [4.0.0] - 2016-11-28
-  初始开源提交 [@n1474335] | [b1d73a72](https://github.com/gchq/CyberChef/commit/b1d73a725dc7ab9fb7eb789296efd2b7e4b08306)

[10.19.0]: https://github.com/gchq/CyberChef/releases/tag/v10.19.0
[10.18.0]: https://github.com/gchq/CyberChef/releases/tag/v10.18.0
[10.17.0]: https://github.com/gchq/CyberChef/releases/tag/v10.17.0
[10.16.0]: https://github.com/gchq/CyberChef/releases/tag/v10.16.0
[10.15.0]: https://github.com/gchq/CyberChef/releases/tag/v10.15.0
[10.14.0]: https://github.com/gchq/CyberChef/releases/tag/v10.14.0
[10.13.0]: https://github.com/gchq/CyberChef/releases/tag/v10.13.0
[10.12.0]: https://github.com/gchq/CyberChef/releases/tag/v10.12.0
[10.11.0]: https://github.com/gchq/CyberChef/releases/tag/v10.11.0
[10.10.0]: https://github.com/gchq/CyberChef/releases/tag/v10.10.0
[10.9.0]: https://github.com/gchq/CyberChef/releases/tag/v10.9.0
[10.8.0]: https://github.com/gchq/CyberChef/releases/tag/v10.7.0
[10.7.0]: https://github.com/gchq/CyberChef/releases/tag/v10.7.0
[10.6.0]: https://github.com/gchq/CyberChef/releases/tag/v10.6.0
[10.5.0]: https://github.com/gchq/CyberChef/releases/tag/v10.5.0
[10.4.0]: https://github.com/gchq/CyberChef/releases/tag/v10.4.0
[10.3.0]: https://github.com/gchq/CyberChef/releases/tag/v10.3.0
[10.2.0]: https://github.com/gchq/CyberChef/releases/tag/v10.2.0
[10.1.0]: https://github.com/gchq/CyberChef/releases/tag/v10.1.0
[10.0.0]: https://github.com/gchq/CyberChef/releases/tag/v10.0.0
[9.55.0]: https://github.com/gchq/CyberChef/releases/tag/v9.55.0
[9.54.0]: https://github.com/gchq/CyberChef/releases/tag/v9.54.0
[9.53.0]: https://github.com/gchq/CyberChef/releases/tag/v9.53.0
[9.52.0]: https://github.com/gchq/CyberChef/releases/tag/v9.52.0
[9.51.0]: https://github.com/gchq/CyberChef/releases/tag/v9.51.0
[9.50.0]: https://github.com/gchq/CyberChef/releases/tag/v9.50.0
[9.49.0]: https://github.com/gchq/CyberChef/releases/tag/v9.49.0
[9.48.0]: https://github.com/gchq/CyberChef/releases/tag/v9.48.0
[9.47.0]: https://github.com/gchq/CyberChef/releases/tag/v9.47.0
[9.46.0]: https://github.com/gchq/CyberChef/releases/tag/v9.46.0
[9.45.0]: https://github.com/gchq/CyberChef/releases/tag/v9.45.0
[9.44.0]: https://github.com/gchq/CyberChef/releases/tag/v9.44.0
[9.43.0]: https://github.com/gchq/CyberChef/releases/tag/v9.43.0
[9.42.0]: https://github.com/gchq/CyberChef/releases/tag/v9.42.0
[9.41.0]: https://github.com/gchq/CyberChef/releases/tag/v9.41.0
[9.40.0]: https://github.com/gchq/CyberChef/releases/tag/v9.40.0
[9.39.0]: https://github.com/gchq/CyberChef/releases/tag/v9.39.0
[9.38.0]: https://github.com/gchq/CyberChef/releases/tag/v9.38.0
[9.37.0]: https://github.com/gchq/CyberChef/releases/tag/v9.37.0
[9.36.0]: https://github.com/gchq/CyberChef/releases/tag/v9.36.0
[9.35.0]: https://github.com/gchq/CyberChef/releases/tag/v9.35.0
[9.34.0]: https://github.com/gchq/CyberChef/releases/tag/v9.34.0
[9.33.0]: https://github.com/gchq/CyberChef/releases/tag/v9.33.0
[9.32.0]: https://github.com/gchq/CyberChef/releases/tag/v9.32.0
[9.31.0]: https://github.com/gchq/CyberChef/releases/tag/v9.31.0
[9.30.0]: https://github.com/gchq/CyberChef/releases/tag/v9.30.0
[9.29.0]: https://github.com/gchq/CyberChef/releases/tag/v9.29.0
[9.28.0]: https://github.com/gchq/CyberChef/releases/tag/v9.28.0
[9.27.0]: https://github.com/gchq/CyberChef/releases/tag/v9.27.0
[9.26.0]: https://github.com/gchq/CyberChef/releases/tag/v9.26.0
[9.25.0]: https://github.com/gchq/CyberChef/releases/tag/v9.25.0
[9.24.0]: https://github.com/gchq/CyberChef/releases/tag/v9.24.0
[9.23.0]: https://github.com/gchq/CyberChef/releases/tag/v9.23.0
[9.22.0]: https://github.com/gchq/CyberChef/releases/tag/v9.22.0
[9.21.0]: https://github.com/gchq/CyberChef/releases/tag/v9.21.0
[9.20.0]: https://github.com/gchq/CyberChef/releases/tag/v9.20.0
[9.19.0]: https://github.com/gchq/CyberChef/releases/tag/v9.19.0
[9.18.0]: https://github.com/gchq/CyberChef/releases/tag/v9.18.0
[9.17.0]: https://github.com/gchq/CyberChef/releases/tag/v9.17.0
[9.16.0]: https://github.com/gchq/CyberChef/releases/tag/v9.16.0
[9.15.0]: https://github.com/gchq/CyberChef/releases/tag/v9.15.0
[9.14.0]: https://github.com/gchq/CyberChef/releases/tag/v9.14.0
[9.13.0]: https://github.com/gchq/CyberChef/releases/tag/v9.13.0
[9.12.0]: https://github.com/gchq/CyberChef/releases/tag/v9.12.0
[9.11.0]: https://github.com/gchq/CyberChef/releases/tag/v9.11.0
[9.10.0]: https://github.com/gchq/CyberChef/releases/tag/v9.10.0
[9.9.0]: https://github.com/gchq/CyberChef/releases/tag/v9.9.0
[9.8.0]: https://github.com/gchq/CyberChef/releases/tag/v9.8.0
[9.7.0]: https://github.com/gchq/CyberChef/releases/tag/v9.7.0
[9.6.0]: https://github.com/gchq/CyberChef/releases/tag/v9.6.0
[9.5.0]: https://github.com/gchq/CyberChef/releases/tag/v9.5.0
[9.4.0]: https://github.com/gchq/CyberChef/releases/tag/v9.4.0
[9.3.0]: https://github.com/gchq/CyberChef/releases/tag/v9.3.0
[9.2.0]: https://github.com/gchq/CyberChef/releases/tag/v9.2.0
[9.1.0]: https://github.com/gchq/CyberChef/releases/tag/v9.1.0
[9.0.0]: https://github.com/gchq/CyberChef/releases/tag/v9.0.0
[8.38.0]: https://github.com/gchq/CyberChef/releases/tag/v8.38.0
[8.37.0]: https://github.com/gchq/CyberChef/releases/tag/v8.37.0
[8.36.0]: https://github.com/gchq/CyberChef/releases/tag/v8.36.0
[8.35.0]: https://github.com/gchq/CyberChef/releases/tag/v8.35.0
[8.34.0]: https://github.com/gchq/CyberChef/releases/tag/v8.34.0
[8.33.0]: https://github.com/gchq/CyberChef/releases/tag/v8.33.0
[8.32.0]: https://github.com/gchq/CyberChef/releases/tag/v8.32.0
[8.31.0]: https://github.com/gchq/CyberChef/releases/tag/v8.31.0
[8.30.0]: https://github.com/gchq/CyberChef/releases/tag/v8.30.0
[8.29.0]: https://github.com/gchq/CyberChef/releases/tag/v8.29.0
[8.28.0]: https://github.com/gchq/CyberChef/releases/tag/v8.28.0
[8.27.0]: https://github.com/gchq/CyberChef/releases/tag/v8.27.0
[8.26.0]: https://github.com/gchq/CyberChef/releases/tag/v8.26.0
[8.25.0]: https://github.com/gchq/CyberChef/releases/tag/v8.25.0
[8.24.0]: https://github.com/gchq/CyberChef/releases/tag/v8.24.0
[8.23.1]: https://github.com/gchq/CyberChef/releases/tag/v8.23.1
[8.23.0]: https://github.com/gchq/CyberChef/releases/tag/v8.23.0
[8.22.0]: https://github.com/gchq/CyberChef/releases/tag/v8.22.0
[8.21.0]: https://github.com/gchq/CyberChef/releases/tag/v8.21.0
[8.20.0]: https://github.com/gchq/CyberChef/releases/tag/v8.20.0
[8.19.0]: https://github.com/gchq/CyberChef/releases/tag/v8.19.0
[8.18.0]: https://github.com/gchq/CyberChef/releases/tag/v8.18.0
[8.17.0]: https://github.com/gchq/CyberChef/releases/tag/v8.17.0
[8.16.0]: https://github.com/gchq/CyberChef/releases/tag/v8.16.0
[8.15.0]: https://github.com/gchq/CyberChef/releases/tag/v8.15.0
[8.14.0]: https://github.com/gchq/CyberChef/releases/tag/v8.14.0
[8.13.0]: https://github.com/gchq/CyberChef/releases/tag/v8.13.0
[8.12.0]: https://github.com/gchq/CyberChef/releases/tag/v8.12.0
[8.11.0]: https://github.com/gchq/CyberChef/releases/tag/v8.11.0
[8.10.0]: https://github.com/gchq/CyberChef/releases/tag/v8.10.0
[8.9.0]: https://github.com/gchq/CyberChef/releases/tag/v8.9.0
[8.8.0]: https://github.com/gchq/CyberChef/releases/tag/v8.8.0
[8.7.0]: https://github.com/gchq/CyberChef/releases/tag/v8.7.0
[8.6.0]: https://github.com/gchq/CyberChef/releases/tag/v8.6.0
[8.5.0]: https://github.com/gchq/CyberChef/releases/tag/v8.5.0
[8.4.0]: https://github.com/gchq/CyberChef/releases/tag/v8.4.0
[8.3.0]: https://github.com/gchq/CyberChef/releases/tag/v8.3.0
[8.2.0]: https://github.com/gchq/CyberChef/releases/tag/v8.2.0
[8.1.0]: https://github.com/gchq/CyberChef/releases/tag/v8.1.0
[8.0.0]: https://github.com/gchq/CyberChef/releases/tag/v8.0.0
[7.0.0]: https://github.com/gchq/CyberChef/releases/tag/v7.0.0
[6.0.0]: https://github.com/gchq/CyberChef/releases/tag/v6.0.0
[5.0.0]: https://github.com/gchq/CyberChef/releases/tag/v5.0.0
[4.0.0]: https://github.com/gchq/CyberChef/commit/b1d73a725dc7ab9fb7eb789296efd2b7e4b08306

[@n1474335]: https://github.com/n1474335
[@d98762625]: https://github.com/d98762625
[@j433866]: https://github.com/j433866
[@n1073645]: https://github.com/n1073645
[@GCHQ77703]: https://github.com/GCHQ77703
[@h345983745]: https://github.com/h345983745
[@s2224834]: https://github.com/s2224834
[@artemisbot]: https://github.com/artemisbot
[@tlwr]: https://github.com/tlwr
[@picapi]: https://github.com/picapi
[@Dachande663]: https://github.com/Dachande663
[@JustAnotherMark]: https://github.com/JustAnotherMark
[@sevzero]: https://github.com/sevzero
[@PenguinGeorge]: https://github.com/PenguinGeorge
[@arnydo]: https://github.com/arnydo
[@klaxon1]: https://github.com/klaxon1
[@bwhitn]: https://github.com/bwhitn
[@jarmovanlenthe]: https://github.com/jarmovanlenthe
[@tcode2k16]: https://github.com/tcode2k16
[@Cynser]: https://github.com/Cynser
[@anthony-arnold]: https://github.com/anthony-arnold
[@masq]: https://github.com/masq
[@Ge0rg3]: https://github.com/Ge0rg3
[@MShwed]: https://github.com/MShwed
[@kassi]: https://github.com/kassi
[@jarrodconnolly]: https://github.com/jarrodconnolly
[@VirtualColossus]: https://github.com/VirtualColossus
[@cbeuw]: https://github.com/cbeuw
[@matthieuxyz]: https://github.com/matthieuxyz
[@Flavsditz]: https://github.com/Flavsditz
[@pointhi]: https://github.com/pointhi
[@MarvinJWendt]: https://github.com/MarvinJWendt
[@dmfj]: https://github.com/dmfj
[@mattnotmitt]: https://github.com/mattnotmitt
[@Danh4]: https://github.com/Danh4
[@john19696]: https://github.com/john19696
[@t-8ch]: https://github.com/t-8ch
[@hettysymes]: https://github.com/hettysymes
[@swesven]: https://github.com/swesven
[@mikecat]: https://github.com/mikecat
[@crespyl]: https://github.com/crespyl
[@thomasleplus]: https://github.com/thomasleplus
[@valdelaseras]: https://github.com/valdelaseras
[@brun0ne]: https://github.com/brun0ne
[@joostrijneveld]: https://github.com/joostrijneveld
[@Xenonym]: https://github.com/Xenonym
[@gchq77703]: https://github.com/gchq77703
[@a3957273]: https://github.com/a3957273
[@0xThiebaut]: https://github.com/0xThiebaut
[@cnotin]: https://github.com/cnotin
[@KevinSJ]: https://github.com/KevinSJ
[@sw5678]: https://github.com/sw5678
[@sg5506844]: https://github.com/sg5506844
[@AliceGrey]: https://github.com/AliceGrey
[@AshCorr]: https://github.com/AshCorr
[@simonw]: https://github.com/simonw
[@chriswhite199]: https://github.com/chriswhite199
[@breakersall]: https://github.com/breakersall
[@evanreichard]: https://github.com/evanreichard
[@devcydo]: https://github.com/devcydo
[@zb3]: https://github.com/zb3
[@jkataja]: https://github.com/jkataja
[@tomgond]: https://github.com/tomgond
[@e218736]: https://github.com/e218736
[@TheZ3ro]: https://github.com/TheZ3ro
[@EvieHarv]: https://github.com/EvieHarv
[@cplussharp]: https://github.com/cplussharp
[@robinsandhu]: https://github.com/robinsandhu
[@eltociear]: https://github.com/eltociear


[8ad18b]: https://github.com/gchq/CyberChef/commit/8ad18bc7db6d9ff184ba3518686293a7685bf7b7
[9a33498]: https://github.com/gchq/CyberChef/commit/9a33498fed26a8df9c9f35f39a78a174bf50a513
[289a417]: https://github.com/gchq/CyberChef/commit/289a417dfb5923de5e1694354ec42a08d9395bfe
[e9ca4dc]: https://github.com/gchq/CyberChef/commit/e9ca4dc9caf98f33fd986431cd400c88082a42b8
[dd18e52]: https://github.com/gchq/CyberChef/commit/dd18e529939078b89867297b181a584e8b2cc7da
[a895d1d]: https://github.com/gchq/CyberChef/commit/a895d1d82a2f92d440a0c5eca2bc7c898107b737
[31a7f83]: https://github.com/gchq/CyberChef/commit/31a7f83b82e78927f89689f323fcb9185144d6ff
[760eff4]: https://github.com/gchq/CyberChef/commit/760eff49b5307aaa3104c5e5b437ffe62299acd1
[65ffd8d]: https://github.com/gchq/CyberChef/commit/65ffd8d65d88eb369f6f61a5d1d0f807179bffb7
[0a353ee]: https://github.com/gchq/CyberChef/commit/0a353eeb378b9ca5d49e23c7dfc175ae07107b08

[#95]: https://github.com/gchq/CyberChef/pull/299
[#173]: https://github.com/gchq/CyberChef/pull/173
[#143]: https://github.com/gchq/CyberChef/pull/143
[#224]: https://github.com/gchq/CyberChef/pull/224
[#239]: https://github.com/gchq/CyberChef/pull/239
[#248]: https://github.com/gchq/CyberChef/pull/248
[#255]: https://github.com/gchq/CyberChef/issues/255
[#277]: https://github.com/gchq/CyberChef/issues/277
[#281]: https://github.com/gchq/CyberChef/pull/281
[#284]: https://github.com/gchq/CyberChef/pull/284
[#291]: https://github.com/gchq/CyberChef/pull/291
[#294]: https://github.com/gchq/CyberChef/pull/294
[#296]: https://github.com/gchq/CyberChef/pull/296
[#298]: https://github.com/gchq/CyberChef/pull/298
[#311]: https://github.com/gchq/CyberChef/pull/311
[#325]: https://github.com/gchq/CyberChef/pull/325
[#338]: https://github.com/gchq/CyberChef/pull/338
[#340]: https://github.com/gchq/CyberChef/pull/340
[#344]: https://github.com/gchq/CyberChef/pull/344
[#348]: https://github.com/gchq/CyberChef/pull/348
[#351]: https://github.com/gchq/CyberChef/pull/351
[#387]: https://github.com/gchq/CyberChef/pull/387
[#394]: https://github.com/gchq/CyberChef/pull/394
[#428]: https://github.com/gchq/CyberChef/pull/428
[#439]: https://github.com/gchq/CyberChef/pull/439
[#440]: https://github.com/gchq/CyberChef/pull/440
[#441]: https://github.com/gchq/CyberChef/pull/441
[#443]: https://github.com/gchq/CyberChef/pull/443
[#446]: https://github.com/gchq/CyberChef/pull/446
[#448]: https://github.com/gchq/CyberChef/pull/448
[#449]: https://github.com/gchq/CyberChef/pull/449
[#455]: https://github.com/gchq/CyberChef/pull/455
[#458]: https://github.com/gchq/CyberChef/pull/458
[#461]: https://github.com/gchq/CyberChef/pull/461
[#467]: https://github.com/gchq/CyberChef/pull/467
[#468]: https://github.com/gchq/CyberChef/pull/468
[#476]: https://github.com/gchq/CyberChef/pull/476
[#477]: https://github.com/gchq/CyberChef/pull/477
[#489]: https://github.com/gchq/CyberChef/pull/489
[#496]: https://github.com/gchq/CyberChef/pull/496
[#500]: https://github.com/gchq/CyberChef/pull/500
[#506]: https://github.com/gchq/CyberChef/pull/506
[#515]: https://github.com/gchq/CyberChef/pull/515
[#516]: https://github.com/gchq/CyberChef/pull/516
[#525]: https://github.com/gchq/CyberChef/pull/525
[#528]: https://github.com/gchq/CyberChef/pull/528
[#530]: https://github.com/gchq/CyberChef/pull/530
[#531]: https://github.com/gchq/CyberChef/pull/531
[#533]: https://github.com/gchq/CyberChef/pull/533
[#535]: https://github.com/gchq/CyberChef/pull/535
[#556]: https://github.com/gchq/CyberChef/pull/556
[#566]: https://github.com/gchq/CyberChef/pull/566
[#571]: https://github.com/gchq/CyberChef/pull/571
[#585]: https://github.com/gchq/CyberChef/pull/585
[#591]: https://github.com/gchq/CyberChef/pull/591
[#595]: https://github.com/gchq/CyberChef/pull/595
[#614]: https://github.com/gchq/CyberChef/pull/614
[#625]: https://github.com/gchq/CyberChef/pull/625
[#627]: https://github.com/gchq/CyberChef/pull/627
[#632]: https://github.com/gchq/CyberChef/pull/632
[#652]: https://github.com/gchq/CyberChef/pull/652
[#653]: https://github.com/gchq/CyberChef/pull/653
[#674]: https://github.com/gchq/CyberChef/pull/674
[#683]: https://github.com/gchq/CyberChef/pull/683
[#865]: https://github.com/gchq/CyberChef/pull/865
[#906]: https://github.com/gchq/CyberChef/pull/906
[#912]: https://github.com/gchq/CyberChef/pull/912
[#917]: https://github.com/gchq/CyberChef/pull/917
[#934]: https://github.com/gchq/CyberChef/pull/934
[#948]: https://github.com/gchq/CyberChef/pull/948
[#951]: https://github.com/gchq/CyberChef/pull/951
[#952]: https://github.com/gchq/CyberChef/pull/952
[#965]: https://github.com/gchq/CyberChef/pull/965
[#966]: https://github.com/gchq/CyberChef/pull/966
[#987]: https://github.com/gchq/CyberChef/pull/987
[#999]: https://github.com/gchq/CyberChef/pull/999
[#1006]: https://github.com/gchq/CyberChef/pull/1006
[#1022]: https://github.com/gchq/CyberChef/pull/1022
[#1037]: https://github.com/gchq/CyberChef/pull/1037
[#1045]: https://github.com/gchq/CyberChef/pull/1045
[#1049]: https://github.com/gchq/CyberChef/pull/1049
[#1065]: https://github.com/gchq/CyberChef/pull/1065
[#1066]: https://github.com/gchq/CyberChef/pull/1066
[#1083]: https://github.com/gchq/CyberChef/pull/1083
[#1189]: https://github.com/gchq/CyberChef/pull/1189
[#1242]: https://github.com/gchq/CyberChef/pull/1242
[#1244]: https://github.com/gchq/CyberChef/pull/1244
[#1313]: https://github.com/gchq/CyberChef/pull/1313
[#1326]: https://github.com/gchq/CyberChef/pull/1326
[#1364]: https://github.com/gchq/CyberChef/pull/1364
[#1264]: https://github.com/gchq/CyberChef/pull/1264
[#1266]: https://github.com/gchq/CyberChef/pull/1266
[#1250]: https://github.com/gchq/CyberChef/pull/1250
[#1308]: https://github.com/gchq/CyberChef/pull/1308
[#1405]: https://github.com/gchq/CyberChef/pull/1405
[#1421]: https://github.com/gchq/CyberChef/pull/1421
[#1427]: https://github.com/gchq/CyberChef/pull/1427
[#1472]: https://github.com/gchq/CyberChef/pull/1472
[#1457]: https://github.com/gchq/CyberChef/pull/1457
[#1466]: https://github.com/gchq/CyberChef/pull/1466
[#1456]: https://github.com/gchq/CyberChef/pull/1456
[#1450]: https://github.com/gchq/CyberChef/pull/1450
[#1498]: https://github.com/gchq/CyberChef/pull/1498
[#1499]: https://github.com/gchq/CyberChef/pull/1499
[#1528]: https://github.com/gchq/CyberChef/pull/1528
[#661]: https://github.com/gchq/CyberChef/pull/661
[#493]: https://github.com/gchq/CyberChef/pull/493
[#592]: https://github.com/gchq/CyberChef/issues/592
[#1703]: https://github.com/gchq/CyberChef/issues/1703
[#1675]: https://github.com/gchq/CyberChef/issues/1675
[#1678]: https://github.com/gchq/CyberChef/issues/1678
[#1541]: https://github.com/gchq/CyberChef/issues/1541
[#1667]: https://github.com/gchq/CyberChef/issues/1667
[#1555]: https://github.com/gchq/CyberChef/issues/1555
[#1694]: https://github.com/gchq/CyberChef/issues/1694
[#1699]: https://github.com/gchq/CyberChef/issues/1699
[#1757]: https://github.com/gchq/CyberChef/issues/1757
[#1752]: https://github.com/gchq/CyberChef/issues/1752
[#1753]: https://github.com/gchq/CyberChef/issues/1753
[#1750]: https://github.com/gchq/CyberChef/issues/1750
[#1591]: https://github.com/gchq/CyberChef/issues/1591
[#654]: https://github.com/gchq/CyberChef/issues/654
[#1762]: https://github.com/gchq/CyberChef/issues/1762
[#1606]: https://github.com/gchq/CyberChef/issues/1606
[#1197]: https://github.com/gchq/CyberChef/issues/1197
[#933]: https://github.com/gchq/CyberChef/issues/933
[#1361]: https://github.com/gchq/CyberChef/issues/1361
[#1765]: https://github.com/gchq/CyberChef/issues/1765
[#1767]: https://github.com/gchq/CyberChef/issues/1767
[#1769]: https://github.com/gchq/CyberChef/issues/1769
[#1759]: https://github.com/gchq/CyberChef/issues/1759
[#1504]: https://github.com/gchq/CyberChef/issues/1504
[#512]: https://github.com/gchq/CyberChef/issues/512
[#1732]: https://github.com/gchq/CyberChef/issues/1732
[#1789]: https://github.com/gchq/CyberChef/issues/1789
