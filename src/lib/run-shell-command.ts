export const runShellCommand = async (command: string): Promise<any> => {
    const { exec } = require('child_process');

    return new Promise((resolve, reject) => {
        exec(command, (error, _, stderr) => {
            if (error) {
                reject(error);
            }
            if (stderr) {
                reject(stderr);
            }
            resolve();
        });
    });
}