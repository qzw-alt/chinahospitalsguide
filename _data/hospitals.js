const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'api', 'v1', 'hospitals.json');
module.exports = JSON.parse(fs.readFileSync(file, 'utf8')).hospitals;
