import Person from './person.js';
import { isEven, intFromId, logs } from './utils.js';

const { info } = logs;

/**
 * An object representing an usher in the system
 */
class Usher extends Person {
  /**
   * Creates a new usher object in the system, and gives
   * it an id formatted as 'Usher-N', where N is their id
   * @param {String} id the unique user id for this usher
   * @param {Object} hallSpec an object with represnting the specs
   * of the event hall
   */
  constructor(id, hallSpec) {
    super(`Usher-${id}`);

    const { hallCapacity, seatsPerRow, totalRows } = hallSpec;
    this.hallCapacity = hallCapacity;
    this.seatsPerRow = seatsPerRow;
    this.totalRows = totalRows;
  }

  /**
   * Places a pair of attendees to their seats
   * ```
   * Placement Formula
   * ======================
   * if we have Attendee-17
   * side = 17 % 2 === 0 ? 'right' : 'left';
   * so, side will be 'left'
   * seatNum = Math.floor(17 / 2)
   * so, seatNum will be 9
   * rowIndex = Math.floor(9 / 16)
   * so, rowIndex will be 0
   * i.e Attendee-17 will occupy seat-9 in row 0 on the left side of the hall!
   * ```
   *
   * @param {Attendee} attendees a variable list of attendees. 2 ideally.
   * @returns {Promise}
   */
  async usherToSeat(...attendees) {
    const gettingSeated = attendees.reduce((seatingTasks, attendee) => {
      info(`${this} handling ${attendee}`);

      const idNum = intFromId(attendee.getId());
      const hallSide = isEven(idNum) ? 'right' : 'left';
      const seatNum = Math.floor(idNum / 2);
      let rowIndex = Math.floor(seatNum / this.seatsPerRow);

      // ensures that when idNum is a multiple of seatsPerRow,
      // that we don't prematurely move the last seating on a given
      // row to the next row
      if (hallSide === 'right' && seatNum % this.seatsPerRow === 0) {
        rowIndex -= 1;
      }

      const gettingSeatedTask = attendee.goGetSeated({ hallSide, rowIndex, seatNum });
      seatingTasks.push(gettingSeatedTask);
      return seatingTasks;
    }, []);

    return Promise.all(gettingSeated);
  }
}

export default Usher;
