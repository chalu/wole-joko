import { init, doorsOpen } from './auditorium.js';

const startApp = () => {
  init().then(() => doorsOpen());
  
  document.body.addEventListener('click', () => {
    const audio = document.querySelector('audio');
    if (!audio) return;

    if (audio.currentTime <= 0 || audio.paused) {
      audio.play();
      return;
    }

    audio.pause();
  });
};

document.addEventListener('DOMContentLoaded', startApp);
