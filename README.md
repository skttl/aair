# Auto AI Review
CLI Code Review powered by ChatGPT

## Setup
Make sure you have at least Node18 and `npx` in your path. You'll need an OpenAI API key to use this tool. You can set it up in two ways:

1. Environment variable: Set `OPENAI_API_KEY` in your environment
2. Settings command: Use `aair settings --key YOUR_API_KEY`

## Installation

```bash
npm install -g auto-ai-review
```

## Usage

### Review Modes

The tool supports three different review modes:

#### 1. Review Staged Changes (Default)
Review changes that are currently staged in git:

```bash
aair review
```

#### 2. Review Specific Files
Review one or more specific files, regardless of git status:

```bash
aair files path/to/file1.ts path/to/file2.ts
```

#### 3. Review Branch Changes
Review changes between branches (defaults to comparing against 'main'):

```bash
# Compare feature branch against main
aair branch feature-branch

# Compare between any two branches
aair branch feature-branch develop
```

### Settings Management

The tool supports customizable settings that are stored in `~/.aair-settings.json`. You can manage these settings using the following commands:

#### View Current Settings
```bash
aair settings --show
```

#### Update OpenAI API Key
```bash
aair settings --key YOUR_API_KEY
```

#### Change AI Model
```bash
aair settings --model MODEL_NAME
```
Default: `gpt-4`

#### Customize Review Prompt
```bash
aair settings --prompt "Your custom review prompt"
```

You can combine multiple settings in a single command:
```bash
aair settings --model gpt-4-turbo-preview --prompt "Your custom prompt"
```

## Configuration

Default settings:
- Model: `gpt-4`
- Prompt: Basic code review prompt focusing on TypeScript repositories
- API Key: Loaded from settings or environment variable `OPENAI_API_KEY`

All settings are stored securely in `~/.aair-settings.json`.

## Examples

1. Review staged changes:
```bash
git add .
aair review
```

2. Review specific files:
```bash
# Review a single file
aair files src/main.ts

# Review multiple files
aair files src/*.ts test/*.ts
```

3. Review branch changes:
```bash
# Review feature branch against main
aair branch feature/new-feature

# Compare feature branch against develop
aair branch feature/new-feature develop

# Review changes in a PR branch
aair branch pr-123 main
```

4. Update settings:
```bash
# Set API key
aair settings --key your-api-key
aair settings --model gpt-4-turbo-preview --prompt "Focus on security issues"
```
