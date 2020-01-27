import moment from 'moment-timezone';

export const dateFormat1 = (date,timeZone) => moment.tz(date, timeZone).format('hh:mm:ss');
export const dateFormat2 = (date, timeZone) => moment.tz(date, timeZone).format('hh:mm');
export const dateFormat3 = (date,timeZone) => moment.tz(date, timeZone).format('HH:mm:ss');