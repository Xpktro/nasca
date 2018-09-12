import NascaScale from './NascaScale';

class MIDIHandler {
  constructor(inputDeviceSelector, outputDeviceSelector, noteDisplay, frequencyDisplay, fundamentalNoteButton, log = console.log) {
    this.scale = new NascaScale();
    this.inputDeviceSelector = inputDeviceSelector;
    this.inputDeviceSelector.onchange = () => this.useSelectedDevices();
    this.outputDeviceSelector = outputDeviceSelector;
    this.outputDeviceSelector.onchange = () => this.useSelectedDevices();
    this.noteDisplay = noteDisplay;
    this.frequencyDisplay = frequencyDisplay;
    this.inputDevice = {};
    this.outputDevice = {};
    this.log = log;
    this.fundamentalNoteSet = false;
    fundamentalNoteButton.onclick = () => this.setFundamentalNote();
    this.log('Requesting Browser MIDI access...');
    navigator
      .requestMIDIAccess()
      .then((access) => this.accessGranted(access))
      .catch((error) => log('Could not get browser MIDI access. Error: ', error));
  }

  accessGranted(midiAccess) {
    this.log('MIDI access granted.')
    this.access = midiAccess;
    this.access.onstatechange = () => this.log('Updating device list.') || this.updateDevices() || this.useSelectedDevices();
    this.updateDevices();
    this.useSelectedDevices();
  }

  updateDevices() {
    this.inputDeviceSelector.innerHTML = '';
    this.access.inputs.forEach((entry) => {
      const option = document.createElement('option');
      option.value = entry.id;
      option.innerHTML = entry.name;
      if(entry.id === this.inputDevice.id) option.selected = true;
      this.inputDeviceSelector.appendChild(option);
    });

    this.outputDeviceSelector.innerHTML = '';
    this.access.outputs.forEach((entry) => {
      const option = document.createElement('option');
      option.value = entry.id;
      option.innerHTML = entry.name;
      if(entry.id === this.outputDevice.id) option.selected = true;
      this.outputDeviceSelector.appendChild(option);
    });
  }

  useSelectedDevices() {
    const selectedInputDevice = this.inputDeviceSelector.value;
    const selectedOutputDevice = this.outputDeviceSelector.value;
    this.inputDevice = this.access.inputs.get(selectedInputDevice);
    this.outputDevice = this.access.outputs.get(selectedOutputDevice);
    this.access.inputs.forEach((device) => device.onmidimessage = null);
    this.inputDevice.onmidimessage = (e) => this.onMIDIMessage(e);
  }

  midiToFrequency(midiNote) {
    return Math.pow(2, (midiNote - 69) / 12) * 440;
  }

  setFundamentalNote() {
    if(this.fundamentalNoteSet) return;
    this.fundamentalNoteSet = true;
    this.log('Press the note key you want to set as the new fundamental tone.');
  }

  // def note_on(self, frequency):
  //     note, pitch_bend = self._frequency_to_note_and_pitch_bend(frequency)
  //     channel = self._get_channel()
  //     fine_pitch_bend = pitch_bend & 127
  //     corse_pitch_bend = (pitch_bend >> 7) & 127
  //     #set channel pitch bend
  //     self._write(0xE0+channel,fine_pitch_bend,corse_pitch_bend)
  //     #play note
  //     self._write(0x90+channel,note,self.velocity)
  //     return NoteOn(channel, note, pitch_bend, frequency)

  onMIDIMessage(midiEvent) {
    if(
      // Ignore pitch bend range changes
      (midiEvent.data[0] & 0xB0) === 0xB0 && [6, 38].includes(midiEvent.data[1])
      ||
      // Ignore pitch bend messages
      ((midiEvent.data[0] & 0xE0) === 0xE0)
    ) {
      return;
    }

    console.log('data:', midiEvent.data, 'hex:', midiEvent.data[0].toString(16), midiEvent.data[1].toString(16), midiEvent.data[2].toString(16));
    const noteOn = (midiEvent.data[0] & 0x90) === 0x90;
    const noteOff = (midiEvent.data[0] & 0x80) === 0x80;

    if(noteOn && this.fundamentalNoteSet) {
      this.fundamentalNoteSet = false;
      this.scale.fundamentalNote = midiEvent.data[1];
      this.scale.fundamentalFrequency = this.midiToFrequency(midiEvent.data[1]);
      this.noteDisplay.innerHTML = this.scale.fundamentalNote;
      this.frequencyDisplay.innerHTML = this.scale.fundamentalFrequency.toFixed(2);
      this.log('Fundamental note set:', this.scale.fundamentalNote, `(${ this.scale.fundamentalFrequency.toFixed(2)}Hz)`);
    } else if(noteOn || noteOff) {
      const [note, pitchbend] = this.scale.noteToNasca(midiEvent.data[1]);

      // Only set pitch bend on Note On message
      if(noteOn) {
        const finePitchBend = pitchbend & 127;
        const coarsePitchBend = (pitchbend >> 7) & 127;
        const channel = midiEvent.data[0] & 15;
      // Send channel pitch bend
        this.outputDevice.send([0xE0 + channel, finePitchBend, coarsePitchBend]);
      }

      // Replace with computed note
      this.outputDevice.send([midiEvent.data[0], note, midiEvent.data[2]])
    } else {
      this.outputDevice.send(midiEvent.data);
    }
  }
}

export default MIDIHandler;