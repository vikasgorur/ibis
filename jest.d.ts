declare global {
    namespace jest {
        interface JestMatchers<R, T = {}> {
            toBePlaces(expected: Place[], received: Place[]): R
        }
    }
}

