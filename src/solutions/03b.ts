import InputParser from '../utils/input-parser';

interface IPos {
    x: number;
    y: number;
}
interface IPartNumbers {
    pos: IPos;
    length: number;
    value: string;
    gearPos: null | IPos;
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
                    gearPos: null,
                });

                // move x to next empty space + 1
                x = x + length;
            }
        }
    }

    const partNumbers = numberLocations.filter((num) => {
        const isGear = (char: string | undefined) => {
            return char === '*';
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
        const checkCellForGear = (pos: IPos): IPos | false => {
            const char = grid[pos.y]?.[pos.x];
            return isGear(char) ? pos : false;
        };
        const coordsToCheck: IPos[] = [
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
            const gearPos = checkCellForGear(coord);
            if (gearPos) {
                num.gearPos = gearPos;
            }
            return gearPos !== false;
        });
    });

    const mapByGearPos: Map<string, number[]> = new Map();

    partNumbers.forEach((part) => {
        const { x, y } = part.gearPos;
        if (mapByGearPos.has(`x:${x},y:${y}`)) {
            mapByGearPos.get(`x:${x},y:${y}`).push(parseInt(part.value));
        } else {
            mapByGearPos.set(`x:${x},y:${y}`, [parseInt(part.value)]);
        }
    });

    const sumOfGearRatios = [...mapByGearPos.values()]
        .filter((el) => el.length === 2)
        .reduce((acc, gearSet) => {
            const product = gearSet[0] * gearSet[1];
            if (isNaN(product)) debugger;
            return acc + product;
        }, 0);

    console.log({ sumOfGearRatios });

    debugger;
});
