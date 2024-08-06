import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface RatingSettings {
    textPrefix: string;
    ratingDivider: string;
    filledStroke: string;
    emptyStroke: string;
}

const DEFAULT_SETTINGS: RatingSettings = {
    textPrefix: '$-',
    ratingDivider: '/',
    filledStroke: '★',
    emptyStroke: '☆'
}

export default class Rating extends Plugin {
    settings: RatingSettings;

    async onload() {
        await this.loadSettings();


        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new RatingSettingTab(this.app, this));


        // ##### NEW STUF BELOW #####

        this.registerMarkdownPostProcessor((element, context) => {
            const codeblocks = element.findAll("code");

            for (let codeblock of codeblocks) {
                const text = codeblock.innerText.trim();
                if (text.startsWith(this.settings.textPrefix)) {
                    const dividerIndex = text.indexOf(this.settings.ratingDivider);

                    let filledCount = Number.parseInt(text.slice(this.settings.textPrefix.length, dividerIndex));
                    const fullCount = Number.parseInt(text.slice(dividerIndex + this.settings.ratingDivider.length));

                    let emptyCount = fullCount - filledCount;
                    let ratingText = "";

                    while (filledCount > 0) {
                        ratingText += this.settings.filledStroke;
                        filledCount--;
                    }
                    while (emptyCount > 0) {
                        ratingText += this.settings.emptyStroke;
                        emptyCount--;
                    }

                    codeblock.replaceWith(ratingText);
                }
            }
        });
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class RatingSettingTab extends PluginSettingTab {
    plugin: Rating;

    constructor(app: App, plugin: Rating) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Text Prefix')
            .setDesc('Enter the text that comes before the rating in the code block. This is used to tell the plugin that the encompassing codeblock is a rating.')
            .addText(text => text
                .setPlaceholder('$-')
                .setValue(this.plugin.settings.textPrefix)
                .onChange(async (value) => {
                    this.plugin.settings.textPrefix = value;
                    await this.plugin.saveSettings();

                    ratingPreview.empty();
                    ratingPreview.createEl('code', { text: '`' + this.plugin.settings.textPrefix + '3' + this.plugin.settings.ratingDivider + '5' + '`' });
                    ratingPreview.createEl('span', { text: " will appear as " + this.plugin.settings.filledStroke.repeat(3) + this.plugin.settings.emptyStroke.repeat(2) + " in reading mode" });
                }));

        new Setting(containerEl)
            .setName('Rating Divider')
            .setDesc('Here you can customize the text that divides the rating number from the total number.')
            .addText(text => text
                .setPlaceholder('/')
                .setValue(this.plugin.settings.ratingDivider)
                .onChange(async (value) => {
                    this.plugin.settings.ratingDivider = value;
                    await this.plugin.saveSettings();

                    ratingPreview.empty();
                    ratingPreview.createEl('code', { text: '`' + this.plugin.settings.textPrefix + '3' + this.plugin.settings.ratingDivider + '5' + '`' });
                    ratingPreview.createEl('span', { text: " will appear as " + this.plugin.settings.filledStroke.repeat(3) + this.plugin.settings.emptyStroke.repeat(2) + " in reading mode" });
                }));

        new Setting(containerEl)
            .setName('Filled Rating Item')
            .setDesc('Enter the unicode character you\'d like to represent a filled rating item.')
            .addText(text => text
                .setPlaceholder('★')
                .setValue(this.plugin.settings.filledStroke)
                .onChange(async (value) => {
                    this.plugin.settings.filledStroke = value;
                    await this.plugin.saveSettings();

                    ratingPreview.empty();
                    ratingPreview.createEl('code', { text: '`' + this.plugin.settings.textPrefix + '3' + this.plugin.settings.ratingDivider + '5' + '`' });
                    ratingPreview.createEl('span', { text: " will appear as " + this.plugin.settings.filledStroke.repeat(3) + this.plugin.settings.emptyStroke.repeat(2) + " in reading mode" });
                }));

        new Setting(containerEl)
            .setName('Empty Rating Item')
            .setDesc('Enter the unicode character you\'d like to represent an empty rating item.')
            .addText(text => text
                .setPlaceholder('☆')
                .setValue(this.plugin.settings.emptyStroke)
                .onChange(async (value) => {
                    this.plugin.settings.emptyStroke = value;
                    await this.plugin.saveSettings();

                    ratingPreview.empty();
                    ratingPreview.createEl('code', { text: '`' + this.plugin.settings.textPrefix + '3' + this.plugin.settings.ratingDivider + '5' + '`' });
                    ratingPreview.createEl('span', { text: " will appear as " + this.plugin.settings.filledStroke.repeat(3) + this.plugin.settings.emptyStroke.repeat(2) + " in reading mode" });
                }));

        const ratingPreview = containerEl.createEl('p');

        ratingPreview.createEl('code', { text: '`' + this.plugin.settings.textPrefix + '3' + this.plugin.settings.ratingDivider + '5' + '`' });
        ratingPreview.createEl('span', { text: " will appear as " + this.plugin.settings.filledStroke.repeat(3) + this.plugin.settings.emptyStroke.repeat(2) + " in reading mode" });
    }
}
