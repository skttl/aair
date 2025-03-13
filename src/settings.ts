import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { Settings, DEFAULT_SETTINGS } from './types.js';

export class SettingsManager {
    private settingsPath: string;

    constructor() {
        this.settingsPath = path.join(os.homedir(), '.aair-settings.json');
    }

    async loadSettings(): Promise<Settings> {
        try {
            if (await fs.access(this.settingsPath).then(() => true).catch(() => false)) {
                const settings = JSON.parse(await fs.readFile(this.settingsPath, 'utf8'));
                return { ...DEFAULT_SETTINGS, ...settings };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
        return { ...DEFAULT_SETTINGS };
    }

    async saveSettings(settings: Settings): Promise<void> {
        try {
            await fs.writeFile(this.settingsPath, JSON.stringify(settings, null, 2));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    async updateSettings(updates: Partial<Settings>): Promise<Settings> {
        const current = await this.loadSettings();
        const updated = { ...current, ...updates };
        await this.saveSettings(updated);
        return updated;
    }
}
