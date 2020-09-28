import { init, doorsOpen } from './auditorium.js';

const startApp = () => {
  init().then(() => doorsOpen());
};

document.addEventListener('DOMContentLoaded', startApp);
