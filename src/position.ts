import _ from 'lodash'
import { Chess, PieceSymbol, Color } from 'chess.js'

export interface Square {
    square: string,
    type: PieceSymbol,
    color: Color,
}

export function occupiedSquares(b: Chess, color: Color): Square[] {
    let result: Square[] = []
    for (let s of _.flatten(b.board())) {
        if (s && s.color === color) {
            result.push(s)
        }
    }
    return result
}