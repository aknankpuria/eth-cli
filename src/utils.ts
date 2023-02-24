import fs from "fs";
import path from "path";

export const readContent = async (file: string): Promise<string> => {
    return await fs.promises.readFile(file, "utf-8");
};

export const writeContent = async (
    file: string,
    content: string
): Promise<void> => {
    await fs.promises.writeFile(file, content, "utf-8");
};

export const createOrClearDirectory = async (
    dirName: string
): Promise<void> => {
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
    } else {
        const files = await fs.promises.readdir(dirName);

        for (const file of files) {
            fs.unlink(path.join(dirName, file), (err) => {
                if (err) throw err;
            });
        }
    }
};

export const isDependencyPresent = (src: string): boolean => {
    if (src.match("import")) return true;

    return false;
};
