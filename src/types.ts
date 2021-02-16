export interface BiquadFilterConfig {
  type: "lowpass" | "highpass" | "bandstop" | "bandpass" | "equalizer";
  sampleRate: number;
  frequency: number;
  gain: number;
  Q: number;
}

export interface CascadedFilterConfig {
  sampleRate: number;
  filters: Array<Omit<BiquadFilterConfig, "sampleRate">>;
}
