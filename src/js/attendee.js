import Person from './person.js';
import {
  logs, rAF, select, intFromId
} from './utils.js';

const { info } = logs;

class Attendee extends Person {
  constructor(id) {
    super(`Attendee-${id}`);
  }

  async goGetSeated({ hallSide, rowIndex, seatNum }) {
    info(`${this} is getting seated ...`);

    // start getting seated
    await this.getAttention();

    const idNum = intFromId(this.getId());
    rAF().then(() => {
      const row = select(`[data-rows-${hallSide}] [data-row-${rowIndex}]`);
      const seating = document.createElement('div');
      seating.classList.add('seat', `seat-${seatNum}`);
      seating.setAttribute(`data-seating-attendee-${idNum}`, '');
      row.appendChild(seating);
    });

    // make sure, then signal you are seated!
    await this.getAttention();
    info(`${this} is now seated!`);
    return Promise.resolve();
  }
}

export default Attendee;
