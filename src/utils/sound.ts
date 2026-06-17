/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a cute retro synth "meow" sound
 */
export function playMeowSynth() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Pitch envelope: starts medium-low, rises rapidly, then falls slightly
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now); // Middle E-ish
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.12); // Sweep up rapidly
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.35); // Gentle slide down

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch (err) {
    console.warn('Audio play failure:', err);
  }
}

/**
 * Play a double retro puppy "bark" sound
 */
export function playBarkSynth() {
  try {
    const ctx = getAudioContext();
    
    const playSingleBark = (startTime: number, duration: number, isHigh: boolean) => {
      const osc = ctx.createOscillator();
      const biquad = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();

      osc.type = 'sawtooth';
      
      const startFreq = isHigh ? 350 : 250;
      const endFreq = isHigh ? 130 : 90;

      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

      // Low pass to make it sound richer and less harsh
      biquad.type = 'lowpass';
      biquad.frequency.setValueAtTime(1000, startTime);
      biquad.frequency.exponentialRampToValueAtTime(400, startTime + duration);

      gainNode.gain.setValueAtTime(0.001, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(biquad);
      biquad.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    };

    const now = ctx.currentTime;
    // Bark-Bark! Two quick pulses
    playSingleBark(now, 0.12, false);
    playSingleBark(now + 0.16, 0.14, true);
  } catch (err) {
    console.warn('Audio play failure:', err);
  }
}

/**
 * Play a retro sci-fi electronic "charge" sound
 */
export function playChargeSynth() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 0.6;

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + duration);

    // Complement node for cyber harmonic texture
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(75, now);
    osc2.frequency.setValueAtTime(440, now + duration);

    filter.type = 'peaking';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(1500, now + duration);
    filter.Q.setValueAtTime(4, now);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.06, now + duration - 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration);
    osc2.stop(now + duration);
  } catch (err) {
    console.warn('Audio play failure:', err);
  }
}

/**
 * Play an elegant cash register coin intake sound / OS Coins gain
 */
export function playCoinSynth() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const chime1 = ctx.createOscillator();
    const chime2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    chime1.type = 'sine';
    chime1.frequency.setValueAtTime(987.77, now); // B5
    chime1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    chime2.type = 'sine';
    chime2.frequency.setValueAtTime(1174.66, now + 0.04); // D6
    chime2.frequency.setValueAtTime(1567.98, now + 0.12); // G6

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.05, now + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    chime1.connect(gainNode);
    chime2.connect(gainNode);
    gainNode.connect(ctx.destination);

    chime1.start(now);
    chime2.start(now);
    chime1.stop(now + 0.4);
    chime2.stop(now + 0.4);
  } catch (err) {
    console.warn('Audio play failure:', err);
  }
}

/**
 * Play a satisfying level-up victory fanfare
 */
export function playLevelUpSynth() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    };

    // Major 7th chord progression: C, E, G, B, upper C
    playTone(261.63, now, 0.45);        // C4
    playTone(329.63, now + 0.1, 0.45);  // E4
    playTone(392.00, now + 0.2, 0.45);  // G4
    playTone(493.88, now + 0.3, 0.45);  // B4
    playTone(523.25, now + 0.4, 0.7);   // C5 (Peak high)
  } catch (err) {
    console.warn('Audio play failure:', err);
  }
}

/**
 * Play a futuristic card swiping or flipping sound
 */
export function playCardSwipeSynth() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 0.25;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + duration);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch (err) {
    console.warn('Audio play failure:', err);
  }
}

/**
 * Play solid negative feedback warning
 */
export function playErrorBuzz() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.setValueAtTime(100, now + 0.15);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (err) {
    console.warn('Audio play failure:', err);
  }
}
