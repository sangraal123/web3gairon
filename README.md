# Web3概論 ERC-6551 デモ

このデモは[tokenbound.org](https://tokenbound.org)で公開されているデモアプリをベースにアレンジしたものであり、現時点で画像のアップロードによるNFT(ERC-721)のミント機能と任意のNFTに対するTBA(TokenBoundAccount)の作成機能を実装しています。

## 使ってみよう

前提条件<br/>
・暗号資産ウォレットをインストールしたブラウザがある事<br/>
・Sepolia Testnet上のネイティブトークンを持っている事（ガス代に必要）</br>


[ここをクリック](https://web3gairon-erc6551-ver2.vercel.app/) してデモサイトに飛びます。

１．「ウォレットを接続」ボタンをクリックして開発用のウォレットを接続します。<br/>
２．「画像を選択しNFTをミントする」をクリックして自分の好きな画像をアップロードします。<br/>
３．ウォレットが立ち上がるのでコントラクトを承認します。<br/>
４．NFTのミントに成功すると、下のToken Contract(ERC-721)とToken IDにその情報が自動入力されるので、「CREATE ACCOUNT」をクリックします。<br/>
５．ウォレットが立ち上がるのでコントラクトを承認します。<br/>
６．ポップアップでアドレスが表示されたら、NFTのウォレット化に成功です。<br/>

お疲れ様でした。

## さらなる学習

これは、 [wagmi](https://wagmi.sh) + [viem](https://viem.sh) + [ConnectKit](https://docs.family.co/connectkit) + [Vite](https://vitejs.dev/) を組み合わせたプロジェクトであり、 [`create-wagmi`](https://github.com/wagmi-dev/wagmi/tree/main/packages/create-wagmi)でブートストラップされています。

[Vite](https://vitejs.dev/), [ConnectKit](https://docs.family.co/connectkit) または [wagmi](https://wagmi.sh) についてより深く学習するには、以下のリソースを参考にしてください。

- [viemドキュメント](https://viem.sh) – viemのHooksとAPIについて学ぶ
- [wagmiドキュメント](https://wagmi.sh) – wagmiのHooksとAPIについて学ぶ
- [wagmi実装例](https://wagmi.sh/examples/connect-wallet) – wagmiを使った簡単な例の一式
- [ConnectKitドキュメント](https://docs.family.co/connectkit) – ConnectKitについてより深く学ぶ（設定、テーマ、高度な使い方など）
- [Viteドキュメント](https://vitejs.dev/) – learn about Viteの特徴とAPIについて学ぶ
