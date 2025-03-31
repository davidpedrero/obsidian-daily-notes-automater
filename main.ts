import { App, Notice, Plugin, PluginSettingTab, Setting, TFile } from "obsidian";
import { getDateProps, validateNewFilePath } from "utils";

interface DailyNotesAutomaterSettings {
	dateFormat: string;
	templateFilePath: string;
	newFilePath: string;
	isYearEnabled: boolean;
	isMonthEnabled: boolean;
	fileNameSuffix: string;
}

const DEFAULT_SETTINGS: DailyNotesAutomaterSettings = {
	dateFormat: "MM-DD-YYYY",
	templateFilePath: "",
	newFilePath: "",
	isYearEnabled: true,
	isMonthEnabled: true,
	fileNameSuffix: ""
};

const PRINT_LOGS = false;

export default class DailyNotesAutomaterPlugin extends Plugin {
	settings: DailyNotesAutomaterSettings;

	async onload() {
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new DailyNotesAutomaterSettingsTab(this.app, this));

		await this.loadSettings();

		const { dateFormat, isYearEnabled, isMonthEnabled, fileNameSuffix } = this.settings;
		let { templateFilePath, newFilePath } = this.settings;

		const { year, month, monthIndex, date } = getDateProps(dateFormat, PRINT_LOGS);

		if (templateFilePath === "") {
			if (PRINT_LOGS) console.log("No template file provided");
			return;
		}

		templateFilePath = `${templateFilePath}.md`;

		newFilePath = `${newFilePath ? `${newFilePath}/` : ""}${
			isYearEnabled ? `${year}/` : ""
		}${
			isMonthEnabled ? `${monthIndex}. ${month}/` : ""
		}${date} ${fileNameSuffix}.md`;

		if (PRINT_LOGS) {
			console.log(`templateFilePath:\n${templateFilePath}`);
			console.log(`newFilePath:\n${newFilePath}`);
		}

		this.app.workspace.onLayoutReady(async () => {
			await this.createDailyNote(newFilePath, templateFilePath);
		});
	}

	onunload() {
		if (PRINT_LOGS) console.log('Unloading plugin');

		new Notice("Daily Notes Automator plugin unloaded");

		this.app.workspace.off(('layout-change'), this.createDailyNote);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// This creates daily note for today (if it does not already exist)
	async createDailyNote(newFilePath: string, templateFilePath: string) {
		if (PRINT_LOGS) console.log("Running createDailyNote()");

		const { vault } = this.app;

		// If Daily Note already exists, terminate plug-in
		if (vault.getAbstractFileByPath(newFilePath)) {
			if (PRINT_LOGS) console.log("Daily Note already exists!");
			return;
		}

		// Validates template file path
		const templateFile = vault.getAbstractFileByPath(templateFilePath);

		// If template file path does not exist or point to a file, terminate plug-in
		if (!templateFile || !(templateFile instanceof TFile)) {
			if (PRINT_LOGS) console.log(`Template file not found at:\n${templateFile}`);
			return;
		}

		// Get template file contents
		const templateContent = await vault.read(templateFile);

		// Validates that all folders in fild path exist
		// If they do not, we create them before proceeding
		validateNewFilePath(newFilePath, vault, PRINT_LOGS);

		vault.create(newFilePath, templateContent);

		new Notice("Daily note created!");

		if (PRINT_LOGS) console.log(`Daily note created at:\n${newFilePath}`);
	}
}

class DailyNotesAutomaterSettingsTab extends PluginSettingTab {
	plugin: DailyNotesAutomaterPlugin;

	constructor(app: App, plugin: DailyNotesAutomaterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Date Format")
			.setDesc("Output format for parsed dates")
			.addMomentFormat((format) => {
				format
					.setDefaultFormat("MM-DD-YYYY")
					.setValue(this.plugin.settings.dateFormat)
					.onChange(async (value) => {
						this.plugin.settings.dateFormat = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Template File Location")
			.setDesc("Choose the file to use as template")
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.templateFilePath)
					.onChange(async (value) => {
						this.plugin.settings.templateFilePath = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("New File Location")
			.setDesc("Choose root folder to store new daily notes")
			.addText((text) => {
				text.setPlaceholder("")
					.setValue(this.plugin.settings.newFilePath)
					.onChange(async (value) => {
						this.plugin.settings.newFilePath = value;
						await this.plugin.saveSettings();
					});
			});
			
			new Setting(containerEl)
			.setName("Enable Year Subdirectory")
			.setDesc("Add Year to new file location path")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.isYearEnabled)
					.onChange(async (bool) => {
						this.plugin.settings.isYearEnabled = bool;
						await this.plugin.saveSettings();
					});
				});
				
				new Setting(containerEl)
				.setName("Enable Month Subdirectory")
				.setDesc("Add month to new file location path")
				.addToggle((toggle) => {
					toggle
					.setValue(this.plugin.settings.isMonthEnabled)
					.onChange(async (bool) => {
						this.plugin.settings.isMonthEnabled = bool;
						await this.plugin.saveSettings();
					});
				});

				new Setting(containerEl)
					.setName("File Name Suffix")
					.setDesc("Add a suffix to daily notes file name")
					.addText((text) => {
						text.setPlaceholder("")
							.setValue(this.plugin.settings.fileNameSuffix)
							.onChange(async (value) => {
								this.plugin.settings.fileNameSuffix = value;
								await this.plugin.saveSettings();
							});
					});
			}
		}
