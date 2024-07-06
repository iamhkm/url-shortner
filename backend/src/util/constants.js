export const BASIC_USER_ALLOWED_URLS = (process.env.BASIC_USER_ALLOWED_URLS) ? Number(process.env.BASIC_USER_ALLOWED_URLS) : 100;
export const USER_ROLE_BASIC = "BASIC";
export const USER_ROLE_PRIME = "PRIME";
export const BASIC_USER_PROJECTION = "unique_id,email,added_date,total_url,total_active,profile_url";
export const BASIC_URL_PROJECTION = "unique_id,user_id,original_url,added_date,last_modified,url_status,total_hit,short_url,identification_name,description,tag";
export const EXPORT_URL_PROJECTION = "unique_id,identification_name,original_url,short_url,url_status,total_hit";
export const MATRIX_TYPE_USER = "USER"
export const SEND_STATS_VIA_EMAIL = (process.env.SEND_STATS_VIA_EMAIL) ? true : false;
export const ADD_URL_STATS_KEY = "add_stats";
export const DELETE_URL_STATS_KEY = "delete_stats";
export const HIT_URL_STATS_KEY = "hit_stats";
export const MONTH_MAP = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec"
}
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "";
export const USER_POOL_ID = process.env.USER_POOL_ID || "ap-south-1_J8wZNvMu6";
export const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID || "12epdok3c73n3pr229kc8bqv0i";
export const AUTH_SCOPES = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
];
export const maxWrongPasswordAttempts = 5;
export const COGNITO_CUSTOM_AUTH_CHALLENGE = "12345";