import InputParser from '../utils/input-parser';

interface IPartNumbers {
    pos: { x: number; y: number };
    length: number;
    value: string;
}

InputParser.create({ day: 3 }).then((parser) => {
    const numberLocations: IPartNumbers[] = [];
    const grid = parser.toArray();
    const isDigit = (char: string) => !isNaN(parseInt(char, 10));

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (isDigit(grid[y][x])) {
                const indexOfNonDigit = grid[y]
                    .substring(x, x + 4)
                    .split('')
                    .findIndex((el) => !isDigit(el));

                const length =
                    indexOfNonDigit > 0
                        ? indexOfNonDigit
                        : grid[y].substring(x).length;

                if (length < 0) debugger;

                numberLocations.push({
                    pos: { x, y },
                    length,
                    value: grid[y].substring(x, x + length),
                });

                // move x to next empty space + 1
                x = x + length;
            }
        }
    }

    const partNumbers = numberLocations.filter((num) => {
        const isSymbol = (char: string | undefined) => {
            // if (char && !isDigit(char) && char !== '.') {
            //     debugger;
            //     console.log(char);
            // }
            return char && !isDigit(char) && char !== '.';
        };
        const relativeCoordsToCheck = [
            { x: -1, y: -1 },
            { x: 0, y: -1 },
            { x: 1, y: -1 },

            { x: -1, y: 0 },
            { x: 1, y: 0 },

            { x: -1, y: 1 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
        ] as const;
        const checkCellForSymbol = (pos: { x: number; y: number }) => {
            const char = grid[pos.y]?.[pos.x];
            return isSymbol(char);
        };
        const coordsToCheck = [
            ...new Set(
                Array(num.length)
                    .fill(0)
                    .map((_el, index) => {
                        return { x: num.pos.x + index, y: num.pos.y };
                    })
                    .map((pos) => {
                        return relativeCoordsToCheck.map((cell) => {
                            return `x:${pos.x + cell.x},y:${pos.y + cell.y}`;
                        });
                    })
                    .flat()
            ),
        ].map((val) => {
            const [x, y] = val.substring(2).split(',y:');
            return { x: parseInt(x), y: parseInt(y) };
        });
        return coordsToCheck.some((coord) => {
            // if (coord.x === 68 && coord.y === 1) {
            //     const lol = grid[coord.y][coord.x];
            //     debugger;
            // }
            return checkCellForSymbol(coord);
        });
    });

    const sumOfPartNumbers = partNumbers.reduce(
        (acc, num) => acc + parseInt(num.value),
        0
    );

    console.log({ sumOfPartNumbers });

    debugger;
});
