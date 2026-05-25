const MUTE_KEY = "coding-games.muted.v1";

type Listener = (muted: boolean) => void;

class AudioManager {
  private voice: SpeechSynthesisVoice | null = null;
  private muted = false;
  private listeners = new Set<Listener>();

  init() {
    try { this.muted = localStorage.getItem(MUTE_KEY) === "1"; } catch {}

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
    if (this.muted) return;
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    // Known Chrome bug: cancel() can leave the synth in a paused-but-empty
    // state where subsequent speak() calls silently do nothing. resume()
    // wakes it up. Safe on other browsers (no-op when not paused).
    synth.cancel();
    synth.resume();
    const utter = new SpeechSynthesisUtterance(text);
    if (this.voice) utter.voice = this.voice;
    utter.rate = 0.95;
    utter.pitch = 1.2;
    synth.speak(utter);
  }

  isMuted(): boolean { return this.muted; }

  toggleMuted(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  setMuted(m: boolean) {
    this.muted = m;
    try { localStorage.setItem(MUTE_KEY, m ? "1" : "0"); } catch {}
    if (m && "speechSynthesis" in window) window.speechSynthesis.cancel();
    for (const fn of this.listeners) fn(m);
  }

  onChange(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const audio = new AudioManager();
