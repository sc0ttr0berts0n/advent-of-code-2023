import InputParser from '../utils/input-parser';

interface ICardData {
    rewards: number[];
    copies: number;
}

InputParser.create({ day: 4 }).then((parser) => {
    const cards = parser.toArray();
    const cardData: Map<number, ICardData> = new Map();

    cards.forEach((card) => {
        // string processing into data
        const split = card.match(/Card\s+(\d+):(.*)\|(.*)/);
        const [, idRaw, winningRaw, yoursRaw] = split;

        const id = parseInt(idRaw);
        const winning = winningRaw.trim().split(/\s+/);
        const yours = yoursRaw.trim().split(/\s+/);

        // get count of "your winning numbers" that match
        const count = yours.filter((num) => winning.includes(num)).length;

        const rewards = Array(count)
            .fill(0)
            .map((_el, index) => id + index + 1);

        cardData.set(id, { rewards, copies: 0 });
    });

    const findRewards = (rewards: number[]) => {
        for (let reward of rewards) {
            const lol = cardData.get(reward);
            lol.copies++;
            findRewards(lol.rewards);
        }
    };

    findRewards(Array.from({ length: cardData.size }, (_, i) => i + 1));

    const total = Array.from(cardData.values()).reduce((acc, card) => {
        return acc + card.copies;
    }, 0);

    console.log({ total });
    debugger;
});
