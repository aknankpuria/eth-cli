import fs from "fs";

export const readContent = async (file: string): Promise<string> => {
    return await fs.promises.readFile(file, "utf-8");
};

export const writeContent = async (
    file: string,
    content: string
): Promise<void> => {
    await fs.promises.writeFile(file, content, "utf-8");
};
