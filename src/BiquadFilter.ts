import { BiquadFilterConfig } from "./types";

export class BiquadFilter {
  X: Float64Array;
  Y: Float64Array;
  FF: Readonly<Float64Array>;
  FB: Readonly<Float64Array>;

  constructor({ type, sampleRate, frequency, gain, Q }: BiquadFilterConfig) {
    const FF = new Float64Array(3);
    const FB = new Float64Array(3);

    this.X = new Float64Array(2);
    this.Y = new Float64Array(2);
    this.FF = FF;
    this.FB = FB;

    const T = 1 / sampleRate;
    const W = (2 / T) * Math.tan(Math.PI * frequency * T);
    const G = 10 ** (gain / 20);

    let [a0, a1, a2] = [0, 0, 0];
    let b1 = W / Q;
    const b2 = W ** 2;

    if (type === "equalizer" && G < 1) {
      b1 *= 1 / G;
    }

    switch (type) {
      case "lowpass": {
        [a0, a1, a2] = [0, 0, G * W ** 2];
        break;
      }
      case "highpass": {
        [a0, a1, a2] = [G, 0, 0];
        break;
      }
      case "bandpass": {
        [a0, a1, a2] = [0, (G * W) / Q, 0];
        break;
      }
      case "bandstop": {
        [a0, a1, a2] = [G, 0, G * W ** 2];
        break;
      }
      case "equalizer": {
        [a0, a1, a2] = G < 1 ? [1, W / Q, W ** 2] : [1, (G * W) / Q, W ** 2];
        break;
      }
    }

    FF[0] = 4 * a0 + 2 * a1 * T + a2 * T ** 2;
    FF[1] = -8 * a0 + 2 * a2 * T ** 2;
    FF[2] = 4 * a0 - 2 * a1 * T + a2 * T ** 2;
    FB[0] = 4 + 2 * b1 * T + b2 * T ** 2;
    FB[1] = -8 + 2 * b2 * T ** 2;
    FB[2] = 4 + -2 * b1 * T + b2 * T ** 2;
  }

  next(x: number): number {
    const { X, Y, FF, FB } = this;
    let y = FF[0] * x + FF[1] * X[0] + FF[2] * X[1];
    y -= FB[1] * Y[0] + FB[2] * Y[1];
    y /= FB[0];
    X[1] = X[0];
    X[0] = x;
    Y[1] = Y[0];
    Y[0] = y;
    return y;
  }
}
