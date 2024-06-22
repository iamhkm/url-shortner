import { queryRecord, scanRecord } from "../util/dynamoUtil.js";
import {
    ADD_URL_STATS_KEY,
    DELETE_URL_STATS_KEY,
    HIT_URL_STATS_KEY,
    MONTH_MAP
} from "../util/constants.js"
import XLSX from "xlsx"
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { uploadLocalFileToS3 } from "../util/s3Util.js"
import { sendStatsViaMail } from "../util/sesUtil.js";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function stats () {
    const stats = {};
    let dateToday = new Date("2025-01-01");
    let monthlyStats = false;
    let yearlyStats = false;
    if (dateToday.getDate() == 1) {
        monthlyStats = true;
        if (dateToday.getMonth() == 0) yearlyStats = true;
    }
    dateToday.setDate(dateToday.getDate() - 1);
    const year = dateToday.getFullYear().toString();
    const month = (dateToday.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, so add 1
    const date = dateToday.getDate().toString().padStart(2, '0');
    const users = await scanRecord({
        TableName: process.env.SHORTNER_URLS_USERS_TABLE
    })
    for (let user of users){
        createUrlStats(stats, user, year, month, date, monthlyStats, yearlyStats);
        await createHitStats (stats, user.unique_id, year, month, date, monthlyStats, yearlyStats);
        //create xlsx and save to s3
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet([stats[user.unique_id].urls.daily]);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'url_stats');
        const worksheet2 = XLSX.utils.json_to_sheet(stats[user.unique_id].hits.daily);
        XLSX.utils.book_append_sheet(workbook, worksheet2, 'hit_stats');
        const filePath = path.join(__dirname, `${user.unique_id}.${year}.${month}.${date}.xlsx`);
        XLSX.writeFile(workbook, filePath);
        console.log("file stored locally at Path ", filePath);
        await uploadLocalFileToS3(
            filePath,
            `${user.unique_id}/${year}/${month}/${date}.xlsx`,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        if (user.stats_enabled === true) {
            await sendStats(
                filePath,
                `${year}-${month}-${date}.xlsx`,
                user.email, 
                "Daily",
                process.env.AWS_SES_IDENTITY,
                `Url Shortner - Daily Stats Generated For ${date} ${MONTH_MAP[dateToday.getMonth() + 1]} ${year}`,
            )
        }
        fs.unlinkSync(filePath);
        if (monthlyStats){
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(stats[user.unique_id].urls.monthly.stats);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'url_stats');
            const worksheet2 = XLSX.utils.json_to_sheet(stats[user.unique_id].hits.monthly);
            XLSX.utils.book_append_sheet(workbook, worksheet2, 'hit_stats');
            const filePath = path.join(__dirname, `${user.unique_id}.${year}.${month}.xlsx`);
            XLSX.writeFile(workbook, filePath);
            await uploadLocalFileToS3(
                filePath,
                `${user.unique_id}/${year}/${month}/stats.xlsx`,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            if (user.stats_enabled === true) {
                await sendStats(
                    filePath,
                    `${year}-${month}.xlsx`,
                    user.email,
                    "Monthly",
                    process.env.AWS_SES_IDENTITY,
                    `Url Shortner - Monthly Stats Generated For ${MONTH_MAP[MONTH_MAP[dateToday.getMonth() + 1]]} ${year}`,
                )
            }
            fs.unlinkSync(filePath);
        }
        if (monthlyStats){
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(stats[user.unique_id].urls.yearly.stats);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'url_stats');
            const worksheet2 = XLSX.utils.json_to_sheet(stats[user.unique_id].hits.yearly);
            XLSX.utils.book_append_sheet(workbook, worksheet2, 'hit_stats');
            const filePath = path.join(__dirname, `${user.unique_id}.${year}.xlsx`);
            XLSX.writeFile(workbook, filePath);
            await uploadLocalFileToS3(
                filePath,
                `${user.unique_id}/${year}/stats.xlsx`,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            if (user.stats_enabled === true) {
                await sendStats(
                    filePath,
                    `${year}.xlsx`,
                    user.email, 
                    "Yearly",
                    process.env.AWS_SES_IDENTITY,
                    `Url Shortner - Yearly Stats Generated For ${year}`,
                )
            }
            fs.unlinkSync(filePath);
        }
    }
}

function createUrlStats (stats, user, year, month, date, monthlyStats, yearlyStats){
    const addStats = user[ADD_URL_STATS_KEY];
    const deleteStats = user[DELETE_URL_STATS_KEY];
    const id = user.unique_id;
    stats[id] = {
        urls: {
            daily: {
                add: addStats?.[year]?.[month]?.[date] ?? 0,
                delete: deleteStats?.[year]?.[month]?.[date] ?? 0
            }
        },
    }
    if (monthlyStats === true){
        stats[id].urls.monthly = {
            stats: []
        };
        for (let i=1; i<=31; i++){
            const monthString = i.toString().padStart(2, '0');
            stats[id].urls.monthly.stats.push({
                date: i,
                add: user?.[ADD_URL_STATS_KEY]?.[year]?.[month]?.[monthString]  ?? 0,
                delete: user?.[DELETE_URL_STATS_KEY]?.[year]?.[month]?.[monthString]  ?? 0
            });
        }
        stats[id].urls.monthly.stats.push({
            date: "total",
            add: user?.[ADD_URL_STATS_KEY]?.[year]?.[month]?.total ?? 0,
            delete: user?.[DELETE_URL_STATS_KEY]?.[year]?.[month]?.total ?? 0
        });
    }

    if (yearlyStats === true){
        stats[id].urls.yearly = {
            stats: []
        };
        for (let i=1; i<=12; i++){
            const yearString = i.toString().padStart(2, '0');
            stats[id].urls.yearly.stats.push ({
                month: MONTH_MAP[i],
                add: user?.[ADD_URL_STATS_KEY]?.[year]?.[yearString]?.total  ?? 0,
                delete: user?.[DELETE_URL_STATS_KEY]?.[year]?.[yearString]?.total  ?? 0
            });
        }
        stats[id].urls.yearly.stats.push({
            month: "total",
            add: user?.[ADD_URL_STATS_KEY]?.[year]?.total ?? 0,
            delete: user?.[DELETE_URL_STATS_KEY]?.[year]?.total ?? 0
        });
    }
}

async function createHitStats (stats, user_id, year, month, date, monthlyStats, yearlyStats) {
    const params = {
        TableName: process.env.SHORTNER_URLS_TABLE, // Replace with your table name
        KeyConditionExpression: "user_id = :value", // Replace with your partition key
        ExpressionAttributeValues: {
          ":value": user_id // Replace with your key value
        },
      };
    const urls = await queryRecord(params);
    stats[user_id].hits = {}
    for (let url of urls){
        if (!stats[user_id].hits.daily) stats[user_id].hits.daily = []
        stats[user_id].hits.daily.push({
            id: url.unique_id,
            name: url.identification_name,
            url: url.short_url,
            status: url.url_status === 1 ? "active" : "inactive",
            hits: url?.[HIT_URL_STATS_KEY]?.[year]?.[month]?.[date] ?? 0
        })
        if (monthlyStats) {
            if (!stats[user_id].hits.monthly) stats[user_id].hits.monthly = []
            const monthlyStatsMap = {};
            for (let i=0; i<=31; i++){
                monthlyStatsMap[i] = url?.[HIT_URL_STATS_KEY]?.[year]?.[month]?.[i.toString().padStart(2,0)] ?? 0
            }
            stats[user_id].hits.monthly.push({
            id: url.unique_id,
            name: url.identification_name,
            url: url.short_url,
            status: url.url_status === 1 ? "active" : "inactive",
            ...monthlyStatsMap,
            total: url?.[HIT_URL_STATS_KEY]?.[year]?.[month]?.total ?? 0
            })
        }
        if (yearlyStats) {
            if (!stats[user_id].hits.yearly) stats[user_id].hits.yearly = []
            const yearlyStatsMap = {};
            for (let i=1; i<=12; i++){
                yearlyStatsMap[MONTH_MAP[i]] = url?.[HIT_URL_STATS_KEY]?.[year]?.[i.toString().padStart(2,0)]?.total ?? 0
            }
            stats[user_id].hits.yearly.push({
            id: url.unique_id,
            name: url.identification_name,
            url: url.short_url,
            status: url.url_status === 1 ? "active" : "inactive",
            ...yearlyStatsMap,
            total: url?.[HIT_URL_STATS_KEY]?.[year]?.total ?? 0
            })
        }
    }
}

async function sendStats(filePath, fileName, email, statType, from, subject) {
    await sendStatsViaMail(
        filePath,
        fileName,
        [email],
        subject,
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Daily Stats</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    margin: 0 auto;
                    padding: 20px;
                    max-width: 600px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .header h1 {
                    margin: 0;
                    color: #0073e6;
                }
                .content {
                    margin-bottom: 20px;
                }
                .content p {
                    margin: 0;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                }
                .footer p {
                    margin: 0;
                    font-size: 0.9em;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${statType} Statistics Report</h1>
                </div>
                <div class="content">
                    <p>Dear Team,</p>
                    <p>${statType} stats have been generated. Please find the attachment for detailed information.</p>
                </div>
                <div class="footer">
                    <p>Thank you!</p>
                    <p>Regards,</p>
                    <p>Team Url-Shortner</p>
                </div>
            </div>
        </body>
        </html>
        `,
        from
    );
}

await stats()