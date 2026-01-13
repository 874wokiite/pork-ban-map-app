---
name: release-notes-generator
description: コミット履歴からリリースノートを生成する。「リリースノート書いて」「リリースノート作成」「変更履歴まとめて」「バージョンをリリースして」などと言われたときに使用。GitタグやGitHubリリースの作成も対応。
allowed-tools: Bash, Read, Edit, Write
---

# リリースノート生成 Skill

## タスク

コミット履歴からリリースノートを自動生成し、タグ作成・GitHubリリース・README更新まで行う。

## Step 1: 現状確認

```bash
# 既存タグの確認
git tag -l --sort=-version:refname

# 最新タグからのコミット履歴を取得
git log $(git describe --tags --abbrev=0 2>/dev/null || echo "")..HEAD --oneline --date=short --format="%h %ad %s"
```

## Step 2: バージョン番号の決定

既存タグから次のバージョンを推測:
- v1.0.0 → v1.1.0（機能追加）
- v1.1.0 → v1.1.1（バグ修正のみ）
- v1.1.0 → v2.0.0（破壊的変更）

ユーザーにバージョン番号を確認する。

## Step 3: コミットの分類

コミットメッセージを以下のカテゴリに分類:

| プレフィックス | カテゴリ |
|---------------|---------|
| feat: | 新機能 |
| fix: | バグ修正 |
| docs: | ドキュメント |
| style: | スタイル変更 |
| refactor: | リファクタリング |
| test: | テスト |
| chore: | その他 |

## Step 4: リリースノートの生成

以下の形式で生成:

```markdown
## {version} - {YYYY-MM-DD}

### 新機能
- 機能1の説明
- 機能2の説明

### バグ修正
- 修正1の説明

### その他
- その他の変更
```

### ポイント
- コミットメッセージを簡潔な日本語に変換
- 技術的な詳細より「何ができるようになったか」を重視
- 関連するコミットはまとめて1項目に

## Step 5: ユーザー確認

生成したリリースノートを表示し、以下を確認:
1. 内容に問題ないか
2. タグを作成するか
3. GitHubリリースを作成するか
4. READMEを更新するか

## Step 6: タグ作成

```bash
git tag {version}
```

## Step 7: GitHubリリース作成

```bash
gh release create {version} --title "{version}" --notes "{リリースノート}"
```

## Step 8: README更新

README.mdのRelease Notesセクションに新バージョンを追加。
