//backend base url
export const baseURL = 'http://dev.dod.guzmanygomez.com:9003/api';


//Pubnub keys
const developmentPubnubKey = {
    publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
    subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY
};

const productionPubnubKey = {
    publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
    subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY
};

export const pubnubKey = process.env.NODE_ENV === "development" ? developmentPubnubKey : productionPubnubKey