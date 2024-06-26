import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function uploadBufferToS3 (buffer, s3Key, contentType){
    const s3Client = new S3Client();
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

export async function getObjectUrl (s3Key){
    const s3Client = new S3Client();
    const params = {
        Bucket: process.env.STATS_BUCKET,
        Key: s3Key
    };
    try {
        const command = new GetObjectCommand(params);
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return signedUrl;
    } catch (err) {
        throw new Error(err.message);
    }
}