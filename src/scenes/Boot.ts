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

    const button = this.add.text(width / 2, height / 2 + 40, "▶ TAP TO START", {
      fontFamily: "system-ui, sans-serif",
      fontSize: "42px",
      color: "#ffffff",
      backgroundColor: "#1c8a3a",
      padding: { left: 32, right: 32, top: 18, bottom: 18 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    button.on("pointerdown", () => {
      // Prime speech synthesis with first user gesture so it works later
      if ("speechSynthesis" in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
      }
      this.scene.start("Preload");
    });
  }
}
