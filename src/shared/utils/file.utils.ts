import {ReadStream} from "node:fs";

export function validateFileFormat(fileName: string,
                                   allowedFileFormat: string[]) {
    const fileParts = fileName.split('.');
    const extension = fileParts[fileParts.length - 1];

    return allowedFileFormat.includes(extension);
}

export async function validateFileSize(fileStream: ReadStream, allowedFileSizeInBytes: number) {
    return new Promise((resolve, reject) => {
        let fileSizeInBytes = 0;
        fileStream.on('data', (data: Buffer) => {
            fileSizeInBytes += data.byteLength
        }).on('end', () => {
            resolve(fileSizeInBytes <= allowedFileSizeInBytes)
        }).on('error', (err) => {reject(err)})
    })
}