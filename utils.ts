import { moment, Vault } from "obsidian";

export function getDateProps(dateFormat: string, PRINT_LOGS: boolean): {
	year: string;
	month: string;
	monthIndex: string;
	date: string;
} {
	const now = new Date();

	const year = String(now.getFullYear());
	const month = now.toLocaleString("en-US", { month: "long" });
	const monthIndex = String(now.getMonth() + 1);
    const date = moment().format(dateFormat);

    if (PRINT_LOGS) {
        console.log(`year: ${year}`);
        console.log(`month: ${month}`);
        console.log(`monthIndex: ${monthIndex}`);
        console.log(`date: ${date}`);
    }

	return { year, month, monthIndex, date };
}

export function validateNewFilePath(newFilePath: string, vault: Vault, PRINT_LOGS: boolean): void {
        const folderPathSubstring = newFilePath.substring(0, newFilePath.lastIndexOf("/"));
        if (PRINT_LOGS) console.log(`folderPathSubstring:\n${folderPathSubstring}`);
        
        if (!(vault.getAbstractFileByPath(folderPathSubstring))) {
            const folders = folderPathSubstring.split("/");

            if (PRINT_LOGS) console.log(`# of folders: ${folders.length}`);
            
            let currentPath = `${folders[0]}`;

            for (const folder of folders) {
                if (folder !== currentPath) currentPath += `/${folder}`;
                if (!(vault.getAbstractFileByPath(currentPath))) vault.createFolder(currentPath);
            }
        }

        if (PRINT_LOGS) console.log("File path validation complete!");

}