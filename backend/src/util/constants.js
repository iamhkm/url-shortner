export const BASIC_USER_ALLOWED_URLS = (process.env.BASIC_USER_ALLOWED_URLS) ? Number(process.env.BASIC_USER_ALLOWED_URLS) : 100;
export const USER_ROLE_BASIC = "BASIC";
export const USER_ROLE_PRIME = "PRIME";
export const BASIC_USER_PROJECTION = "unique_id,email,added_date,total_url,total_active";
export const BASIC_URL_PROJECTION = "unique_id,user_id,original_url,added_date,last_modified,url_status,total_hit,short_url,identification_name,description,tag";
export const MATRIX_TYPE_USER = "USER"
export const SEND_STATS_VIA_EMAIL = (process.env.SEND_STATS_VIA_EMAIL) ? true : false;
export const ADD_URL_STATS_KEY = "add_stats";
export const DELETE_URL_STATS_KEY = "delete_stats";
export const HIT_URL_STATS_KEY = "hit_stats";
