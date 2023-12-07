import InputParser from '../utils/input-parser';

InputParser.create({ day: 4 }).then((parser) => {
    const cards = parser.toArray();

    const score = cards.reduce((acc, card, index) => {
        // string processing into data
        const split = card.match(/Card\s+(\d+):(.*)\|(.*)/);
        const [, id, winningRaw, yoursRaw] = split;

        const winning = winningRaw.trim().split(/\s+/);
        const yours = yoursRaw.trim().split(/\s+/);

        // get count of "your winning numbers" that match
        const count = yours.filter((num) => winning.includes(num)).length;

        // score equal count if less than two, otherwise
        // double it up. this is done through bitshift
        const score = count <= 1 ? count : 1 << (count - 1);

        return acc + score;
    }, 0);

    console.log({ score });
    debugger;
});
