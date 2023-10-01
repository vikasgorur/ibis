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
const coordinates = (sq: Square) => [fileNumber(sq[0]), rankNumber(sq[1])]

const fileChar = (num: number) => String.fromCharCode(num + 'a'.charCodeAt(0))
const rankChar = (num: number) => String.fromCharCode(num + '1'.charCodeAt(0))

/**
 * Add a list of deltas to a square and return the resulting squares.
 * @param sq 
 */
export function deltaSet(sq: Square, deltas: Delta[]): Square[] {
    let result: Square[] = []
    let [file, rank] = coordinates(sq)

    for (let d of deltas) {
        let [df, dr] = d
        let f = file + df
        let r = rank + dr
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

/**
 * Return the squares that are attacked by a king.
 */
export function kingAttacks(sq: Square): Square[] {
    let deltas: Delta[] = [
        [-1, 1], [0, 1], [1, 1],
        [-1, 0], [1, 0],
        [-1, -1], [0, -1], [1, -1],
    ]
    return deltaSet(sq, deltas)
}

/**
 * Return the list of squares on a path from a square to an edge, given a delta (direction of movement).
 */
export function squaresToEdge(sq: Square, delta: Delta): Square[] {
    let result: Square[] = []
    let [df, dr] = delta
    let [file, rank] = coordinates(sq)
    let f = file + df
    let r = rank + dr

    while (f >= 0 && f <= 7 && r >= 0 && r <= 7) {
        result.push(`${fileChar(f)}${rankChar(r)}` as Square)
        f += df
        r += dr
    }
    return result
}

/**
 * Return the first piece that blocks the bishop's path, in all four directions.
 */
export function pieceBlockers(b: Chess, pl: Place, directions: Array<Delta>): Square[] {
    let result: Square[] = []

    for (let d of directions) {
        for (let sq of squaresToEdge(pl.square, d as Delta)) {
            if (b.get(sq)) {
                result.push(sq)
                break
            }
        }
    }
    return result 
}

export const bishopBlockers = (b: Chess, pl: Place) => pieceBlockers(b, pl, [[1, 1], [-1, 1], [1, -1], [-1, -1]])
export const rookBlockers = (b: Chess, pl: Place) => pieceBlockers(b, pl, [[1, 0], [-1, 0], [0, 1], [0, -1]])
export const queenBlockers = (b: Chess, pl: Place) => pieceBlockers(b, pl, [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [0, 1], [0, -1]
])

/**
 * Return the list of `Place`s that support a given `Place`.
 * 
 * "support" means it can capture the piece on `target`, if an enemy piece
 * was on it.
 */
export function supporters(b: Chess, target: Place): Place[] {
    let result: Place[] = []
    let ourPlaces = places(b, target.color)

    /**
     * For each piece type, a function that returns true if `pl` supports `target`.
     */
    const PIECE_SUPPORTS: { [key in PieceSymbol]: (b: Chess, pl: Place, target: Place) => Boolean } = {
        p: (b, pl, target) => pawnAttacks(pl.square, pl.color).includes(target.square),
        n: (b, pl, target) => knightAttacks(pl.square).includes(target.square),
        b: (b, pl, target) => bishopBlockers(b, pl).includes(target.square),
        r: (b, pl, target) => rookBlockers(b, pl).includes(target.square),
        q: (b, pl, target) => queenBlockers(b, pl).includes(target.square),
        k: (b, pl, target) => kingAttacks(pl.square).includes(target.square)
    }
    for (let p of ourPlaces) {
        if (p.square != target.square
            && PIECE_SUPPORTS[p.type](b, p, target)) {
            result.push(p)
        }
    }
    return result
}