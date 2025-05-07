const dev = process.env.NODE_ENV !== 'production';
const url = dev ? process.env.CLIENT_URL : process.env.CLIENT_URL_PROD;
module.exports = url;
