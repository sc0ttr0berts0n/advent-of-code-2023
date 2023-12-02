import InputParser from '../utils/input-parser';

InputParser.create({
    url: 'https://adventofcode.com/2023/day/1/input',
}).then((parser) => {
    const values = parser.toArray();

    const result = values.reduce((acc: number, line: string) => {
        let first: number | null = null;
        let last: number | null = null;

        line.split('').forEach((char) => {
            const isNum = !Number.isNaN(Number(char));

            if (!first && isNum) {
                first = Number(char);
            }

            if (isNum) {
                last = Number(char);
            }
        });

        if (!first || !last) debugger;
        return acc + Number(`${first}${last}`);
    }, 0);

    console.log(result);
    debugger;
});
// const depths = parser.toArray().map((str) => parseInt(str));
