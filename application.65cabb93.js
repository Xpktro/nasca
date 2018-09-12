// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"js/NascaScale.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NascaScale = function () {
  function NascaScale() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$fundamentalFrequ = _ref.fundamentalFrequency,
        fundamentalFrequency = _ref$fundamentalFrequ === undefined ? 440 : _ref$fundamentalFrequ,
        _ref$fundamentalNote = _ref.fundamentalNote,
        fundamentalNote = _ref$fundamentalNote === undefined ? 69 : _ref$fundamentalNote,
        _ref$pitchBendRangeCe = _ref.pitchBendRangeCents,
        pitchBendRangeCents = _ref$pitchBendRangeCe === undefined ? 200 : _ref$pitchBendRangeCe;

    _classCallCheck(this, NascaScale);

    this.fundamentalFrequency = fundamentalFrequency;
    this.fundamentalNote = fundamentalNote;
    this.pitchBendRangeCents = pitchBendRangeCents;
    this.intervals = [0, 68.0, 138.0, 211.0, 288.0, 368.0, 452.0, 540.0, 633.0, 731.0, 835.0, 946.0, 1064.0];
  }

  _createClass(NascaScale, [{
    key: "mod",
    value: function mod(n, m) {
      return (n % m + m) % m;
    }
  }, {
    key: "frequencyToMIDI",
    value: function frequencyToMIDI(frequency) {
      var preciseNote = Math.log(frequency / 440.0) / Math.log(2) * 12 + 69;
      var note = Math.round(preciseNote);
      var cents = Math.log(preciseNote / note) / Math.log(2) * 1200;
      var pitchBend = Math.round(8192 * cents / this.pitchBendRangeCents) + 8192;
      return [note, pitchBend];
    }

    // def _frequency_to_note_and_pitch_bend(self, frequency):
    //   base_frequency = self.tuning_frequency / (2.0 ** (self.tuning_note / 12.0))
    //   precise_note = 12.0 * math.log(frequency / base_frequency, 2)
    //   note = round(precise_note)
    //   pb = round(819200.0 * (precise_note - note) / ((100.0 * self.pitch_bend_range_semitones) + self.pitch_bend_range_cents)) + 8192
    //   return int(note), int(pb)

    // Adds cents to given frequency

  }, {
    key: "addCents",
    value: function addCents(frequency, cents) {
      return frequency * Math.pow(2, cents / 1200);
    }
  }, {
    key: "noteToNasca",
    value: function noteToNasca(note, pitchbend) {
      var relativeNote = note - this.fundamentalNote;
      var degree = this.mod(relativeNote, this.intervals.length);
      var octave = Math.floor(relativeNote / this.intervals.length);

      var frequency = this.addCents(this.fundamentalFrequency * Math.pow(2, octave), this.intervals[degree]);
      console.log(frequency);
      return this.frequencyToMIDI(frequency);
    }
  }]);

  return NascaScale;
}();

exports.default = NascaScale;
},{}],"js/MidiHandler.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _NascaScale = require('./NascaScale');

