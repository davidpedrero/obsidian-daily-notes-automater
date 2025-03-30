# Daily Notes Automater

This is an [Obsidian](https://obsidian.md) plugin that extends the configurability and automates the generation of Obsidian daily notes.

This project uses TypeScript to provide type checking and documentation.

## Features

### Automated cration of daily notes
-   Based on the template file provided
-   In a specified root directory
-   Upon opening the app
-   Unless a daily note was already created today

### Demonstrates some of the basic functionality the plugin API:
-   Adds a plugin setting tab to the settings page.
-   Uses the Moment API to generate a date string in the specified format

### Configuration
-   The name for the daily notes file
-   Enable Year and/or Month subdirectories in file root location
-   The template used to create daily note
-   The date format used for daily notes