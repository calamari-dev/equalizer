import { CascadedFilter } from "./CascadedFilter";
import FFT from "fft.js";

const fft = new FFT(1024);

const impulse = (t: number) => {
  return t === 0 ? 1 : 0;
};

const dB2amp = (x: number) => {
  return 10 ** (x / 20);
};

it("Cascaded Filter", () => {
  const filter = new CascadedFilter({
    sampleRate: 44100,
    filters: [
      {
        type: "equalizer",
        frequency: 7350,
        gain: 2,
        Q: 8,
      },
      {
        type: "equalizer",
        frequency: 14700,
        gain: 3,
        Q: 8,
      },
    ],
  });

  const ir: number[] = [];

  for (let t = 0; t < 1024; t++) {
    ir[t] = filter.next(impulse(t));
  }

  const IR = fft.createComplexArray();
  fft.realTransform(IR, ir);

  const L = Math.hypot(IR[0], IR[1]);
  const ML = Math.hypot(IR[342], IR[343]);
  const MH = Math.hypot(IR[682], IR[683]);
  const H = Math.hypot(IR[1022], IR[1023]);

  expect(L).toBeCloseTo(1, 2);
  expect(ML).toBeCloseTo(dB2amp(2), 2);
  expect(MH).toBeCloseTo(dB2amp(3), 2);
  expect(H).toBeCloseTo(1, 2);
});
