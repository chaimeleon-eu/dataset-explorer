const fs = require('fs');
var pjson = require('./package.json');
const MODE_DEV = 'dev';
const MODE_PROD = 'prod';

if (process.argv.length != 3) {
  console.error("This script requires an argument, either dev (for development execution) or prod (for production release)");
  process.exit(1);
}

const modeS = process.argv[2];
let mode = null;

if (modeS.toUpperCase() === 'DEV') {
  mode = MODE_DEV;
  console.log("Configuring app for mode: " + mode);
  copyConfig(process.cwd() + '/config-dev.json');
} else if (modeS.toUpperCase() === 'PROD') {
  mode = MODE_PROD;
  console.log("Configuring app for mode: " + mode);
  const path = copyConfig('config-prod.json');
  let rawdata = fs.readFileSync(path);
  let conf = JSON.parse(rawdata);
  conf.version = pjson.version;
  fs.writeFileSync(path, JSON.stringify(conf));

} else {
  console.error("Mode " + modeS + " not supported. Use either dev (for development execution) or prod (for production release)")
}

function copyConfig(source) {
  const path = process.cwd() + '/src/config.json';
  fs.copyFileSync(source, path);
  return path;
}
// process.argv.forEach(function (val, index, array) {
//   console.log(index + ': ' + val);
// });
