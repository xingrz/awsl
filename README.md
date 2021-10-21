AWSL
========

[![version][version-img]][script-url] [![license][license-img]][license-url] [![issues][issues-img]][issues-url] [![stars][stars-img]][stars-url] [![commits][commits-img]][commits-url]

给微博增加一键转发功能，支持配置不同的一键转发短语。

![](screenshot.png)

## 安装

### 方式 1：油猴脚本

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 或其它兼容的脚本管理器；
2. 点击下方图标安装 (或手动打开 [awsl.user.js][script-url] 将脚本添加到管理器中)：

   [![script-img]][script-url]

### 方式 2：Chrome 扩展

1. 打开扩展管理 (`chrome://extensions/`)页面；
2. 点击下方图标下载压缩包，并拖动到扩展管理页面安装：

   [![chrome-img]][chrome-url]

## 开发

1. 克隆项目，执行 `npm install` 安装所需开发依赖
2. 执行 `npm run watch` 开启一个后台编译
3. 在 Tampermonkey 中通过下列脚本加载本插件：

    ```js
    // ==UserScript==
    // @name         AWSL (debug)
    // @version      debug
    // @match        https://weibo.com/*
    // @grant        GM.getValue
    // @grant        GM.setValue
    // @require      file:///path/to/xingrz/awsl/dist/awsl.user.js
    // ==/UserScript==
    ```

## 协议

本项目基于 [WTFPL](LICENSE) 许可协议开源。

[version-img]: https://img.shields.io/github/v/tag/xingrz/awsl?label=version&sort=semver&style=flat-square
[license-img]: https://img.shields.io/github/license/xingrz/awsl?style=flat-square
[license-url]: LICENSE
[issues-img]: https://img.shields.io/github/issues/xingrz/awsl?style=flat-square
[issues-url]: https://github.com/xingrz/awsl/issues
[stars-img]: https://img.shields.io/github/stars/xingrz/awsl?style=flat-square
[stars-url]: https://github.com/xingrz/awsl/stargazers
[commits-img]: https://img.shields.io/github/last-commit/xingrz/awsl?style=flat-square
[commits-url]: https://github.com/xingrz/awsl/commits/master

[script-img]: https://img.shields.io/github/v/tag/xingrz/awsl?label=awsl&logo=tampermonkey&logoColor=white&sort=semver&style=for-the-badge
[script-url]: https://raw.githubusercontent.com/xingrz/awsl/master/awsl.user.js

[chrome-img]: https://img.shields.io/github/v/tag/xingrz/awsl?label=awsl&logo=google-chrome&logoColor=white&sort=semver&style=for-the-badge
[chrome-url]: https://github.com/xingrz/awsl/archive/refs/heads/master.zip
