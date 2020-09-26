import Usher from './usher.js';
import { logs } from './utils.js';

const { info } = logs;

/**
 * Coordinate "provisioning" ushers and figuring
 * out which of them is ready to admit attendees
 * when the system needs to do so
 */
class Ushering {
  /**
   * Creates the ushering sub-system
   * @param {Object} spec
   */
  constructor(spec) {
    const {
      usherQty, hallCapacity, seatsPerRow, totalRows
    } = spec;

    this.ushersPool = Array.from(
      { length: usherQty },
      (_, i) => new Usher(i + 1, { hallCapacity, seatsPerRow, totalRows })
    );
  }

  /**
   * Goes over the pool of ushers for the event
   * to determine which one will be available to
   * handle the next ushering task
   * @returns {Usher}
   */
  async getWhoIsAvailable() {
    const ushersToday = this.ushersPool.map((usher) => usher.getAttention());
    const readyUsher = await Promise.race(ushersToday);
    info(`${readyUsher} is ready ...`);
    return readyUsher;
  }
}

export default Ushering;
