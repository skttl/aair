export interface Settings {
    openaiApiKey?: string;
    model: string;
    prompt: string;
    commitPrompt: string;
}

export const DEFAULT_SETTINGS: Settings = {
    model: 'gpt-4',
    prompt: `You are a code-review bot. You are receiving the output of a git diff. Please respond with feedback using markdown formatting.`,
    commitPrompt: `You are a commit message generator. Based on the git diff provided, generate a clear and concise commit message following these rules:
1. First line is a brief summary (max 50 chars)
2. Leave one blank line after the summary
3. Provide bullet points of key changes
4. Focus on WHAT and WHY, not HOW
5. Use imperative mood ("Add feature" not "Added feature")`
};
