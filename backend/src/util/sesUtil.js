import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import fs from 'fs';
import mime from "mime-types";

export async function sendStatsViaMail (filePath, fileName, toAddress, subject, bodyHtml, fromAddress) {
    try {
        const client = new SESv2Client();
        const fileData = fs.readFileSync(filePath);
        const fileBase64 = fileData.toString("base64");
        const fileMimeType = mime.lookup(filePath) || "application/octet-stream";
        const params = {
            Destination: {
                ToAddresses: toAddress,
            },
            Content: {
                Raw: {
                    Data: buildRawEmail({
                        subject,
                        bodyHtml,
                        fromAddress,
                        toAddress,
                        attachments: [
                            {
                                filename: fileName,
                                content: fileBase64,
                                contentType: fileMimeType,
                            },
                        ],
                    }),
                },
            },
            FromEmailAddress: fromAddress
        };
        const command = new SendEmailCommand(params);
        const response = await client.send(command);
        console.log("Email sent successfully:", response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

const buildRawEmail = ({ subject, bodyHtml, fromAddress, toAddress, attachments }) => {
    const boundary = "NextPartBoundary";
    let rawMessage = `From: ${fromAddress}\n`;
    rawMessage += `To: ${toAddress}\n`;
    rawMessage += `Subject: ${subject}\n`;
    rawMessage += "MIME-Version: 1.0\n";
    rawMessage += `Content-Type: multipart/mixed; boundary="${boundary}"\n\n`;

    rawMessage += `--${boundary}\n`;
    rawMessage += 'Content-Type: text/html; charset="UTF-8"\n';
    rawMessage += "Content-Transfer-Encoding: 7bit\n\n";
    rawMessage += `${bodyHtml}\n\n`;

    attachments.forEach((attachment) => {
        rawMessage += `--${boundary}\n`;
        rawMessage += `Content-Type: ${attachment.contentType}; name="${attachment.filename}"\n`;
        rawMessage += "Content-Transfer-Encoding: base64\n";
        rawMessage += `Content-Disposition: attachment; filename="${attachment.filename}"\n\n`;
        rawMessage += `${attachment.content}\n\n`;
    });

    rawMessage += `--${boundary}--`;

    return rawMessage;
};
