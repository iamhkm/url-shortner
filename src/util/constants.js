export const BASIC_USER_ALLOWED_URLS = (process.env.BASIC_USER_ALLOWED_URLS) ? Number(process.env.BASIC_USER_ALLOWED_URLS) : 100;
export const USER_ROLE_BASIC = "BASIC";
export const USER_ROLE_PRIME = "PRIME";
export const BASIC_USER_PROJECTION = "unique_id,email,added_date,total_url,total_active";
export const BASIC_URL_PROJECTION = "unique_id,user_id,original_url,added_date,last_modified,url_status,total_hit,short_url";
export const MATRIX_TYPE_USER = "USER"