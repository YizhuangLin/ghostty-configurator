# Ghostty Configurator · Ghostty 可视化配置器

A single-file, offline-capable visual configurator for the [Ghostty](https://ghostty.org) terminal. Pick a theme, tweak look & feel, preview it live in a simulated terminal, and export a ready-to-use `config` file.

一个**单文件、离线可用**的 [Ghostty](https://ghostty.org) 终端可视化配置器:挑主题、调外观、在仿真终端里**实时预览**,一键导出可直接用的 `config`。

> 🔗 **Live demo / 在线体验:** https://ghostty.cestduleon.cc

![status](https://img.shields.io/badge/config-100%25%20valid-brightgreen) ![deps](https://img.shields.io/badge/dependencies-none-blue) ![file](https://img.shields.io/badge/single%20file-offline-orange)

---

## Features · 功能

- **463 themes** with a curated popularity ranking, live search, and dark/light filters — 463 款主题,热门前置、可搜索、深/浅色筛选
- **Follow system appearance** — emit `theme = light:…,dark:…` to auto-switch day/night — 跟随系统日夜自动切换
- **Live terminal preview** — transparency, blur, font, ligatures, cursor, padding, titlebar styles, split dimming, shaders (CRT / bloom / scanlines / cursor smear) — 实时预览质感/字体/光标/标题栏/特效
- **Real Dock icon grid** — preview all 9 built-in `macos-icon` styles — 9 款 Dock 图标真图预览
- **Full control, no truncation** — every setting exposed with recommendations; custom font input — 所有选项不缩略、可自定义
- **Window & startup, behavior, background image, selection colors, per-shortcut keybinds** and more
- **Remembers your choices** (localStorage) and **every export is validated** against `ghostty +validate-config` — 本地记忆,导出 100% 过官方校验

## Usage · 使用

1. Open the [live demo](https://ghostty.cestduleon.cc) (or download `index.html` and open it locally).
2. Tweak options; watch the preview.
3. Click **下载 config** (Download) or **复制配置** (Copy).
4. Save the file to your Ghostty config path and reload — see the built-in **安装说明** (Install) panel.

Config path (macOS): `~/.config/ghostty/config` or `~/Library/Application Support/com.mitchellh.ghostty/config`. Reload in Ghostty with `⌘⇧,`.

## Development · 开发

It's one self-contained `index.html` — no build step, no dependencies. Just open it.

`tools/verify.js` (Node) runs the integrity gate: duplicate-ID scan, JS syntax check, control-wiring check, and validates the default export against a locally installed Ghostty.

```sh
node tools/verify.js index.html
```

## Attribution · 署名

- **Dock icons** are artwork © the [Ghostty project](https://github.com/ghostty-org/ghostty), embedded **for preview only**. See [`NOTICE`](NOTICE).
- **Color schemes** ship with Ghostty and largely derive from [iTerm2-Color-Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes) (MIT).
- This is an **unofficial** community tool, not affiliated with or endorsed by Ghostty.

## License · 许可

Configurator code: [MIT](LICENSE). Third-party assets retain their own rights — see [`NOTICE`](NOTICE).
