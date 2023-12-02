import InputParser from '../utils/input-parser';

InputParser.create({
    url: 'https://adventofcode.com/2023/day/2/input',
}).then((parser) => {
    const values = parser.toArray();

    const result = values
        .map((value) => {
            const [, id, outcome] = value.match(/Game\s(\d+):\s(.*)/);
            const grabs = outcome.split(';');
            const colorsets = grabs.map((grab) => grab.split(', '));

            const maxes: Record<string, number> = {
                red: 12,
                green: 13,
                blue: 14,
            };

            const _checkColorSet = (set: string) => {
                const [number, color] = set.trim().split(' ');
                return parseInt(number) <= maxes[color];
            };

            return {
                id,
                valid: colorsets
                    .flat(1)
                    .every((color) => _checkColorSet(color)),
            };
        })
        .filter((el) => el.valid)
        .reduce((acc, el) => {
            return acc + parseInt(el.id);
        }, 0);

    console.log({ result });
    debugger;
});
