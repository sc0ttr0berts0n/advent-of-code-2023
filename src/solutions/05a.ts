import InputParser from '../utils/input-parser';

/**
 * @param sourceStart the start of source range
 * @param destinationStart the start of destination range
 * @param range the range of source and destination
 * @param offset the gap between sourceStart and destinationStart
 */
interface ISourceToDestinationMap {
    sourceStart: number;
    destinationStart: number;
    range: number;
    offset: number;
}

interface ITraversalResult {
    num: number;
    whereNext: string;
}

// InputParser.create({ filename: '05sample' }).then((parser) => {
InputParser.create({ day: 5 }).then((parser) => {
    const mapsRaw = parser.toArray();

    // [
    //     seeds,
    //     seedsToSoil,
    //     soilToFertilizer,
    //     fertilizerToWater,
    //     waterToLight,
    //     lightToTemperature,
    //     temperatureToHumidity,
    //     humidityToLocation,
    // ];

    // parse raw data
    const sectionsRaw = mapsRaw.reduce(
        (acc: string[][], _line, index, arr): string[][] => {
            const nextLine = arr[index + 1];
            if (nextLine === '' || nextLine === undefined) {
                const lastLineBreak = arr.lastIndexOf('', index);
                acc.push(arr.slice(Math.max(lastLineBreak + 1, 0), index + 1));
            }
            return acc;
        },
        []
    );

    // fix seed row's special formatting
    sectionsRaw[0] = ['seeds:', sectionsRaw[0][0].split('seeds: ')[1]];

    // build up maps
    const seeds = sectionsRaw
        .shift()
        .pop()
        .split(' ')
        .map((num) => parseInt(num));

    const almanacMaps: Map<string, ISourceToDestinationMap[]> = new Map();

    sectionsRaw.forEach((section) => {
        const id = section.shift().replace(/\smap:/, '');
        const maps: ISourceToDestinationMap[] = section.map((map) => {
            const [destinationStart, sourceStart, range] = map
                .split(' ')
                .map((el) => parseInt(el));
            const offset = destinationStart - sourceStart;
            return { destinationStart, sourceStart, range, offset };
        });

        almanacMaps.set(id, maps);
    });

    /**
     * references the map to convert source number into a destination number
     * @param inNum the starting number to be transformed by the map
     * @param start the start string, for example, seed, water, temperature
     */
    const traverseMapSection = (
        inNum: number,
        start: string
    ): ITraversalResult => {
        // look up the target almanac map
        const mapID = [...almanacMaps.keys()].find((el) =>
            el.startsWith(start)
        );

        // guard against bad mapIDs
        if (!mapID) throw Error(`No mapID starts with "${start}".`);

        // determine where we will go next
        const [, whereNext] = mapID.split('-to-');

        // see if the map is valido
        const validMap: ISourceToDestinationMap | undefined = almanacMaps
            .get(mapID)
            .find((map) => {
                const { sourceStart, range } = map;

                // check if num is in range
                return inNum >= sourceStart && inNum < sourceStart + range;
            });

        const num = validMap ? inNum + validMap.offset : inNum;

        // console.log({ start, num, end: whereNext });

        return { num, whereNext };
    };

    const traverseAlmanac = (
        seed: number,
        start: string = 'seed',
        end: string = 'location'
    ): number => {
        let _num = seed;
        let _start = start;
        let _result;
        while (_start !== end) {
            _result = traverseMapSection(_num, _start);
            _num = _result.num;
            _start = _result.whereNext;
        }
        return _result.num;
    };

    const locations = seeds.map((seed) => {
        const res = traverseAlmanac(seed);
        if (!res) debugger;
        return res;
    });

    console.log(Math.min(...locations));

    debugger;
});
