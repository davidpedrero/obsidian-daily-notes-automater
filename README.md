# Daily Notes Automater
The Daily Notes Automator is an [Obsidian](https://obsidian.md) plugin designed to streamline and automate the creation of daily notes within your vault. This plugin enhances configurability and offers flexible options for customizing daily note file names and locations.

Built with TypeScript, this plugin provides type checking and documentation to improve reliability and ease of development. It integrates the Moment API to generate dynamic date strings in your chosen format.

## Settings Configuration
-   **Date Format**:  Customize the date format used in the daily note file name (Default: `MM/DD/YYYY`)
-   **Template File Location**:  Specify the path to the template file for your daily notes (e.g., `Templates/Daily Notes Template`) .
-   **New File Location**:  Choose the root folder where your daily notes will be stored (e.g., `ROOT_DIR`).
-   **Enable Year Subdirectory**:  Option to place daily notes within a year-based subdirectory under the root (e.g., `ROOT_DIR/2025`).
-   **Enable Month Subdirectory**:  Option to organize daily notes into month-based subdirectories (e.g., `ROOT_DIR/2025/3. March`)
-   **File Name Suffix**:  Add a custom suffix to your daily note filenames (e.g., `FILE_NAME SUFFIX`)

## Automated Daily Note Creation
Upon launching (or reloading) Obsidian, the plugin will checks if a daily note has already been created for the current day. If not, it automatically generates a new note in the location specified in the plugin settings. The content of the new daily note is based on the template file provided by the user. If no template file is specified, the plugin will do nothing.

The daily note's file naming scheme is fully customizable, allowing for optional subdirectories based on the year and/or month beneath the chosen root directory.

## Example Usage
-   Both the **Enable Year Subdirectory** and **Enable Month Subdirectory** options are enabled.
-   The **New File Location** is set to a root folder called `Daily Notes`.
-   The **File Name Suffix** is set to `Daily Note`, 

The plugin will create a new daily note file named:
```
03/30/2025 Daily Note.md
```
The plugin will store the file in the following path:
```
Daily Notes/2025/3. March/03-30-2025 Daily Note.md
```

## Notes
- By default, the plugin generates the file name based on the current date in the format provided in **Date Format** (Default: `MM/DD/YYYY`).
- The plugin currently does not validate the **Date Format**, so ensure that a valid format is used for the best results.
- The month subdirectories are prefixed with the month index to ensure chronological sorting (e.g., 1. January, 2. February, etc.).