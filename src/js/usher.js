import Person from './person.js';
import { isEven, intFromId, logs } from './utils.js';

const { info } = logs;

class Usher extends Person {
  constructor(id, { capacity, seatsPerRow, totalRows }) {
    super(`Usher-${id}`);
    this.seatingCapacity = capacity;
    this.seatsPerRow = seatsPerRow;
    this.totalRows = totalRows;
  }

  async usherToSeat(...attendees) {
    const gettingSeated = attendees.reduce((seatingTasks, attendee) => {
      info(`${this} handling ${attendee}`);

      /** placement formula
       * =========================
       * if idNum is 17
       * side = 17 % 2 === 0 ? 'right' : 'left';
       * so, side will be 'left'
       * seatNum = Math.floor(17 / 2)
       * so, seatNum will be 9
       * rowIndex = Math.floor(9 / 16)
       * so, rowIndex will be 0
       * i.e attendee-17 will occupy seat-9 in row 0 on the left side
       */

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
