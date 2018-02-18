# ikagaka-desktop

デスクトップ版イカガカ

## 目的

イカガカは「ブラウザで(も)動く」「オープンソースで拡張性の高い」伺かベースウェアを目指して開発されました。

Webベースウェアとして登場したイカガカは、EmscriptenによるSHIORIエミュレーション、BrowserFSによるファイルシステムエミュレーション、jszip、canvas利用等によって、頑張ればブラウザでも色々動かせるという知見を示すことができました。

一方でその後、「ブラウザで(も)動く」目的のための「ブラウザに載せる技術」の複雑性により、作業が進まないという問題を抱えています。

そこで、このプロジェクトではもう一つの「オープンソースで拡張性の高い」伺かベースウェアを作るという側面について推し進めるために、一旦一般WebブラウザではなくelectronによるWindows上での動作を前提として、基礎的なベースウェアの仕組みを拡充することを目的とします。

## 前提

- とりあえずElectronの動くWindows上で動作すればよい
- ファイルシステムエミュレーション不要
- SHIORIエミュレーション不要
- 理想をSSP置き換えとして一定の互換性向上を目指す（最初から100%担保を目的とするものでは無く、ブラウザ上動作他周辺の目的とバランスをとってすすめたい）

## ツールセット

- node.js 8+
- TypeScript 2.7+
- NW.jsまたはElectron
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

基本的に2窓開いて（VSCodeの下でもいける）、`npm run watchbuild`と`npm run ndevw`を実行しとくスタイルが便利。

#### サンプルゴーストをダウンロード

初回に1回だけ叩いてください。

```bash
npm run prepare:example
```

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
# 開発用にNW.jsを立ち上げる（ファイルが更新あったら再読み込みする）
npm run ndevw

# 開発用にNW.jsを立ち上げる（上記に加えて背景透過＆ウインドウ枠非表示＆最大化でゴーストっぽくなる）
npm run ndev

# NW.jsを立ち上げる（更新トラッキングなし）
npm run n

# 開発用にElectronを立ち上げる（ファイルが更新あったら再読み込みする）
npm run edevw

# 開発用にElectronを立ち上げる（上記に加えて背景透過＆ウインドウ枠非表示＆最大化でゴーストっぽくなる）
npm run edev

# Electronを立ち上げる（更新トラッキングなし）
npm run e
```

devのほうは閉じるボタンがないのでタスクバーアイコン右クリかAlt+F4で閉じて下さい。

## 周辺ライブラリ

[イカガカの要素技術（伺か Advent Calendar 2016）](http://narazaka.blog109.fc2.com/blog-entry-238.html) にまとめられています。

ブラウザ動作でないので内必要なのは

- 単体ゴーストの動作(materia相当) https://github.com/Ikagaka/ghost-kernel.js
- 複数ゴーストの協調動作(SSP相当) なし 古いコードベースだと https://github.com/Ikagaka/NanikaManager だが、1から作った方が良さそうな出来。
- シェル描画ライブラリ https://github.com/Ikagaka/cuttlebone （とりあえず現状一番動くものなのでこれを使う。API刷新したい箇所があったりWebGL使いたかったり。）
- さくらスクリプトパーサー https://github.com/Ikagaka/sakurascript
- さくらスクリプトをウェイト考慮して実行しイベントを飛ばす実行機 https://github.com/Ikagaka/sakurascript-executer.js
- SHIORI接続 本物のDLLに繋ぐライブラリはない。作る必要あり。
- SHIORI通信インターフェース https://github.com/Ikagaka/shiorif
- ファイルシステム操作関係（インストールとか含む） https://github.com/Ikagaka/NanikaStorage

その他多分あまり表に出てこないが使うやつとしては

- 単体ゴースト動作させるghost-kernel.jsが前提としているイベントルーターライブラリ https://github.com/Narazaka/lazy-event-router.js
- SHIORIプロトコルパーサー/ビルダー https://github.com/Narazaka/shiorijk
- SHIORI通信の2.x/3.x変換 https://github.com/Narazaka/shiori_transaction.js と https://github.com/Narazaka/shiori_converter.js の合わせ技
- タイマーイベント起こすやつ https://github.com/Ikagaka/ukagaka-timer-event-source.js
- descript.txtとかのパーサー（型整備が途中） https://github.com/Ikagaka/ukagaka-install-descript-info.js cuttleboneはこれ使わず独自でパースしてます
- narを解凍してNanikaStorageのインターフェースで使えるようにするやつ https://github.com/Ikagaka/NarLoader
- ファイルシステムベースライブラリ（NanikaStorageが使ってる） https://github.com/Narazaka/fso

これらを同時開発する仕組みとして[ikagaka-project](https://github.com/Ikagaka/ikagaka-project)があります。

## License

[MITライセンス](https://narazaka.net/license/MIT?2018)でリリースされています。
