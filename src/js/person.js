import { random } from './utils.js';

class Person {
  constructor(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  /**
     * In life, at any given point in time, some people are
     * slow and others are faster. This methond is used to signal
     * to the system that this person is done with their current task
     * e.g getting seated (in the case of a attendee) or
     * placing someone on a seat (in the case of an usher).
     * They are only available for the next task (if any) when the current task is done.
     */
  async getAttention() {
    const thisPerson = this;
    const delay = random({ max: 1200, min: 200 });
    return new Promise((resolve) => {
      // console.log(`${thisPerson} is busy for ${delay}ms`);
      setTimeout(() => resolve(thisPerson), delay);
    });
  }
}

Person.prototype.toString = function personToString() {
  return `[${this.getId()}]`;
};

export default Person;
