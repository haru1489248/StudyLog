# StudyLog

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.x-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-orange?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

Next.js (App Router) + Supabase + Prisma を使った **学習ログ管理アプリ** です。
ローカル開発・本番デプロイまでの手順を 1 ファイルにまとめました。

---

## 目次

1. [技術スタック](#技術スタック)
2. [アプリケーション](#-アプリケーション)
3. [前提条件 (Prerequisites)](#前提条件-prerequisites)
4. [クイックスタート](#クイックスタート)
5. [環境変数の管理方式](#環境変数の管理方式)
6. [ローカル Supabase (バックエンド) の起動](#ローカル-supabase-バックエンド-の起動)
7. [Prisma ワークフロー](#prisma-ワークフロー)
8. [スクリプト一覧](#スクリプト一覧)
9. [本番デプロイ (Vercel)](#本番デプロイ-vercel)
10. [CI / CD メモ](#ci--cd-メモ)
11. [ライセンス](#ライセンス)

---

## 技術スタック

| 分類         | ツール                                   | 備考                                        |
| ------------ | ---------------------------------------- | ------------------------------------------- |
| フロント     | **Next.js 15 (App Router)**              | TypeScript / Tailwind CSS                   |
| 状態管理     | TanStack Query (v5)                      | `src/app/providers.tsx` で統合              |
| UI           | Tailwind CSS + shadcn/ui                 | 必要に応じて追加                            |
| 認証         | next-auth (メール — 後日 OAuth 追加予定) | ロール管理も対応                            |
| バックエンド | **Supabase (PostgreSQL 17)**             | CLI でローカル Docker 起動                  |
| ORM          | **Prisma 6**                             | models/ ディレクトリをマルチファイル管理    |
| ホスティング | **Vercel**                               | Docker 不要。環境変数は Vercel Dashboard へ |
| 監視         | Sentry (後日)                            | –                                           |

---

## 📸 アプリケーション

> **スクリーンショットを追加予定**
>
> アプリの主要画面のスクリーンショットをここに追加します。

---

## 前提条件 (Prerequisites)

| ツール             | バージョンの目安       |
| ------------------ | ---------------------- |
| **Node.js**        | 18 以上 (推奨 20)      |
| **Docker Desktop** | 最新                   |
| **Supabase CLI**   | `supabase -v` → 2.x 系 |
| Git                | –                      |

> **Supabase CLI のインストール**
>
> - macOS (Homebrew)：`brew install supabase/tap/supabase`
> - Windows (Scoop) ：`scoop install supabase`
> - Linux (npm) ：`npm create supabase@latest` (プロンプトで PATH を通す)

---

## クイックスタート

```bash
git clone https://github.com/your-org/studylog.git
cd studylog

# 依存関係をインストール
npm ci             # または pnpm i / yarn

# (オプション) Supabase スタックを起動したい場合
supabase start

# 開発サーバー起動
npm run dev        # => http://localhost:3000
```

---

## ローカル Supabase (バックエンド) の起動

ローカル環境でも Postgres・Auth・Storage をフルで再現できます。
**Supabase CLI が必須**なので、まだ入れていないメンバーは先にインストールしてください。

### 0. Supabase CLI インストール

| OS               | 推奨コマンド                                                                  |
| ---------------- | ----------------------------------------------------------------------------- |
| macOS (Homebrew) | `brew install supabase/tap/supabase`                                          |
| Windows (Scoop)  | `scoop install supabase`                                                      |
| Linux (npm)      | `npm create supabase@latest` <br>→ プロンプトで `global` を選択し PATH を通す |

```bash
supabase -v   # 2.x 系が表示されれば OK
```

### 1. スタックを起動する

```bash
# リポジトリ直下で
supabase start
```

- 初回は Docker イメージを pull するため数分かかります。
- 起動ログに **anon key / JWT secret** などが表示されるので控えておくと便利です。

### 2. 主要エンドポイント

| 機能                          | URL / ポート             | 備考                                                      |
| ----------------------------- | ------------------------ | --------------------------------------------------------- |
| **REST / Auth / Storage API** | `http://127.0.0.1:54321` | フロントから呼び出す基盤 API                              |
| **PostgreSQL**                | `127.0.0.1:54322`        | `postgres / postgres` で接続 (Prisma・psql・DBeaver など) |
| **Supabase Studio (GUI)**     | `http://127.0.0.1:54323` | 初回ログインは `supabase / supabase`                      |

### 4. `.env.local` を作成してフロントと Prisma をローカル DB に向ける

```dotenv
# --- Supabase (ローカル開発用) ---
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase start の anon key>

# --- Prisma / Postgres (ローカル開発用) ---
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@127.0.0.54322/postgres"

# --- NextAuth.js (開発環境) ---
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-development-secret-key

# --- Auth0 (Twitter認証用) ---
AUTH0_ID=temp-auth0-client-id
AUTH0_SECRET=temp-auth0-client-secret
AUTH0_ISSUER=https://temp.auth0.com

# --- GitHub (直接認証) ---
GITHUB_ID=temp-github-client-id
GITHUB_SECRET=temp-github-client-secret

# --- Google (直接認証) ---
GOOGLE_ID=temp-google-client-id
GOOGLE_SECRET=temp-google-client-secret
```

> **本番環境での設定**
>
> Vercel Dashboard の Environment Variables で以下を設定：
>
> ```dotenv
> # --- NextAuth.js (本番環境) ---
> NEXTAUTH_URL=https://your-domain.vercel.app
> NEXTAUTH_SECRET=your-production-secret-key
>
> # --- Auth0 (Twitter認証用) ---
> AUTH0_ID=real-auth0-client-id
> AUTH0_SECRET=real-auth0-client-secret
> AUTH0_ISSUER=https://your-domain.auth0.com
>
> # --- GitHub (直接認証) ---
> GITHUB_ID=real-github-client-id
> GITHUB_SECRET=real-github-client-secret
>
> # --- Google (直接認証) ---
> GOOGLE_ID=real-google-client-id
> GOOGLE_SECRET=real-google-client-secret
>
> # --- Supabase (本番環境) ---
> NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
> NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
> DATABASE_URL=your-production-database-url
> ```

### 5. Prisma マイグレーション (ローカル DB)

```bash
# schema.prisma を編集したあと
npm run db:migrate --name <migration_name>
```

- ローカル DB が更新され、`prisma/migrations/` に SQL が生成されます。
- 生成されたマイグレーションを git push → 本番環境では `prisma migrate deploy` で適用します。

### 5. スタックの停止／リセット

| 操作        | コマンド            | 効果                                     |
| ----------- | ------------------- | ---------------------------------------- |
| 停止        | `supabase stop`     | Docker コンテナを停止                    |
| DB リセット | `supabase db reset` | テーブル初期化・anon key 再生成 (開発用) |

---

> **FAQ**
>
> - **CLI を入れたくない人は開発できる？**
>   基本はできません。CLI が内部で Docker Compose を生成しコンテナを管理するため、
>   Supabase CLI の導入はローカル開発の前提としてください。
> - **本番 Supabase にはどう適用する？**
>   CI や手動で `prisma migrate deploy` を実行し、本番用 `DATABASE_URL` で接続してください。
> - **anon key は毎回変わる？**
>   `supabase db reset` 時だけ再発行されます。通常の `stop`→`start` では変わりません。

---

以降の項目については必要に応じて追記してください。