var _NascaScale2 = _interopRequireDefault(_NascaScale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MIDIHandler = function () {
  function MIDIHandler(inputDeviceSelector, outputDeviceSelector, noteDisplay, frequencyDisplay, fundamentalNoteButton) {
    var _this = this;

    var log = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : console.log;

    _classCallCheck(this, MIDIHandler);

    this.scale = new _NascaScale2.default();
    this.inputDeviceSelector = inputDeviceSelector;
    this.inputDeviceSelector.onchange = function () {
      return _this.useSelectedDevices();
    };
    this.outputDeviceSelector = outputDeviceSelector;
    this.outputDeviceSelector.onchange = function () {
      return _this.useSelectedDevices();
    };
    this.noteDisplay = noteDisplay;
    this.frequencyDisplay = frequencyDisplay;
    this.inputDevice = {};
    this.outputDevice = {};
    this.log = log;
    this.fundamentalNoteSet = false;
    fundamentalNoteButton.onclick = function () {
      return _this.setFundamentalNote();
    };
    this.log('Requesting Browser MIDI access...');
    navigator.requestMIDIAccess().then(function (access) {
      return _this.accessGranted(access);
    }).catch(function (error) {
      return log('Could not get browser MIDI access. Error: ', error);
    });
  }

  _createClass(MIDIHandler, [{
    key: 'accessGranted',
    value: function accessGranted(midiAccess) {
      var _this2 = this;

      this.log('MIDI access granted.');
      this.access = midiAccess;
      this.access.onstatechange = function () {
        return _this2.log('Updating device list.') || _this2.updateDevices() || _this2.useSelectedDevices();
      };
      this.updateDevices();
      this.useSelectedDevices();
    }
  }, {
    key: 'updateDevices',
    value: function updateDevices() {
      var _this3 = this;

      this.inputDeviceSelector.innerHTML = '';
      this.access.inputs.forEach(function (entry) {
        var option = document.createElement('option');
        option.value = entry.id;
        option.innerHTML = entry.name;
        if (entry.id === _this3.inputDevice.id) option.selected = true;
        _this3.inputDeviceSelector.appendChild(option);
      });

      this.outputDeviceSelector.innerHTML = '';
      this.access.outputs.forEach(function (entry) {
        var option = document.createElement('option');
        option.value = entry.id;
        option.innerHTML = entry.name;
        if (entry.id === _this3.outputDevice.id) option.selected = true;
        _this3.outputDeviceSelector.appendChild(option);
      });
    }
  }, {
    key: 'useSelectedDevices',
    value: function useSelectedDevices() {
      var _this4 = this;

      var selectedInputDevice = this.inputDeviceSelector.value;
      var selectedOutputDevice = this.outputDeviceSelector.value;
      this.inputDevice = this.access.inputs.get(selectedInputDevice);
      this.outputDevice = this.access.outputs.get(selectedOutputDevice);
      this.access.inputs.forEach(function (device) {
        return device.onmidimessage = null;
      });
      this.inputDevice.onmidimessage = function (e) {
        return _this4.onMIDIMessage(e);
      };
    }
  }, {
    key: 'midiToFrequency',
    value: function midiToFrequency(midiNote) {
      return Math.pow(2, (midiNote - 69) / 12) * 440;
    }
  }, {
    key: 'setFundamentalNote',
    value: function setFundamentalNote() {
      if (this.fundamentalNoteSet) return;
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

  }, {
    key: 'onMIDIMessage',
    value: function onMIDIMessage(midiEvent) {
      if (
      // Ignore pitch bend range changes
      (midiEvent.data[0] & 0xB0) === 0xB0 && [6, 38].includes(midiEvent.data[1]) ||
      // Ignore pitch bend messages
      (midiEvent.data[0] & 0xE0) === 0xE0) {
        return;
      }

      console.log('data:', midiEvent.data, 'hex:', midiEvent.data[0].toString(16), midiEvent.data[1].toString(16), midiEvent.data[2].toString(16));
      var noteOn = (midiEvent.data[0] & 0x90) === 0x90;
      var noteOff = (midiEvent.data[0] & 0x80) === 0x80;

      if (noteOn && this.fundamentalNoteSet) {
        this.fundamentalNoteSet = false;
        this.scale.fundamentalNote = midiEvent.data[1];
        this.scale.fundamentalFrequency = this.midiToFrequency(midiEvent.data[1]);
        this.noteDisplay.innerHTML = this.scale.fundamentalNote;
        this.frequencyDisplay.innerHTML = this.scale.fundamentalFrequency.toFixed(2);
        this.log('Fundamental note set:', this.scale.fundamentalNote, '(' + this.scale.fundamentalFrequency.toFixed(2) + 'Hz)');
      } else if (noteOn || noteOff) {
        var _scale$noteToNasca = this.scale.noteToNasca(midiEvent.data[1]),
            _scale$noteToNasca2 = _slicedToArray(_scale$noteToNasca, 2),
            note = _scale$noteToNasca2[0],
            pitchbend = _scale$noteToNasca2[1];

        // Only set pitch bend on Note On message


        if (noteOn) {
          var finePitchBend = pitchbend & 127;
          var coarsePitchBend = pitchbend >> 7 & 127;
          var channel = midiEvent.data[0] & 15;
          // Send channel pitch bend
          this.outputDevice.send([0xE0 + channel, finePitchBend, coarsePitchBend]);
        }

        // Replace with computed note
        this.outputDevice.send([midiEvent.data[0], note, midiEvent.data[2]]);
      } else {
        this.outputDevice.send(midiEvent.data);
      }
    }
  }]);

  return MIDIHandler;
}();

exports.default = MIDIHandler;
},{"./NascaScale":"js/NascaScale.js"}],"js/application.js":[function(require,module,exports) {
'use strict';

var _MidiHandler = require('./MidiHandler');

var _MidiHandler2 = _interopRequireDefault(_MidiHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = function log() {
  for (var _len = arguments.length, message = Array(_len), _key = 0; _key < _len; _key++) {
    message[_key] = arguments[_key];
  }

  var element = document.getElementById('logs');
  element.innerHTML += message.join(' ') + '\n';
  element.scrollTop = element.scrollHeight;
};

window.onload = function () {
  window.handler = new _MidiHandler2.default(document.getElementById('input-devices'), document.getElementById('output-devices'), document.getElementById('note'), document.getElementById('frequency'), document.getElementById('set-note'), log);
};
},{"./MidiHandler":"js/MidiHandler.js"}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '65155' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/application.js"], null)
//# sourceMappingURL=/application.65cabb93.map