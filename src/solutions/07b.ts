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

interface Game {
    hand: PokerHand;
    sortedHand: PokerHand;
    wager: Wager;
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
        'T',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4',
        '3',
        '2',
        'J',
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
            const _assertIsPokerHand = (test: any): test is PokerHand => {
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

            const _getType = (hand: PokerHand): HandType => {
                const cardCount: Map<PokerCard, number> = new Map(
                    new Set(
                        hand.map((card) => [
                            card,
                            hand.filter((el) => el === card).length,
                        ])
                    )
                );

                if (cardCount.get(hand[0]) === 5) {
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

            const _getBestType = (hand: PokerHand) => {
                const jokerIndexes: Array<number | false> = hand.reduce(
                    (acc, el, index) => (el === 'J' ? [...acc, index] : acc),
                    []
                );
                const swapCards = cardOrder.filter((card) => card !== 'J');
                const insertCards: PokerCard[][] = new Array(
                    Math.pow(swapCards.length, jokerIndexes.length)
                )
                    .fill(0)
                    .map((_el, index) => {
                        return index
                            .toString(swapCards.length)
                            .padStart(jokerIndexes.length, '0')
                            .split('')
                            .map((char) => {
                                const i = parseInt(char, swapCards.length);
                                return swapCards[i];
                            });
                    });
                const testCandidates: PokerHand[] = new Array(
                    insertCards.length
                )
                    .fill(0)
                    .map((_el, index) => {
                        const inserts = insertCards[index];
                        const testHand = hand.map((card) => {
                            if (card === 'J') {
                                card = inserts.shift();
                            }
                            return card;
                        });
                        if (!_assertIsPokerHand(testHand)) {
                            throw new Error(`It wasn't a hand: ${testHand}`);
                        }
                        return testHand;
                    });

                let bestOverall = HandType.HIGH_CARD;
                for (const testHand of testCandidates) {
                    const type = _getType(testHand);
                    bestOverall = Math.max(bestOverall, type);
                }

                return bestOverall;
            };

            const type = hand.some((card) => card === 'J')
                ? _getBestType(sortedHand)
                : _getType(sortedHand);

            // return game
            return {
                hand,
                sortedHand,
                wager: parseInt(wagerRaw),
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
