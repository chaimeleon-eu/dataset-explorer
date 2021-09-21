const MODE_DEV = 1;
const MODE_PROD = 2;

if (process.argv.length != 3) {
  console.error("This script requires an argument, either dev (for development execution) or prod (for production release)");
  process.exit(1);
}

const modeS = process.argv[2];
let mode = null;

if (modeS.toUpperCase() === 'DEV') {
  mode = MODE_DEV;
} else if (modeS.toUpperCase() === 'PROD') {
  mode = MODE_PROD;
} else {
  console.error("Mode " + modeS + " not supported. Use either dev (for development execution) or prod (for production release)")
}

console.log("Configuring app for mode: " + mode);

// process.argv.forEach(function (val, index, array) {
//   console.log(index + ': ' + val);
// });
