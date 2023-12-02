import InputParser from '../utils/input-parser';

InputParser.create({
    url: 'https://adventofcode.com/2023/day/1/input',
}).then((parser) => {
    const values = parser.toArray();

    const result = values.reduce((acc: number, line: string, index: number) => {
        let first: string | null = null;
        let last: string | null = null;

        const wordsToNumbers: Record<string, number> = {
            one: 1,
            two: 2,
            three: 3,
            four: 4,
            five: 5,
            six: 6,
            seven: 7,
            eight: 8,
            nine: 9,
        };

        const numbers = new Array(10).fill(0).map((_el, i) => i.toString());

        let firstSearch = line;
        let lastSearch = line.split('').reverse().join('');

        while (firstSearch.length) {
            let subject: string | null = null;

            for (const el of [...numbers, ...Object.keys(wordsToNumbers)]) {
                if (firstSearch.startsWith(el)) {
                    subject = el;
                    break;
                }
            }

            if (subject) {
                first = subject;
                break;
            }
            firstSearch = firstSearch.substring(1);
        }

        while (lastSearch.length) {
            let subject: string | null = null;

            for (const el of [
                ...numbers,
                ...Object.keys(wordsToNumbers).map((el) =>
                    el.split('').reverse().join('')
                ),
            ]) {
                if (lastSearch.startsWith(el)) {
                    subject = el;
                    break;
                }
            }

            if (subject) {
                last = subject.split('').reverse().join('');
                break;
            }
            lastSearch = lastSearch.substring(1);
        }

        const _convertToNumeral = (val: string) => {
            return val.length > 1 ? wordsToNumbers[val] : val;
        };

        return (
            acc +
            Number(`${_convertToNumeral(first)}${_convertToNumeral(last)}`)
        );
    }, 0);

    console.log({ result });
    debugger;
});
