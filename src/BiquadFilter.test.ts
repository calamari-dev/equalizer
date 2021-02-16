import { BiquadFilter } from "./BiquadFilter";
import FFT from "fft.js";

const fft = new FFT(1024);

const impulse = (t: number) => {
  return t === 0 ? 1 : 0;
};

const dB2amp = (x: number) => {
  return 10 ** (x / 20);
};

describe("Biquad Filter", () => {
  it("Highpass Filter", () => {
    const filter = new BiquadFilter({
      type: "highpass",
      sampleRate: 44100,
      frequency: 11025,
      gain: 2,
      Q: 1,
    });

    const ir: number[] = [];

    for (let t = 0; t < 1024; t++) {
      ir[t] = filter.next(impulse(t));
    }

    const IR = fft.createComplexArray();
    fft.realTransform(IR, ir);

    const L = Math.hypot(IR[0], IR[1]);
    const H = Math.hypot(IR[1022], IR[1023]);

    expect(L).toBeCloseTo(0, 2);
    expect(H).toBeCloseTo(dB2amp(2), 2);
  });

  it("Lowpass Filter", () => {
    const filter = new BiquadFilter({
      type: "lowpass",
      sampleRate: 44100,
      frequency: 11025,
      gain: 2,
      Q: 1,
    });

    const ir: number[] = [];

    for (let t = 0; t < 1024; t++) {
      ir[t] = filter.next(impulse(t));
    }

    const IR = fft.createComplexArray();
    fft.realTransform(IR, ir);

    const L = Math.hypot(IR[0], IR[1]);
    const H = Math.hypot(IR[1022], IR[1023]);

    expect(L).toBeCloseTo(dB2amp(2), 2);
    expect(H).toBeCloseTo(0, 2);
  });

  it("Bandpass Filter", () => {
    const filter = new BiquadFilter({
      type: "bandpass",
      sampleRate: 44100,
      frequency: 11025,
      gain: 2,
      Q: 1,
    });

    const ir: number[] = [];

    for (let t = 0; t < 1024; t++) {
      ir[t] = filter.next(impulse(t));
    }

    const IR = fft.createComplexArray();
    fft.realTransform(IR, ir);

    const L = Math.hypot(IR[0], IR[1]);
    const M = Math.hypot(IR[512], IR[513]);
    const H = Math.hypot(IR[1022], IR[1023]);

    expect(L).toBeCloseTo(0, 2);
    expect(M).toBeCloseTo(dB2amp(2), 2);
    expect(H).toBeCloseTo(0, 2);
  });

  it("Bandstop Filter", () => {
    const filter = new BiquadFilter({
      type: "bandstop",
      sampleRate: 44100,
      frequency: 11025,
      gain: 2,
      Q: 1,
    });

    const ir: number[] = [];

    for (let t = 0; t < 1024; t++) {
      ir[t] = filter.next(impulse(t));
    }

    const IR = fft.createComplexArray();
    fft.realTransform(IR, ir);

    const L = Math.hypot(IR[0], IR[1]);
    const M = Math.hypot(IR[512], IR[513]);
    const H = Math.hypot(IR[1022], IR[1023]);

    expect(L).toBeCloseTo(dB2amp(2), 2);
    expect(M).toBeCloseTo(0, 2);
    expect(H).toBeCloseTo(dB2amp(2), 2);
  });

  it("Equalizer (gain > 0)", () => {
    const filter = new BiquadFilter({
      type: "equalizer",
      sampleRate: 44100,
      frequency: 11025,
      gain: 2,
      Q: 1,
    });

    const ir: number[] = [];

    for (let t = 0; t < 1024; t++) {
      ir[t] = filter.next(impulse(t));
    }

    const IR = fft.createComplexArray();
    fft.realTransform(IR, ir);

    const L = Math.hypot(IR[0], IR[1]);
    const M = Math.hypot(IR[512], IR[513]);
    const H = Math.hypot(IR[1022], IR[1023]);

    expect(L).toBeCloseTo(1, 2);
    expect(M).toBeCloseTo(dB2amp(2), 2);
    expect(H).toBeCloseTo(1, 2);
  });

  it("Equalizer (gain < 0)", () => {
    const filter = new BiquadFilter({
      type: "equalizer",
      sampleRate: 44100,
      frequency: 11025,
      gain: -2,
      Q: 1,
    });

    const ir: number[] = [];

    for (let t = 0; t < 1024; t++) {
      ir[t] = filter.next(impulse(t));
    }

    const IR = fft.createComplexArray();
    fft.realTransform(IR, ir);

    const L = Math.hypot(IR[0], IR[1]);
    const M = Math.hypot(IR[512], IR[513]);
    const H = Math.hypot(IR[1022], IR[1023]);

    expect(L).toBeCloseTo(1, 2);
    expect(M).toBeCloseTo(dB2amp(-2), 2);
    expect(H).toBeCloseTo(1, 2);
  });
});
