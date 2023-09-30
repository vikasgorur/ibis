import _ from 'lodash'
import { Chess, PieceSymbol, Color, Square } from 'chess.js'


/**
 * A place is a square with a piece on it.
 */
export interface Place {
    square: Square,
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

export function places(b: Chess, color: Color): Place[] {
    let result: Place[] = []
    for (let pl of _.flatten(b.board())) {
        if (pl && pl.color === color) {
            result.push(pl)
        }
    }
    return result
}

export function material(b: Chess, color: Color): number {
    let result = 0
    for (let pl of places(b, color)) {
        result += PIECE_VALUES[pl.type]
    }
    return result
}

/**
 * A `Delta` is a relative co-ordinate reference from a square: [file, rank]
 */
type Delta = [number, number]

const fileNumber = (char: string) => char.charCodeAt(0) - 'a'.charCodeAt(0)
const rankNumber = (char: string) => char.charCodeAt(0) - '1'.charCodeAt(0)
const fileChar = (num: number) => String.fromCharCode(num + 'a'.charCodeAt(0))
const rankChar = (num: number) => String.fromCharCode(num + '1'.charCodeAt(0))

/**
 * Add a list of deltas to a square and return the resulting squares.
 * @param sq 
 */
export function deltaSet(sq: Square, deltas: Delta[]): Square[] {
    let result: Square[] = []
    for (let d of deltas) {
        let [file, rank] = sq.split('')
        let [df, dr] = d
        let f = fileNumber(file) + df
        let r = rankNumber(rank) + dr
        if (f >= 0 && f <= 7 && r >= 0 && r <= 7) {
            result.push(`${fileChar(f)}${rankChar(r)}` as Square)
        }
    }
    return result
}

/**
 * Return the squares that are attacked by a pawn.
 */
export function pawnAttacks(sq: Square, color: Color): Square[] {
    let deltas: Delta[] = []
    if (color === 'w') {
        deltas = [[-1, 1], [1, 1]]
    } else {
        deltas = [[-1, -1], [1, -1]]
    }
    return deltaSet(sq, deltas)
}

/**
 * Return the squares that are attacked by a knight.
 */
export function knightAttacks(sq: Square): Square[] {
    let deltas: Delta[] = [
        [-1, 2], [-1, -2], [1, 2], [1, -2],
        [-2, 1], [-2, -1], [2, 1], [2, -1],
    ]
    return deltaSet(sq, deltas)
}

/**
 * Return the squares that are attacked by a bishop.
 */
export function bishopAttacks(sq: Square): Square[] {
    let deltas: Delta[] = []
    for (let i = 1; i <= 7; i++) {
        deltas.push([i, i], [-i, i], [i, -i], [-i, -i])
    }
    return deltaSet(sq, deltas)
}

/**
 * Return the squares that are attacked by a rook.
 */
export function rookAttacks(sq: Square): Square[] {
    let deltas: Delta[] = []
    for (let i = 1; i <= 7; i++) {
        deltas.push([i, 0], [-i, 0], [0, i], [0, -i])
    }
    return deltaSet(sq, deltas)
}

/**
 * Return the squares that are attacked by a queen.
 */
export function queenAttacks(sq: Square): Square[] {
    return _.union(bishopAttacks(sq), rookAttacks(sq))
}