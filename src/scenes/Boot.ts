import Phaser from "phaser";

export class Boot extends Phaser.Scene {
  constructor() { super("Boot"); }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0xa8e6a3);
    this.add.text(width / 2, height / 2 - 80, "Coding Games", {
      fontFamily: "system-ui, sans-serif",
      fontSize: "56px",
      color: "#1c8a3a",
      fontStyle: "bold"
    }).setOrigin(0.5);

    const button = this.add.text(width / 2, height / 2 + 40, "▶ TAP OR PRESS ANY KEY", {
      fontFamily: "system-ui, sans-serif",
      fontSize: "42px",
      color: "#ffffff",
      backgroundColor: "#1c8a3a",
      padding: { left: 32, right: 32, top: 18, bottom: 18 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    let started = false;
    const start = () => {
      if (started) return;
      started = true;

      // Unlock Phaser's WebAudio context. Browsers suspend it until a user
      // gesture; the splash button is a Text object so Phaser's auto-unlock
      // (which listens on the canvas) doesn't always catch it.
      const ctx = (this.sound as Phaser.Sound.WebAudioSoundManager | undefined)?.context;
      if (ctx && ctx.state === "suspended") void ctx.resume();

      // Prime speech synthesis with the first user gesture so it works later
      if ("speechSynthesis" in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
      }
      this.scene.start("Preload");
    };

    button.on("pointerdown", start);
    this.input.keyboard?.once("keydown", start);
  }
}
