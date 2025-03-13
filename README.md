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

### Commit Message Generation

Generate AI-powered commit messages for your staged changes:

```bash
aair commit
```

The tool will:
1. Generate a commit message following best practices
2. Show you the suggested message
3. Allow you to edit it if needed (press Enter twice to finish editing)
4. Ask for confirmation before creating the commit

The generated commit messages follow best practices:
- Brief summary line (max 50 chars)
- Detailed bullet points of key changes
- Focus on WHAT and WHY, not HOW
- Use imperative mood ("Add feature" not "Added feature")

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

#### Customize Commit Message Prompt
```bash
aair settings --commit-prompt "Your custom commit message prompt"
```

You can combine multiple settings in a single command:
```bash
aair settings --model gpt-4-turbo-preview --prompt "Your custom prompt"
```

## Configuration

Default settings:
- Model: `gpt-4`
- Prompt: Basic code review prompt focusing on code quality
- Commit Prompt: Generates conventional commit messages with detailed descriptions
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

4. Generate commit messages:
```bash
# Stage your changes
git add .

# Generate commit message
aair commit

```

5. Update settings:
```bash
# Set API key
aair settings --key your-api-key

# Change model and prompts
aair settings --model gpt-4-turbo-preview --commit-prompt "Focus on conventional commits"

```
