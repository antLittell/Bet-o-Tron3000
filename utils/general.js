function getStandardDeviation() {
    const fs = require('fs');
    const fileData = fs.readFileSync('./data/data.json', 'utf-8');
    const jsonData = JSON.parse(fileData);
    const stdValue = jsonData.std;
    return stdValue;
}

function getMean() {
    const fs = require('fs');
    const fileData = fs.readFileSync('./data/data.json', 'utf-8');
    const jsonData = JSON.parse(fileData);
    const meanValue = jsonData.mean;
    return meanValue;
}

function calcWinAmount(betAmount, timeInterval) {
    const { convertTimeToMinutes } = require('./conversion.js');
    const jstat = require('jstat');

    const mean = parseInt(getMean());
    const std = parseInt(getStandardDeviation());

    const intervalTimes = timeInterval.split('-');

    const start = convertTimeToMinutes(intervalTimes[0]);
    const end = convertTimeToMinutes(intervalTimes[1]);

    const z_start = (start - mean) / std;
    const z_end = (end - mean) / std;

    const prob = jstat.normal.cdf(end, mean, std) - jstat.normal.cdf(start, mean, std);
    const mult = (1 - prob) / prob;
    const payoff = parseInt(betAmount * mult);

    return payoff;

}

module.exports = {
    calcWinAmount: calcWinAmount
}