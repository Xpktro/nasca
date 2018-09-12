import MIDIHandler from './MidiHandler';

const log = (...message) => {
  var element = document.getElementById('logs');
  element.innerHTML += message.join(' ') + '\n';
  element.scrollTop = element.scrollHeight;
}

window.onload = () => {
  window.handler = new MIDIHandler(
    document.getElementById('input-devices'),
    document.getElementById('output-devices'),
    document.getElementById('note'),
    document.getElementById('frequency'),
    document.getElementById('set-note'),
    log
  );
}