import InputParser from '../utils/input-parser';

// InputParser.create({ filename: '06sample' }).then((parser) => {
InputParser.create({ day: 6 }).then((parser) => {
    const raceTableRaw = parser.toArray();
    const raceTable = raceTableRaw.map((el) => el.split(/\s+/));

    // getting the data into [duration, recordDistance] pairs
    const races = raceTable
        .reduce(
            (resultArr, row) => {
                row.forEach((column, index) => {
                    resultArr[index].push(parseInt(column));
                });
                return resultArr;
            },
            new Array(raceTable[0].length).fill(0).map((el) => [])
        )
        .slice(1);

    const distanceAtTime = (t: number, a: number) => {
        return a * t;
    };

    const result = races
        .map((race) => {
            const [duration, recordDistance] = race;

            let wins = 0;

            for (let holdTime = 0; holdTime <= duration; holdTime++) {
                const travelTime = duration - holdTime;
                const distance = distanceAtTime(travelTime, holdTime);
                if (distance > recordDistance) {
                    wins++;
                }
            }

            return wins;
        })
        .reduce((acc, el) => {
            return acc * el;
        }, 1);

    console.log({ result });
    debugger;
});
