const RestProxy = require('sp-rest-proxy');

const settings = {
    configPath: './config/private.json', // Location for SharePoint instance mapping and credentials
    port: 6969,                          // Local server port
    //staticRoot: './dist/ReporteCCEC'               // Root folder for static content
    //staticRoot: './src'
};

const restProxy = new RestProxy(settings);
restProxy.serve();


