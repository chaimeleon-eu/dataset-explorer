#! /usr/bin/env node

const { exec, execSync } = require('child_process');
const os = require('os');
const axios = require('axios');
const http = require('http');
const fs = require('fs');
const { createHttpTerminator } = require('http-terminator');

if (process.argv.length !== 4) {
    console.error("This script requires two arguments: first either dev (for development execution), prod-test (for production test), or prod (for production release), and second the token");
    process.exit(1);
}

const release = process.argv[2];
const token = process.argv[3];
const dsServer =  require(`./config-${release}.json`).datasetService;

const networkInterfaces = os.networkInterfaces();
//console.log(networkInterfaces);
// Connections that use a local address
const localAddr = new Set(["127", "192"]);
const interf = Object.values(networkInterfaces).flat().filter(e => e.internal === false 
    && e.family === 'IPv4' && !localAddr.has(e.address.substring(0, 3)));
if (interf.length !== 1) {
    console.log(interf);
    throw "too many or too few interfaces left after filtering";
}
const ip = interf[0].address;
console.log(`Uploading from IP ${ip}`);

// const pyServerProc = exec('python3 -m http.server 3005', (err, stdout, stderr) => {
//     if (err) {
//       //some err occurred
//       console.error(err)
//     } else {
//      // the *entire* stdout and stderr (buffered)
//      console.log(`python server stdout: ${stdout}`);
//      console.log(`python server stderr: ${stderr}`);
//     }
//   });
//pyServerProc.stdout.on('data', data =>  console.log(data));


const server = http.createServer(function (req, response) {
    fs.readFile(`${__dirname}/build/build.zip`, function(error, content) {
        response.writeHead(200, { 'Content-Type': "application/zip" });
        response.end(content, 'utf-8');
    });
}).listen(3005);

execSync(`cd ${__dirname} \
    && npm run build-${release} \
    && cd build/ \
    && zip -r ./build.zip ./*`
    , {stdio: 'inherit'});

var config = {
    method: 'post',
    url: `${dsServer}/set-ui`,
    headers: { 
        devToken: token
    },
    data : `http://${ip}:3005/build/build.zip`
    };
    
    axios(config)
    .then(function (response) {
    console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
    console.log(error);
    })
    .finally(() => {              
        console.log("Stopping py server");
        //pyServerProc.kill();
        const httpTerminator = createHttpTerminator({
            server,
        });
        
        httpTerminator.terminate();
    });


