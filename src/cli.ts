#!/usr/bin/env node
/**
 * Review pending changes using git-diff
 */
import { simpleGit } from 'simple-git';
import OpenAI from 'openai';
import cliMd from 'cli-markdown';
import { program } from 'commander';
import { SettingsManager } from './settings.js';
import { Settings } from './types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const settingsManager = new SettingsManager();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function getPackageVersion(): Promise<string> {
    try {
        const packageJson = JSON.parse(
            await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf-8')
        );
        return packageJson.version;
    } catch (error) {
        console.error('Warning: Could not read package version:', error);
        return '1.1.0'; // Fallback version
    }
}

async function getDiff(files?: string[], sourceBranch?: string, targetBranch?: string): Promise<string> {
    const git = simpleGit({
        baseDir: process.cwd(),
    });

    if (files && files.length > 0) {
        // For specific files, get their content
        const fileContents = await Promise.all(files.map(async (file) => {
            try {
                const content = await fs.readFile(file, 'utf-8');
                return `File: ${path.basename(file)}\n\n${content}\n`;
            } catch (error) {
                console.error(`Error reading file ${file}:`, error);
                return '';
            }
        }));
        return fileContents.join('\n---\n\n');
    } else if (sourceBranch && targetBranch) {
        // Compare branches
        return (await git.diff([targetBranch, sourceBranch])).trim();
    } else {
        // Default: staged changes
        return (await git.diff(['--staged'])).trim();
    }
}

async function reviewCode(diff: string) {
    const settings = await settingsManager.loadSettings();
    if (!settings.openaiApiKey && !process.env.OPENAI_API_KEY) {
        console.error('Error: OpenAI API key not found. Please set it using:\naair settings --key YOUR_API_KEY');
        process.exit(1);
    }

    if (!diff.length) {
        console.log('No changes to review');
        return;
    }

    console.log('Reviewing changes...\n');

    const openai = new OpenAI({
        apiKey: settings.openaiApiKey || process.env.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: settings.prompt,
            },
            {
                role: 'user',
                content: diff,
            },
        ],
        model: settings.model,
    });

    for (const choice of chatCompletion.choices) {
        if (choice.message.content) {
            console.log('--------------------------------------------------------------');
            console.log(cliMd(choice.message.content));
            console.log('--------------------------------------------------------------\n');
        }
    }
}

// Initialize CLI
async function initCLI() {
    const version = await getPackageVersion();
    
    program
        .name('aair')
        .description('AI-powered code review tool')
        .version(version);

    program
        .command('review')
        .description('Review staged changes (default)')
        .action(async () => {
            const diff = await getDiff();
            await reviewCode(diff);
        });

    program
        .command('files')
        .description('Review specific files')
        .argument('<files...>', 'Files to review')
        .action(async (files: string[]) => {
            const diff = await getDiff(files);
            await reviewCode(diff);
        });

    program
        .command('branch')
        .description('Review changes between branches')
        .argument('<source>', 'Source branch (with changes)')
        .argument('[target]', 'Target branch to compare against', 'main')
        .action(async (source: string, target: string) => {
            const diff = await getDiff(undefined, source, target);
            await reviewCode(diff);
        });

    program
        .command('settings')
        .description('Manage settings')
        .option('-k, --key <key>', 'Set OpenAI API key')
        .option('-m, --model <model>', 'Set OpenAI model')
        .option('-p, --prompt <prompt>', 'Set custom review prompt')
        .option('-s, --show', 'Show current settings')
        .action(async (options) => {
            if (options.show) {
                const settings = await settingsManager.loadSettings();
                const displaySettings = {
                    ...settings,
                    openaiApiKey: settings.openaiApiKey ? '********' : undefined
                };
                console.log('Current settings:');
                console.log(JSON.stringify(displaySettings, null, 2));
                return;
            }

            const updates: Partial<Settings> = {};
            if (options.key) updates.openaiApiKey = options.key;
            if (options.model) updates.model = options.model;
            if (options.prompt) updates.prompt = options.prompt;

            if (Object.keys(updates).length > 0) {
                const settings = await settingsManager.updateSettings(updates);
                console.log('Settings updated successfully!');
                const displaySettings = {
                    ...settings,
                    openaiApiKey: settings.openaiApiKey ? '********' : undefined
                };
                console.log(JSON.stringify(displaySettings, null, 2));
            }
        });

    program.parse();
}

// Start the CLI
initCLI().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});
