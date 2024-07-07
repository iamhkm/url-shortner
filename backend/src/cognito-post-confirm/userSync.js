import { 
    createStats,
    generateRandomString 
} from "../util/common.js";
import { MATRIX_TYPE_USER } from "../util/constants.js";
import { getRecord, insertRecord } from "../util/dynamoUtil.js";

export async function userSync (event, context){
    if (event.triggerSource === "PostConfirmation_ConfirmForgotPassword") {
      console.log("PostConfirmation_ConfirmForgotPassword triggered!");
      return event;
    }
    const attributes = event.request.userAttributes;
    const record = {
        TableName: process.env.SHORTNER_URLS_USERS_TABLE,
        Item: {
          unique_id: generateRandomString(),
          email: attributes.email,
          added_date: new Date().getTime(),
          total_url: 0,
          total_active: 0,
          stats_enabled: false
        }
    };
    await insertRecord(record);
    let userStats = await getRecord({
      TableName: process.env.ADMIN_STATS_TABLE,
      Key: {
        matrix_type: MATRIX_TYPE_USER,
      }
    });
    if (!userStats) {
      userStats = {
        matrix_type: MATRIX_TYPE_USER
      }
    }
    createStats(userStats, "stats");
    await insertRecord({
      TableName: process.env.ADMIN_STATS_TABLE,
      Item: userStats
    });
    return event;
}