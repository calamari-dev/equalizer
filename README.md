# equalizer

This is an implementation of biquad filters, discretized by bilinear transform.

## Examples

Currently, This supports 5 type filters.

+ highpass filter
+ lowpass filter
+ bandpass filter
+ bandstop filter
+ equalizer

### BiquadFilter

```typescript
import { BiquadFilter } from "equalizer";

const filter = new BiquadFilter({
  type: "equalizer", // highpass, lowpass, bandpass, bandstop are also OK.
  sampleRate: 44100,
  frequency: 11025,
  gain: -2,
  Q: 1,
});

const ir: number[] = [];

for (let t = 0; t < 1024; t++) {
  ir[t] = filter.next(t === 0 ? 1 : 0);
}
```

### CascadedFilter

```typescript
import { CascadedFilter } from "equalizer";

const filter = new CascadedFilter({
  sampleRate: 44100,
  filters: [
    { // This filter is applied at first.
      type: "equalizer",
      frequency: 7350,
      gain: 2,
      Q: 8,
    },
    // Here more filters are acceptable.
    { // This filter is applied at last.
      type: "equalizer",
      frequency: 14700,
      gain: 3,
      Q: 8,
    },
  ],
});

const ir: number[] = [];

for (let t = 0; t < 1024; t++) {
  ir[t] = filter.next(t === 0 ? 1 : 0);
}
```

### I want to know more

Please see [test](https://github.com/calamari-dev/equalizer/tree/main/src).

## Note

I don't recommend you to use this if you use this for sound processing in the browser. It is because [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode) enables you to create biquad filters more easily and in better performance.

Then, why this has been created? There are 2 reasons.

+ Support of Node.js
+ Amplitude characteristics visualization

In the way like the above examples, you can get impulse response. Its FFT visualize amplitude characteristics approximately.

