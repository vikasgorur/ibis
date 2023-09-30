import _ from 'lodash'
import { Chess, PieceSymbol, Color } from 'chess.js'

export interface Square {
    square: string,
    type: PieceSymbol,
    color: Color,
}

type PieceValues = { [key in PieceSymbol]: number }

const PIECE_VALUES: PieceValues = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0,
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

export function material(b: Chess, color: Color): number {
    let result = 0
    for (let s of occupiedSquares(b, color)) {
        result += PIECE_VALUES[s.type]
    }
    return result
}