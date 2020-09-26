import Person from './person.js';
import {
  logs, rAF, select, intFromId
} from './utils.js';

const { info } = logs;

/**
 * An object represnting an attendee in the system
 */
class Attendee extends Person {
  /**
   * Creates a new attendee object in the system, and gives
   * it an id formatted as 'Attendee-N', where N is their id
   * @param {String} id the unique user id for this attendee
   */
  constructor(id) {
    super(`Attendee-${id}`);
  }

  /**
   * Gets the attendee seated in the seat specified by `whereToSeat`
   * @param {Object} whereToSeat object with `hallSide`, `rowIndex`, and `seatNum`
   * properties specifying where this attendee is to seat
   * @returns {Promise}
   */
  async goGetSeated(whereToSeat) {
    const { hallSide, rowIndex, seatNum } = whereToSeat;
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
