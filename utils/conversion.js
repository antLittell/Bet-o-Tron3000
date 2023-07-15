function getAverageTime(timeArray) {
    let averageMinutes = 0;

    for (let i = 0; i < timeArray.length; i++) {
        averageMinutes += convertTimeToMinutes(timeArray[i]);
    }

    return convertMinutesToTime(averageMinutes / timeArray.length);

}

function convertTimeToMinutes(time) {
    if (time.includes(':')) {
        const timeArray = time.split(':');
        const hours = parseInt(timeArray[0]);
        const minutes = parseInt(timeArray[1]);
        return hours * 60 + minutes;
    }
    else {
        return parseInt(time) * 60;
    }
}

function convertMinutesToTime(minutes) {
    if (minutes > 60) {
        const hours = Math.floor(minutes / 60);
        const minutesLeft = minutes % 60;
        return `${hours}:${minutesLeft}`;
    }
    else {
        return `00:${minutes}`;
    }
}

module.exports = {
    getAverageTime: getAverageTime,
    convertTimeToMinutes: convertTimeToMinutes,
    convertMinutesToTime: convertMinutesToTime
}