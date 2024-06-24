import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function uploadBufferToS3 (buffer, s3Key, contentType){
    const s3Client = new S3Client();
    // const fileContent = buffer.toString('base64');
    const params = {
        Bucket: process.env.STATS_BUCKET,
        Key: s3Key,
        Body: buffer,
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