export interface Settings {
    openaiApiKey?: string;
    model: string;
    prompt: string;
}

export const DEFAULT_SETTINGS: Settings = {
    model: 'gpt-4',
    prompt: `You are a code-review bot. You are receiving the output of a git diff. Please respond with feedback using markdown formatting.`
};
