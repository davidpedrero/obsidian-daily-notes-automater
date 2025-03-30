import { App, Plugin, PluginSettingTab, Setting, TFile } from "obsidian";
import { getDateProps, validateNewFilePath } from "utils";

interface MyPluginSettings {
	dateFormat: string;
	templateFilePath: string;
	newFilePath: string;
	isYearEnabled: boolean;
	isMonthEnabled: boolean;
	fileNameSuffix: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	dateFormat: "MM-DD-YYYY",
	templateFilePath: "",
	newFilePath: "",
	isYearEnabled: true,
	isMonthEnabled: true,
	fileNameSuffix: ""
};

const PRINT_LOGS: boolean = true;

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		let {
			dateFormat,
			templateFilePath,
			newFilePath,
			isYearEnabled,
			isMonthEnabled,
			fileNameSuffix
		} = this.settings;

		const { year, month, monthIndex, date } = getDateProps(dateFormat, PRINT_LOGS);

		if (templateFilePath === "") {
			console.log("Please provide a template file location");
			return;
		}

		templateFilePath = `${templateFilePath}.md`;

		newFilePath = `${newFilePath ? `${newFilePath}/` : ""}${
			isYearEnabled ? `${year}/` : ""
		}${
			isMonthEnabled ? `${monthIndex}. ${month}/` : ""
		}${date} ${fileNameSuffix}.md`;

		console.log(`templateFilePath:\n${templateFilePath}`);
		console.log(`newFilePath:\n${newFilePath}`);

		this.app.workspace.onLayoutReady(async () => {
			await this.createDailyNote(newFilePath, templateFilePath);
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MyPluginSettingsTab(this.app, this));
	}

	onunload() {
		console.log("Running onunload method...");
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
		console.log("Running createDailyNote function...");

		const { vault } = this.app;

		// If Daily Note already exists, terminate plug-in
		if (vault.getAbstractFileByPath(newFilePath)) {
			console.log("Daily Note already exists!");
			return;
		}

		// Validates template file path
		const templateFile = vault.getAbstractFileByPath(templateFilePath);

		// If template file path does not exist or point to a file, terminate plug-in
		if (!templateFile || !(templateFile instanceof TFile)) {
			console.log(`Template file not found at:\n${templateFile}`);
			return;
		}

		// Get template file contents
		const templateContent = await vault.read(templateFile);

		// Validates that all folders in fild path exist
		// If they do not, we create them before proceeding
		validateNewFilePath(newFilePath, vault);

		vault.create(newFilePath, templateContent);

		console.log(`New daily note created at:\n${newFilePath}`);
	}
}

class MyPluginSettingsTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
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
