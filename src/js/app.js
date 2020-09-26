import Ushering from './ushering.js';
import Attendee from './attendee.js';
import {
  random, logs, selectAll, rAFQueue, pairsFrom
} from './utils.js';

let ushers;
let admitted = 0;
let goingToChruch = 0;
const { info } = logs;

const CAPACITY = 8000;
const TOTAL_ROWS = 500;
const SEATS_PER_ROW = 16;
const ADMIT_PER_TIME = 16;

const findUshersForEvent = () => {
  const howManyUshers = random({ max: 6, min: 2 });
  const ushersToday = new Ushering({
    usherQty: howManyUshers,
    capacity: CAPACITY,
    seatsPerRow: SEATS_PER_ROW,
    totalRows: TOTAL_ROWS
  });
  info(`${howManyUshers} usher(s) are available today ...`);
  return ushersToday;
};

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

const getNextNumberToAdmit = () => {
  const nextTotal = admitted + ADMIT_PER_TIME;
  const nextBatchSize = nextTotal <= CAPACITY ? ADMIT_PER_TIME : CAPACITY - admitted;
  goingToChruch -= nextBatchSize;
  return nextBatchSize;
};

const personsToEnter = () => (admitted >= CAPACITY ? 0 : getNextNumberToAdmit());

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

const admitPeople = async () => {
  const people = personsToEnter();
  if (people <= 0) return Promise.resolve();

  info(`${people} people are entering the hall ...`);
  await enterAuditorium(people);

  const status = admitted < CAPACITY ? `Admitted ${admitted} so far` : 'We are at capacity!';
  info(status);

  return admitPeople();
};

const getAuditoriumReady = async () => {
  info("Getting ready for today's event ...");
  ushers = findUshersForEvent();
  return arrangeSeating();
};

const startApp = () => {
  goingToChruch = random({ max: CAPACITY, min: 250 });
  info(`We hear ~${(goingToChruch / 1000).toFixed(1)}k people are showing up for today's event ...`);

  info(`FYI, the hall has the following configuration:`);
  console.table({
    CAPACITY, TOTAL_ROWS, SEATS_PER_ROW, ADMIT_PER_TIME
  });


  // getAuditoriumReady().then(() => {
  //   info('Event Started');

  //   const startedAt = Date.now();
  //   admitPeople().then(() => {
  //     const elapsedTime = (Date.now() - startedAt) / (1000 * 60);
  //     info(`We got all ${admitted} seated in roughly ${elapsedTime.toFixed(2)} minutes!`);

  //     if (admitted < CAPACITY) {
  //       info(`Hopefully, ${CAPACITY - admitted} more people will be at the next event`);
  //     }

  //     if (goingToChruch >= 1) {
  //       info(`Unfortunately, we had to turn away ${goingToChruch} people`);
  //     }
  //   });
  // });
};

document.addEventListener('DOMContentLoaded', startApp);
