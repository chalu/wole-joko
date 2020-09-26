/* eslint-disable no-console */

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

export const rAFQueue = (...fns) => fns.reduce(async (frame, uiTask) => {
  await frame;
  uiTask();
  return rAF();
}, rAF());

export const intFromId = (id) => id.substring(id.indexOf('-') + 1);
export const select = document.querySelector.bind(document);
export const selectAll = document.querySelectorAll.bind(document);

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

export const isEven = (num) => num % 2 === 0;
export const random = ({ max, min = 1 }) => parseInt(Math.floor(Math.random() * max) + min, 10);

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
