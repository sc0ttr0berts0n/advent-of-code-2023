import InputParser from '../utils/input-parser';

// InputParser.create({ filename: '06sample' }).then((parser) => {
InputParser.create({ day: 6 }).then((parser) => {
    const raceTableRaw = parser.toArray();
    const raceTable = raceTableRaw.map((el) => el.split(/\s+/));

    // getting the data into [duration, recordDistance] pairs
    const race = raceTable.map((el) => {
        return parseInt(el.slice(1).join(''));
    });

    const distanceAtTime = (t: number, a: number) => {
        return a * t;
    };

    const [duration, recordDistance] = race;

    let wins = 0;

    for (let holdTime = 0; holdTime <= duration; holdTime++) {
        const travelTime = duration - holdTime;
        const distance = distanceAtTime(travelTime, holdTime);
        if (distance > recordDistance) {
            wins++;
        }
    }

    console.log({ wins });
    debugger;
});
