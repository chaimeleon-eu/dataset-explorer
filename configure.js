const fs = require('fs');
let pjson = require('./package.json');

if (process.argv.length !== 3) {
  console.error("This script requires an argument, either dev (for development execution), prod-test (for production test), or prod (for production release)");
  process.exit(1);
}

const modeS = process.argv[2];
console.log("Configuring app for mode: " + modeS);
const conf = `config-${modeS.toLowerCase()}.json`;
if (!fs.existsSync(conf)) {
  throw `Conf file  ${conf} not  found`;
}

const path = copyConfig(conf);
if (modeS.toUpperCase() === 'PROD' || modeS.toUpperCase() === 'PROD-TEST') {
  let rawdata = fs.readFileSync(path);
  let confD = JSON.parse(rawdata);
  confD.appVersion = pjson.version;
  console.log(confD);
  fs.writeFileSync(path, JSON.stringify(confD));

}

function copyConfig(source) {
  const path = process.cwd() + '/src/config.json';
  fs.copyFileSync(source, path);
  return path;
}
// process.argv.forEach(function (val, index, array) {
//   console.log(index + ': ' + val);
// });
