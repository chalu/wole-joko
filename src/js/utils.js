/* eslint-disable no-console */

/**
 * Promise-ified shorthand for requestAnimationFrame
 * @param {Object} opts contains `waitUntil` that indicates
 * any initial wait time before getting the next frame
 * @returns {Promise} a promise that resolve when the then frame is available
 */
export const rAF = (opts = {}) => {
  const { waitUntil } = opts;
  return new Promise((resolve) => {
    if (waitUntil) {
      setTimeout(() => {
        window.requestAnimationFrame(resolve);
      }, waitUntil);
      return;
    }
    window.requestAnimationFrame(resolve);
  });
};

/**
 * Schedules a number of ui/render tasks (no-arg functions)
 * to be called sequentially by requestAnimationFrame.
 * Useful when you want to do a large number of ui/dom operations
 * and need to keep the operations performant.
 *
 * @param {Function} fns variable number of functions
 * representing the ui/render tasks to queue with requestAnimationFrame
 * @returns {Promise} a promise that resolves after executing all tasks in the queue
 */
export const rAFQueue = (...fns) => fns.reduce(async (frame, uiTask) => {
  await frame;
  uiTask();
  return rAF();
}, rAF());

/**
 * Returns the int portion of the given id
 * @param {String} id id of a person in the system
 * @returns {Number}
 */
export const intFromId = (id) => id.substring(id.indexOf('-') + 1);

/**
 * Shorthand for document.querySelector
 * @returns {Node}
 */
export const select = document.querySelector.bind(document);

/**
 * Shorthand for document.querySelectorAll
 * @returns {NodeList}
 */
export const selectAll = document.querySelectorAll.bind(document);

/**
 * A special Iterable that allows you to
 * go over the items of an array in pairs
 * E.g :
 * ```
 * const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
 * for(let pair of pairsFrom(list)) {
 *  // pair will be [1, 2], [3, 4] e.t.c
 * }
 * ```
 *
 * We used this to provide a pair of attendees to an usher at once
 * @param {array} array the array to iterate over
 * @returns {Iterator}
 */
export const pairsFrom = (array = []) => {
  const iterable = {
    from: -1,

    [Symbol.iterator]() {
      return this;
    },

    next() {
      const first = array[this.from += 1];
      if (!first) return { done: true };

      const second = array[this.from += 1];
      if (!second) return { done: false, value: [first] };

      return { done: false, value: [first, second] };
    }
  };

  return iterable;
};

/**
 * Determines if a number is even (returns true) or not (returns false)
 * @param {Number} num number to check
 * @returns {Boolean}
 */
export const isEven = (num) => num % 2 === 0;

/**
 * Generates a random number somewhere between min and max properties
 * of the parameter. I basically lifted this from Stackoverflow :)
 *
 * @param {Object} param0 object with `min` and `max` property indicating rough
 * range of the number to generate
 * @returns {Number}
 */
export const random = ({ max, min = 1 }) => parseInt(Math.floor(Math.random() * max) + min, 10);

/**
 * A handly util for better formatted console.log statements
 * @param {String} realm Designates a sub-system of this app emitting the log messages.
 * Imagine logs from the UI vs logs from a service worker. These are seen as diffrent realms!
 * @returns {Object} an object with `info`, `error`, and `warn` fields used to handle
 * that specific kind of log messages
 */
const logr = (realm) => {
  const style = 'color:#fff;display:block';
  return {
    info: (...msgs) => {
      console.log(`%c Wọlé Jókò (${realm}) %c`, `background:darkblue;${style}`, '', ...msgs);
    },
    error: (...msgs) => {
      console.error(`%c Wọlé Jókò (${realm}) %c`, `background:darkred;${style}`, '', ...msgs);
    },
    warn: (...msgs) => {
      console.warn(`%c Wọlé Jókò (${realm}) %c`, `background:darkgoldenrod;${style}`, '', ...msgs);
    }
  };
};

export const logs = logr('App');

const DRESS_COLORS = [
  'lightblue', 'lighterblue', 'mediumblue', 'deeperblue', 'orange',
  'purple', 'darkerorange', 'darkersoftorange', 'white', 'black'
];
export const getRandomDressColorFromPallate = () => {
  const index = Math.floor(Math.random() * DRESS_COLORS.length);
  return DRESS_COLORS[index % DRESS_COLORS.length];
};
