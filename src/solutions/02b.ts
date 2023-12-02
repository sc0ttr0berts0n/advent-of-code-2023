import InputParser from '../utils/input-parser';

InputParser.create({
    url: 'https://adventofcode.com/2023/day/2/input',
}).then((parser) => {
    const values = parser.toArray();

    const result = values.reduce((outerAcc, value) => {
        const [, , outcome] = value.match(/Game\s(\d+):\s(.*)/);
        const grabs = outcome.split(';');
        const colorsets = grabs.map((grab) => grab.split(', '));
        const colorCount = new Map([
            ['red', []],
            ['green', []],
            ['blue', []],
        ]);

        colorsets.forEach((grab) => {
            grab.forEach((data) => {
                const [number, color] = data.trim().split(' ');
                colorCount.get(color).push(parseInt(number));
            });
        });

        return (
            outerAcc +
            [...colorCount.values()].reduce((innerAcc, el) => {
                return innerAcc * Math.max(...el);
            }, 1)
        );
    }, 0);

    console.log({ result });
    debugger;
});
