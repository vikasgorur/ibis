import _ from 'lodash'
import { Chess, Color } from 'chess.js'
import {
    places, material, deltaSet,
    pawnAttacks, knightAttacks, bishopAttacks, rookAttacks, queenAttacks,
    squaresToEdge, bishopBlockers,
    supporters
} from './position'

describe('occupiedSquares', () => {
    it('should return the correct number of squares', () => {
        let b = new Chess()
        expect(places(b, 'w').length).toBe(16)
    })
})

describe('material', () => {
    it('should return the correct material', () => {
        let b = new Chess()
        expect(material(b, 'w')).toBe(
            8       // pawns
            + 4*3   // knights & bishops
            + 2*5   // rooks
            + 9)    // queen
    })
})

describe('deltaSet', () => {
    it('should respect board boundaries', () => {
        expect(deltaSet('a1', [[-1, -1]])).toEqual([])
        expect(deltaSet('h8', [[1, 1]])).toEqual([])
        expect(deltaSet('a8', [[-1, 1]])).toEqual([])
        expect(deltaSet('h1', [[1, -1]])).toEqual([])
        expect(deltaSet('b8', [[0, 1]])).toEqual([])
    })
})

describe('pawnAttacks', () => {
    it('should return the correct squares', () => {
        expect(pawnAttacks('a2', 'w')).toEqual(['b3'])
        expect(pawnAttacks('h2', 'w')).toEqual(['g3'])
        expect(pawnAttacks('a7', 'b')).toEqual(['b6'])
        expect(pawnAttacks('h7', 'b')).toEqual(['g6'])
        expect(pawnAttacks('e4', 'w')).toEqual(['d5', 'f5'])
    })
})

describe('knightAttacks', () => {
    it('should return the correct squares', () => {
        expect(_.sortBy(knightAttacks('a1'))).toEqual(_.sortBy(['b3', 'c2']))
        expect(_.sortBy(knightAttacks('h1'))).toEqual(_.sortBy(['g3', 'f2']))
        expect(_.sortBy(knightAttacks('a8'))).toEqual(_.sortBy(['b6', 'c7']))
        expect(_.sortBy(knightAttacks('h8'))).toEqual(_.sortBy(['g6', 'f7']))
        expect(_.sortBy(knightAttacks('e4'))).toEqual(_.sortBy(['d6', 'f6', 'c5', 'g5', 'c3', 'g3', 'd2', 'f2']))
    })
})

describe('bishopAttacks', () => {
    it('should return the correct squares for a1', () => {
        expect(_.sortBy(bishopAttacks('a1'))).toEqual(_.sortBy(['b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8']))
    })

    it('should return the correct squares for d4', () => {
        expect(_.sortBy(bishopAttacks('d4'))).toEqual(_.sortBy([
            'a1', 'b2', 'c3', 'e5', 'f6', 'g7', 'h8',
            'a7', 'b6', 'c5', 'e3', 'f2', 'g1',
        ]))
    })

    it('should return the correct squares for h8', () => {
        expect(_.sortBy(bishopAttacks('h8'))).toEqual(_.sortBy(['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7']))
    })
})

describe('rookAttacks', () => {
    it('should return the correct squares for a1', () => {
        expect(_.sortBy(rookAttacks('a1'))).toEqual(_.sortBy([
            'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
            'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
        ]))
    })

    it('should return the correct squares for d4', () => {
        expect(_.sortBy(rookAttacks('d4'))).toEqual(_.sortBy([
            'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4',
            'd1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8',
        ]))
    })

    it('should return the correct squares for h8', () => {
        expect(_.sortBy(rookAttacks('h8'))).toEqual(_.sortBy([
            'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7',
        ]))
    })
})

describe('queenAttacks', () => {
    it('should return the correct squares for a1', () => {
        expect(_.sortBy(queenAttacks('a1'))).toEqual(_.sortBy([
            'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
            'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8',
            'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
        ]))
    })

    it('should return the correct squares for d4', () => {
        expect(_.sortBy(queenAttacks('d4'))).toEqual(_.sortBy([
            'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4',
            'd1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8',
            'a1', 'b2', 'c3', 'e5', 'f6', 'g7', 'h8',
            'a7', 'b6', 'c5', 'e3', 'f2', 'g1',
        ]))
    })

    it('should return the correct squares for h8', () => {
        expect(_.sortBy(queenAttacks('h8'))).toEqual(_.sortBy([
            'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7',
            'g7', 'f6', 'e5', 'd4', 'c3', 'b2', 'a1',
        ]))
    })
})

describe('squaresToEdge', () => {
    it('should return the correct squares for a1 (rook up)', () => {
        expect(squaresToEdge('a1', [0, 1])).toEqual([
            'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
        ])
    })

    it('should return the correct squares for a1 (rook right)', () => {
        expect(squaresToEdge('a1', [1, 0])).toEqual([
            'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
        ])
    })
})

describe('bishopBlockers', () => {
    it('should return the correct blockers for c3', () => {
        const b = new Chess()
        expect(_.sortBy(bishopBlockers(b, { square: 'c1', type: 'b', color: 'w' }))).toEqual(_.sortBy([
            'b2', 'd2'
        ]))
    })
})

describe('supporters', () => {
    // 1. e4 e5 2. Nf3 Nf6
    const VIENNA_4 = 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3'

    it('should return two pawns for knight on c3', () => {
        const b = new Chess(VIENNA_4)
        expect(supporters(b, { square: 'c3', type: 'n', color: 'w' }).map(p => p.square)).toEqual(['b2', 'd2'])
        expect(supporters(b, { square: 'c3', type: 'n', color: 'w' }).map(p => p.type)).toEqual(['p', 'p'])
    })
})