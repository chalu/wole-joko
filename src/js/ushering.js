import Usher from './usher.js';
import { logs } from './utils.js';

const { info } = logs;

class Ushering {
  constructor({
    usherQty, capacity, seatsPerRow, totalRows
  }) {
    this.ushersPool = Array.from(
      { length: usherQty },
      (_, i) => new Usher(i + 1, { capacity, seatsPerRow, totalRows })
    );
  }

  async getWhoIsAvailable() {
    const ushersToday = this.ushersPool.map((usher) => usher.getAttention());
    const readyUsher = await Promise.race(ushersToday);
    info(`${readyUsher} is ready ...`);
    return readyUsher;
  }
}

export default Ushering;
