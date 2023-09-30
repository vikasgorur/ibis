import { Chess } from 'chess.js'
import { occupiedSquares, Square } from './position'

describe('occupiedSquares', () => {
    it('should return the correct number of squares', () => {
        let b = new Chess()
        let squares = occupiedSquares(b, 'w')
        expect(squares.length).toBe(16)
    })
})