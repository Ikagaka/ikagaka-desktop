# ikagaka-desktop

デスクトップ版イカガカ

## 目的

イカガカは「ブラウザで(も)動く」「オープンソースで拡張性の高い」伺かベースウェアを目指して開発された。

Webベースウェアとして登場したイカガカは、EmscriptenによるSHIORIエミュレーション、BrowserFSによるファイルシステムエミュレーション、jszip、canvas利用等によって、頑張ればブラウザでも色々動かせるという知見を示した。

一方でその後、「ブラウザで(も)動く」目的のための「ブラウザに載せる技術」の複雑性により、作業が進まないという問題を抱えている。

そこで、このプロジェクトではもう一つの「オープンソースで拡張性の高い」伺かベースウェアを作るという側面について推し進めるために、一旦一般WebブラウザではなくelectronによるWindows上での動作を前提として、基礎的なベースウェアの仕組みを拡充することを目的とする。

## 前提

- とりあえずElectronの動くWindows上で動作すればよい
- ファイルシステムエミュレーション不要
- SHIORIエミュレーション不要
- 理想をSSP置き換えとして一定の互換性向上を目指す（最初から100%担保を目的とするものでは無く、ブラウザ上動作他周辺の目的とバランスをとってすすめたい）

## ツールセット

- node.js 8+
- TypeScript 2.6+
- Electron
- Visual Studio Code または Visual Studio (Community)

複雑性を回避するため、Babelは使わずTypeScript一本で出来ることをし、またWebpack等のモジュールバンドラーは出来れば使わないで行きたい。

## 環境構築

### node.js

[node.js公式](https://nodejs.org/ja/)からインストールできる。

plenvのように複数バージョンを扱える[nodist](https://github.com/marcelklehr/nodist)などを使う方法もある。

お好みで。

### git

Githubを使うので。

[git](https://git-scm.com/downloads)公式、[Git for Windows](http://gitforwindows.org/)、[SourceTree](https://ja.atlassian.com/software/sourcetree)、[Github Desktop](https://desktop.github.com/)等がある。

コマンドライン派としては前者側がおすすめだがどれでも良い。GUIはなぜかコマンドラインと別の言葉を使いたがることが多い。

### Visual Studio Code または Visual Studio (Community)

どっちでもいいのでMSからインストール。

ソリューションファイルを現状設けていないのでVisual Studio Codeでやるほうがスムーズ。

ただインテリセンスがいまいちいい感じに更新されないようになってエディタ再起動したりする作業はたまにあります。

### リポジトリをクローン

このリポジトリをクローン

### npm install

```bash
npm install
```

を叩くと一式インストールされます。

なおyarnだとcuttlebone系の依存関係がめんどくさいことになって上手いこと行かないのでnpm一択。

### 開発コマンド

基本的に2窓開いて（VSCodeの下でもいける）、`npm run watchbuild`と`npm run devw`を実行しとくスタイルが便利。

#### サンプルゴーストをダウンロード

初回に1回だけ叩いてください。

curlとunzipが必要です。

```bash
npm run prepare:example
```

無い場合はそれぞれgnuwin32あたりで用意するか、package.jsonを覗いて同じ感じにnarダウンロードして解凍配置するかしてください。

#### ビルド系

初回及びHTML更新があった場合はbuild。以後はwatchbuildでよさそう。

```bash
# ビルド（TypeScriptをトランスパイル）し、HTMLと一緒にdistフォルダに置く
npm run build
# インストールさえyarn回避すればyarn buildとかでもよい

# TypeScriptのみ更新をチェックしつつビルドする（HTMLは更新されない） 通常はこちらで良いと思う
npm run watchbuild
```

#### 閲覧系

```bash
# 開発用にElectronを立ち上げる（ファイルが更新あったら再読み込みする）
npm run devw

# 開発用にElectronを立ち上げる（上記に加えて背景透過＆ウインドウ枠非表示＆最大化でゴーストっぽくなる）
npm run dev
```

devのほうは閉じるボタンがないのでタスクバーアイコン右クリかAlt+F4で閉じて下さい。

### License

[MITライセンス](https://narazaka.net/license/MIT?2018)でリリースされています。
