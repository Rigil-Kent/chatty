const scribble = require('scribbletune');


let c = scribble.clip({
    notes: ['c4']
});


let c_scale = scribble.clip({
    notes: ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5'],
    pattern: 'x---xxxxxxx---------'
});


let new_c_scale = scribble.clip({
    notes: scribble.scale('C4 minor'),
    pattern: 'xxxxxxxx'
});


let song = scribble.clip({
    notes: scribble.getChordsByProgression('C4 major', 'i IV v ii'),
    pattern: 'x_'.repeat(4) + 'x_________'
});


let loop = scribble.clip({
    notes: scribble.arp('Cm FM Cm G#m Dm Cm'),
    pattern: 'x'.repeat(64),
    subdiv: '16n'
});

// scribble.midi(c_scale);
console.log(scribble.getChordDegrees('dorian'));
scribble.midi(loop, 'src/experimental/loop.mid');