class AudioManager {
  private voice: SpeechSynthesisVoice | null = null;

  init() {
    if (!("speechSynthesis" in window)) return;
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      this.voice =
        voices.find(v => /child|kid/i.test(v.name)) ??
        voices.find(v => v.lang.startsWith("en")) ??
        voices[0] ?? null;
    };
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  say(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    if (this.voice) utter.voice = this.voice;
    utter.rate = 0.95;
    utter.pitch = 1.2;
    window.speechSynthesis.speak(utter);
  }
}

export const audio = new AudioManager();
