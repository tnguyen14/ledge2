/* global process */
export const TIMEZONE = 'America/New_York';
export const LISTS_URL = process.env.LISTS_URL;
export const LEDGE_URL = `${process.env.LISTS_URL}/ledge`;
export const USERMETA_URL = `${process.env.LISTS_URL}/meta/users`;
export const AUTH0_DOMAIN = 'tridnguyen.auth0.com';

export const DATE_FIELD_FORMAT = 'yyyy-MM-dd';
export const TIME_FIELD_FORMAT = 'HH:mm';

export const DISPLAY_DATE_FORMAT = 'MM/dd/yy';
export const DISPLAY_DATE_WITH_DAY_FORMAT = `${DISPLAY_DATE_FORMAT} (EEE)`;
export const DISPLAY_DATE_TIME_FORMAT = `${DISPLAY_DATE_FORMAT} hh:mm a z`;
