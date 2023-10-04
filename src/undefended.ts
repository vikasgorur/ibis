import { Chess, PieceSymbol, Color } from 'chess.js'
import {
    Place,
    places,
    pawnAttacks,
    knightAttacks,
    bishopBlockers,
    rookBlockers,
    queenBlockers,
    kingAttacks
} from './position'

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

/**
 * Return all the `Places`s of a given color that are not supported by any other piece.
 */
export function unsupportedPlaces(b: Chess, c: Color): Place[] {
    let result: Place[] = []
    let ourPlaces = places(b, c)
    for (let p of ourPlaces) {
        if (supporters(b, p).length == 0) {
            result.push(p)
        }
    }
    return result
}