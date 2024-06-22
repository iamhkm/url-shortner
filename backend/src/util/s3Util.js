import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function uploadLocalFileToS3 (localFilepath, s3Key, contentType){
    const s3Client = new S3Client();
    const fileContent = fs.readFileSync(localFilepath);
    const params = {
        Bucket: process.env.STATS_BUCKET,
        Key: s3Key,
        Body: fileContent,
        ContentType: contentType
    };
    try {
        const command = new PutObjectCommand(params);
        const data = await s3Client.send(command);
        console.log("File uploaded successfully");
    } catch (err) {
        console.error(`Error uploading file: ${err.message}`);
    }
}