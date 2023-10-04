import { Chess, Square } from 'chess.js'
import _ from 'lodash'
import { Place } from './position'
import { supporters, unsupportedPlaces } from './undefended'

const place = (b: Chess, sq: Square) => _.merge({ square: sq }, b.get(sq)) as Place

// 1. e4 e5 2. Nf3 Nf6
const VIENNA_4 = 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3'

// study: https://lichess.org/study/LC4BD9J0/bUnyuIyO
// 8. Bh6
const KASPAROV_99_8 = 'r1bqk2r/p2nppbp/2pp1npB/1p6/3PP3/2N2P2/PPPQN1PP/R3KB1R b KQkq - 3 8'
// 18. ... Ba8
const KASPAROV_99_18 = 'bk1r3r/4qp1p/pn1p1npQ/Npp5/4P3/P1N2PP1/1PP4P/1K1R1B1R w - - 3 19'

describe('supporters', () => {
    it('should return two pawns for knight on c3', () => {
        const b = new Chess(VIENNA_4)
        // @ts-ignore
        expect(supporters(b, place(b, 'c3'))).toBePlaces([ 
            place(b, 'b2'),
            place(b, 'd2'),
        ])
    })

    it('should identify supporters correctly', () => {
        const b = new Chess(KASPAROV_99_8)
        // @ts-ignore
        expect(supporters(b, place(b, 'g7'))).toBePlaces([]) // bishop on g7 has no supporters
        // @ts-ignore
        expect(supporters(b, place(b, 'h6'))).toBePlaces([
            place(b, 'd2'), // bishop on h6 supported by queen on d2
        ])
    })

    it('should identify supporters correctly', () => {
        const b = new Chess(KASPAROV_99_18)
        // @ts-ignore
        expect(supporters(b, place(b, 'e7'))).toBePlaces([]) // black queen on e7 has no supporters
        // @ts-ignore
        expect(supporters(b, place(b, 'a6'))).toBePlaces([]) // white knight on a6 has no supporters
        // @ts-ignore
        expect(supporters(b, place(b, 'd1'))).toBePlaces([
            place(b, 'c3'), // white rook d1 supported by knight on c3
        ])
    })
})

const OPERA_2 = 'rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3'

describe('unsupportedPlaces', () => {
    it('should return the pawn on e4', () => {
        const b = new Chess(OPERA_2)
        // @ts-ignore
        expect(unsupportedPlaces(b, 'w')).toBePlaces([
            place(b, 'e4'), place(b, 'a1'), place(b, 'h1')
        ])
    })
})