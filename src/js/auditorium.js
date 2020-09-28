import Ushering from './ushering.js';
import Attendee from './attendee.js';
import {
  random, logs, selectAll, rAFQueue, pairsFrom
} from './utils.js';

let ushers;
let admitted = 0;
let goingToEvent = 0;
const { info } = logs;

const CAPACITY = 8000;
const TOTAL_ROWS = 500;
const SEATS_PER_ROW = 16;
const ADMIT_PER_TIME = 16;

/**
 * Admits a finite number of people into the event hall.
 * Once in, they are ushered in pairs by the first available usher
 * @param {Number} people number of people to admit into
 * the event hall at this point in time
 * @returns {Promise}
 */
const enterAuditorium = async (people) => {
  let id = admitted === 0 ? 0 : admitted;
  const attendees = Array.from({ length: people }, () => {
    id += 1;
    return new Attendee(id);
  });

  /* eslint-disable no-restricted-syntax */
  const attendeePairs = [];
  for (const pair of pairsFrom(attendees)) {
    attendeePairs.push(pair);
  }

  return attendeePairs.reduce(async (ushering, pair) => {
    const readyUsher = await ushering;
    await readyUsher.usherToSeat(...pair);
    admitted += pair.length;
    return ushers.getWhoIsAvailable();
  }, ushers.getWhoIsAvailable());
};

/**
 * When trying to admit people into the hall, this helps us
 * keep track of the seating capacity as well as total number admitted so far.
 * We only attempt to admit 16 at a time or just the number needed to no exceed
 * the seating capacity
 * @returns {Number}
 */
const getNextNumberToAdmit = () => {
  const nextTotal = admitted + ADMIT_PER_TIME;
  const nextBatchSize = nextTotal <= CAPACITY ? ADMIT_PER_TIME : CAPACITY - admitted;
  goingToEvent -= nextBatchSize;
  return nextBatchSize;
};

/**
 * Determines the next valid number of people to
 * admit into the hall
 * @returns {Number}
 */
const personsToEnter = () => (admitted >= CAPACITY ? 0 : getNextNumberToAdmit());

/**
 * Relies on `personsToEnter` to recursively admit only the next valid
 * number of people into the event hall
 * @returns {Promise}
 */
export const admitPeople = async () => {
  const people = personsToEnter();
  if (people <= 0) return Promise.resolve();

  info(`${people} people are entering the hall ...`);
  await enterAuditorium(people);

  const status = admitted < CAPACITY ? `Admitted ${admitted} so far` : 'We are at capacity!';
  info(status);

  return admitPeople();
};

/**
 * Simulates arranging the seating space. We actually only create
 * the 500 row nodes, and delay creating the seat nodes until an attendee needs to be seated.
 * This helps ensure we don't start the app with 8k seat nodes in the DOM
 *
 * Each side has 250 rows and both contain a row-0 (the first row)
 * and up to a row-249 (the last row)
 * @returns {Promise}
 */
const arrangeSeating = async () => {
  const rowsPerSide = Math.floor(TOTAL_ROWS / 2);
  const [leftSide, rightSide] = selectAll('[data-seating-side]');

  const makeRowPair = (rowIndex) => {
    const row = document.createElement('div');
    row.classList.add('row');
    row.setAttribute(`data-row-${rowIndex}`, '');
    return [row, row.cloneNode()];
  };

  const rowCreationTasks = Array.from({ length: rowsPerSide }, (_, index) => {
    const [leftRow, rightRow] = makeRowPair(index);
    return () => {
      leftSide.appendChild(leftRow);
      rightSide.appendChild(rightRow);
    };
  });

  return rAFQueue(...rowCreationTasks);
};

/**
 * Source for 2 to 6 ushers for any given event
 * @returns {Array} An array of ushers
 */
const findUshersForEvent = () => {
  const howManyUshers = random({ max: 6, min: 2 });
  const ushersToday = new Ushering({
    usherQty: howManyUshers,
    hallCapacity: CAPACITY,
    seatsPerRow: SEATS_PER_ROW,
    totalRows: TOTAL_ROWS
  });
  info(`${howManyUshers} usher(s) are available today ...`);
  return ushersToday;
};

/**
 * Secures a list of ushering staff, and prepares the seating space
 * @returns {Promise}
 */
const getAuditoriumReady = async () => {
  info("Getting ready for today's event ...");
  ushers = findUshersForEvent();
  return arrangeSeating();
};

export const init = async () => {
  goingToEvent = random({ max: CAPACITY, min: 250 });
  info(`We hear ~${(goingToEvent / 1000).toFixed(1)}k people are showing up for today's event ...`);

  info('FYI, the hall has the following configuration:');
  /* eslint-disable no-console */
  console.table({
    CAPACITY,
    TOTAL_ROWS,
    SEATS_PER_ROW,
    ADMIT_PER_TIME
  });

  return getAuditoriumReady();
};

export const doorsOpen = () => {
  info('Event Started');

  const startedAt = Date.now();
  admitPeople().then(() => {
    const elapsedTime = (Date.now() - startedAt) / (1000 * 60);
    info(`We got all ${admitted} seated in roughly ${elapsedTime.toFixed(2)} minutes!`);

    if (admitted < CAPACITY) {
      info(`Hopefully, ${CAPACITY - admitted} more people will be at the next event`);
    }

    if (goingToEvent >= 1) {
      info(`Unfortunately, we had to turn away ${goingToEvent} people`);
    }
  });
};
