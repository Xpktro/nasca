class NascaScale {
  constructor({fundamentalFrequency = 440, fundamentalNote = 69, pitchBendRangeCents = 200} = {}) {
    this.fundamentalFrequency = fundamentalFrequency;
    this.fundamentalNote = fundamentalNote;
    this.pitchBendRangeCents = pitchBendRangeCents;
    this.intervals = [
      0,
      68.0,
      138.0,
      211.0,
      288.0,
      368.0,
      452.0,
      540.0,
      633.0,
      731.0,
      835.0,
      946.0,
      1064.0,
      // 1191.0,
    ];
  }

  mod(n, m) {
    return ((n % m) + m) % m;
  }

  frequencyToMIDI(frequency) {
    const preciseNote = Math.log(frequency/440.0) / Math.log(2) * 12 + 69;
    const note = Math.round(preciseNote);
    const cents = Math.log(preciseNote/note) / Math.log(2) * 1200;
    const pitchBend = Math.round(8192 * cents/this.pitchBendRangeCents) + 8192;
    return [note, pitchBend];
  }

  // def _frequency_to_note_and_pitch_bend(self, frequency):
  //   base_frequency = self.tuning_frequency / (2.0 ** (self.tuning_note / 12.0))
  //   precise_note = 12.0 * math.log(frequency / base_frequency, 2)
  //   note = round(precise_note)
  //   pb = round(819200.0 * (precise_note - note) / ((100.0 * self.pitch_bend_range_semitones) + self.pitch_bend_range_cents)) + 8192
  //   return int(note), int(pb)

  // Adds cents to given frequency
  addCents(frequency, cents) {
    return frequency * Math.pow(2, cents/1200);
  }

  noteToNasca(note, pitchbend) {
    const relativeNote = note - this.fundamentalNote;
    const degree = this.mod(relativeNote, this.intervals.length);
    const octave = Math.floor(relativeNote / this.intervals.length);

    const frequency = this.addCents(this.fundamentalFrequency * Math.pow(2, octave), this.intervals[degree]);
    console.log(frequency);
    return this.frequencyToMIDI(frequency);
  }
}

export default NascaScale;