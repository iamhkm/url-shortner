import { queryRecord, scanRecord } from "../util/dynamoUtil.js";
import {
    ADD_URL_STATS_KEY,
    DELETE_URL_STATS_KEY,
    HIT_URL_STATS_KEY
} from "../util/constants.js"

process.env.SHORTNER_URLS_USERS_TABLE = "shorten-urls-users";
process.env.SHORTNER_URLS_TABLE = "shorten-urls";

export async function stats () {
    const stats = {};
    let dateToday = new Date();
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
    }
    console.log("stats ", JSON.stringify(stats));
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
                date: i,
                add: user?.[ADD_URL_STATS_KEY]?.[year]?.[yearString]?.total  ?? 0,
                delete: user?.[DELETE_URL_STATS_KEY]?.[year]?.[yearString]?.total  ?? 0
            });
        }
        stats[id].urls.yearly.stats.push({
            date: "total",
            add: user?.[ADD_URL_STATS_KEY]?.[year]?.[month]?.total ?? 0,
            delete: user?.[DELETE_URL_STATS_KEY]?.[year]?.[month]?.total ?? 0
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
            for (let i=0; i<=12; i++){
                yearlyStatsMap[i] = url?.[HIT_URL_STATS_KEY]?.[year]?.[i.toString().padStart(2,0)]?.total ?? 0
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

await stats()