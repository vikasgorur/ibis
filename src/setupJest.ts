import _ from 'lodash'
import { Place } from './position'

expect.extend({
    // Compare two arrays of `Place`s, ignoring the order of the elements.
    toBePlaces(expected, received) {
        const pass = _.isEqual(_.sortBy(expected, p => p.square), _.sortBy(received, p => p.square))
        if (pass) {
            return {
                message: () =>
                    `expected ${JSON.stringify(received)} not to be places ${JSON.stringify(expected)}`,
                pass: true,
            }
        } else {
            return {
                message: () =>
                    `expected ${JSON.stringify(received)} to be places ${JSON.stringify(expected)}`,
                pass: false,
            }
        }
    }
})