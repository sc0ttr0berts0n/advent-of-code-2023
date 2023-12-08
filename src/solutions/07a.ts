import InputParser from '../utils/input-parser';

type PokerCard =
    | 'A'
    | 'K'
    | 'Q'
    | 'J'
    | 'T'
    | '9'
    | '8'
    | '7'
    | '6'
    | '5'
    | '4'
    | '3'
    | '2';

enum HandType {
    HIGH_CARD,
    ONE_PAIR,
    TWO_PAIR,
    THREE_OF_A_KIND,
    FULL_HOUSE,
    FOUR_OF_A_KIND,
    FIVE_OF_A_KIND,
}

type PokerHand = [PokerCard, PokerCard, PokerCard, PokerCard, PokerCard];
type Wager = number;
type KeyCards = PokerCard[];
type Kickers = PokerCard[];

interface Game {
    hand: PokerHand;
    sortedHand: PokerHand;
    wager: Wager;
    keyCards: KeyCards;
    kickers: Kickers;
    type: HandType;
    typeString: string;
}

// InputParser.create({ filename: '07sample' }).then((parser) => {
InputParser.create({ day: 7 }).then((parser) => {
    const pokerRaw = parser.toArray();

    const cardOrder: PokerCard[] = [
        'A',
        'K',
        'Q',
        'J',
        'T',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4',
        '3',
        '2',
    ];

    const games: Game[] = pokerRaw
        .map((gameRaw) => {
            // process raw data
            const [handRaw, wagerRaw] = gameRaw.split(' ');
            const untestedHand = handRaw.split('');

            // type safe assertions
            const _assertIsPokerCard = (test: string): test is PokerCard => {
                return cardOrder.includes(test as PokerCard);
            };
            const _assertIsPokerHand = (test: string[]): test is PokerHand => {
                return test.length === 5 && test.every(_assertIsPokerCard);
            };

            const _pokerSort = (a: PokerCard, b: PokerCard) => {
                return cardOrder.indexOf(a) - cardOrder.indexOf(b);
            };

            // sort hand
            const hand = [...untestedHand];
            const sortedHand = [...untestedHand].sort(_pokerSort);

            // if fail assertions, throw error and quit
            if (!_assertIsPokerHand(hand)) {
                throw Error(`Invalid Poker Hand: ${handRaw}`);
            }
            if (!_assertIsPokerHand(sortedHand)) {
                throw Error(`Invalid Poker Hand: ${handRaw}`);
            }

            // map cards to count
            const cardCount: Map<PokerCard, number> = new Map(
                new Set(
                    sortedHand.map((card) => [
                        card,
                        sortedHand.filter((el) => el === card).length,
                    ])
                )
            );

            const _getType = (): HandType => {
                if (cardCount.get(sortedHand[0]) === 5) {
                    return HandType.FIVE_OF_A_KIND;
                } else if ([...cardCount.values()].some((val) => val === 4)) {
                    return HandType.FOUR_OF_A_KIND;
                } else if (
                    [...cardCount.values()].some((val) => val === 3) &&
                    [...cardCount.values()].some((val) => val === 2)
                ) {
                    return HandType.FULL_HOUSE;
                } else if ([...cardCount.values()].some((val) => val === 3)) {
                    return HandType.THREE_OF_A_KIND;
                } else if (
                    [...cardCount.values()].filter((val) => val === 2)
                        .length === 2
                ) {
                    return HandType.TWO_PAIR;
                } else if ([...cardCount.values()].some((val) => val === 2)) {
                    return HandType.ONE_PAIR;
                } else {
                    return HandType.HIGH_CARD;
                }
            };

            const type = _getType();

            const _splitKeyCardsAndKickers = (): [KeyCards, Kickers] => {
                if (type === HandType.FIVE_OF_A_KIND) {
                    return [sortedHand, []];
                } else if (type === HandType.FOUR_OF_A_KIND) {
                    const four = sortedHand.filter(
                        (card) => cardCount.get(card) === 4
                    );
                    const one = sortedHand.find((card) => card !== four[0]);
                    return [four, [one]];
                } else if (type === HandType.FULL_HOUSE) {
                    return [sortedHand, []];
                } else if (type === HandType.THREE_OF_A_KIND) {
                    const three = sortedHand.filter(
                        (card) => cardCount.get(card) === 3
                    );
                    const two = sortedHand.filter((card) => card !== three[0]);
                    return [three, two];
                } else if (type === HandType.TWO_PAIR) {
                    const one = sortedHand.find(
                        (card) => cardCount.get(card) === 1
                    );
                    const four = sortedHand.filter((card) => card !== one);
                    return [four, [one]];
                } else if (type === HandType.ONE_PAIR) {
                    const two = sortedHand.filter(
                        (card) => cardCount.get(card) === 2
                    );
                    const three = sortedHand.filter((card) => card !== two[0]);
                    return [two, three];
                } else if (type === HandType.HIGH_CARD) {
                    return [sortedHand, []];
                }
            };

            const [keyCards, kickers] = _splitKeyCardsAndKickers();

            // return game
            return {
                hand,
                sortedHand,
                wager: parseInt(wagerRaw),
                keyCards,
                kickers,
                type,
                typeString: HandType[type],
            };
        })
        .sort((a, b) => {
            if (a.type !== b.type) {
                return b.type - a.type;
            } else {
                const indexOfNoMatch = a.hand.findIndex(
                    (card, index) => card !== b.hand[index]
                );
                const aRank = cardOrder.indexOf(a.hand[indexOfNoMatch]);
                const bRank = cardOrder.indexOf(b.hand[indexOfNoMatch]);
                return aRank - bRank;
            }
        });

    const winnings = games.reverse().reduce((acc, game, index) => {
        return acc + (index + 1) * game.wager;
    }, 0);

    games.reverse().forEach((game) => {
        console.log(`${game.typeString}: ${game.sortedHand} => ${game.hand}`);
    });

    console.log({ winnings });

    debugger;
});
