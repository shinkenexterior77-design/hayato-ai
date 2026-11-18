# HAYATO AI v0.3 — AI頭脳接続版

## ファイル
- `index.html`, `sw.js`, `manifest.webmanifest`: GitHub Pages のリポジトリ直下へアップロードして既存ファイルを置換
- `cloudflare-worker.js`: Cloudflare Workers の編集画面へ貼り付けてデプロイ（GitHub Pagesにはアップロードしない）

## Cloudflare Worker の設定
1. Cloudflare Dashboard → Workers & Pages → Create → Worker を作成。
2. Workerのコードを `cloudflare-worker.js` に置き換え、Deploy。
3. Workerの Settings → Variables and Secrets に次を追加：
   - `OPENAI_API_KEY` = OpenAI APIの秘密キー（Secret）
   - `HAYATO_ACCESS_PIN` = 自分で決めた長く推測されにくい接続PIN（Secret）
   - `ALLOWED_ORIGIN` = `https://shinkenexterior77-design.github.io`（Text。GitHub Pagesの実際のオリジンに合わせる）
   - `OPENAI_MODEL` = `gpt-4o-mini`（任意。利用可能なモデルに変更可）
4. Worker URL（例 `https://hayato-xxx.your-subdomain.workers.dev`）を控える。
5. GitHub Pages の HAYATO AI を開き、Worker URL とPINを入力して「接続設定」。
6. 「ハヤト、自己紹介して」と送信し、AIの返答が来るか確認。

## 重要な注意
- OpenAI APIは無料とは限らず、ChatGPT Plusとは別料金です。OpenAI側で請求設定と利用上限を確認してから使ってください。
- GitHub Pagesの公開コードにAPIキー・PINを書かないでください。WorkerのSecretとして設定してください。
- 接続PINは端末に保存しません。再起動時は再入力します。
- Worker URLは端末に保存します。APIキーはブラウザに渡しません。
- 公開Workerは第三者からの不正利用・課金リスクが残ります。PINは十分長くし、Cloudflare側のレート制限やアクセス制御、OpenAI側の予算アラート・利用上限を設定してください。Originチェックだけではアクセス制御になりません。
- Web検索、画像解析、長期記憶は未実装。会話履歴は画面を閉じると消えます。
- iOSの音声認識・声質は端末やブラウザに依存します。
- GitHub Pagesを更新後、古い画面が残る場合はページを再読み込みしてください。
