import InputParser from '../utils/input-parser';

InputParser.create({ day: 2 }).then((parser) => {
    const games = parser.toArray();

    const result = games.reduce((iAcc, game) => {
        const [, , roundData] = game.match(/Game\s(\d+):\s(.*)/);
        const rounds = roundData
            .split(';')
            .map((cubeCount) => cubeCount.split(', '));
        const cubeCountByColor = new Map([
            ['red', []],
            ['green', []],
            ['blue', []],
        ]);

        rounds.forEach((grab) => {
            grab.forEach((colorData) => {
                const [count, color] = colorData.trim().split(' ');
                cubeCountByColor.get(color).push(parseInt(count));
            });
        });

        const power =
            iAcc +
            [...cubeCountByColor.values()].reduce((jAcc, count) => {
                return jAcc * Math.max(...count);
            }, 1);
        return power;
    }, 0);

    console.log({ result });
    debugger;
});
