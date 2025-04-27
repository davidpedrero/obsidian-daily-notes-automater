import { moment, Vault } from "obsidian";

export function getDateProps(dateFormat: string): {
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

	return { year, month, monthIndex, date };
}

export function validateNewFilePath(newFilePath: string, vault: Vault): void {
        const folderPathSubstring = newFilePath.substring(0, newFilePath.lastIndexOf("/"));
        
        if (!(vault.getAbstractFileByPath(folderPathSubstring))) {
            const folders = folderPathSubstring.split("/");
            
            let currentPath = `${folders[0]}`;

            for (const folder of folders) {
                if (folder !== currentPath) currentPath += `/${folder}`;
                if (!(vault.getAbstractFileByPath(currentPath))) vault.createFolder(currentPath);
            }
        }
}