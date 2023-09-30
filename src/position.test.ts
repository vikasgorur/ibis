import { Chess, Color } from 'chess.js'
import { occupiedSquares, material } from './position'

describe('occupiedSquares', () => {
    it('should return the correct number of squares', () => {
        let b = new Chess()
        expect(occupiedSquares(b, 'w').length).toBe(16)
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