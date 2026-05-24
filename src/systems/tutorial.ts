import type { World } from "../scenes/World";
import type { TutorialStep, TutorialTrigger } from "../data/pack";
import { audio } from "./audio";
import { hints } from "./hints";
import * as progress from "./progress";

const PROMPT_DELAY_MS = 350;

class TutorialSystem {
  private world: World | null = null;
  private zone: string | null = null;
  private steps: TutorialStep[] = [];
  private currentStep: TutorialStep | null = null;
  private listener: ((data: unknown) => void) | null = null;
  private listenerEvent: string | null = null;

  start(world: World, zone: string, steps: TutorialStep[]) {
    this.stop();
    this.world = world;
    this.zone = zone;
    this.steps = steps;
    const idx = progress.load().tutorialProgress[zone] ?? 0;
    this.runStep(idx);
  }

  stop() {
    this.detach();
    hints.clear();
    this.world = null;
    this.zone = null;
    this.steps = [];
    this.currentStep = null;
  }

  private runStep(index: number) {
    if (!this.world || !this.zone) return;
    if (index >= this.steps.length) {
      this.stop();
      return;
    }
    const step = this.steps[index]!;
    this.currentStep = step;

    // Small delay so the speech doesn't collide with scene transition / prior bump speech
    window.setTimeout(() => {
      if (this.currentStep !== step) return;
      audio.say(step.prompt);
    }, PROMPT_DELAY_MS);

    if (step.hint?.kind === "pulse-puzzle") {
      hints.pulse(step.hint.puzzleId);
    } else {
      hints.clear();
    }

    this.attach(step.completeOn, () => this.complete(index));
  }

  private complete(index: number) {
    if (!this.zone) return;
    this.detach();
    const p = progress.load();
    p.tutorialProgress = { ...p.tutorialProgress, [this.zone]: index + 1 };
    progress.save(p);
    // defer to next tick so the same input doesn't satisfy the next step
    window.setTimeout(() => this.runStep(index + 1), 0);
  }

  private attach(trigger: TutorialTrigger, onMatch: () => void) {
    if (!this.world) return;
    this.detach();
    const handler = (data: unknown) => {
      if (!matches(trigger, data)) return;
      onMatch();
    };
    this.world.bus.on(trigger.event, handler);
    this.listener = handler;
    this.listenerEvent = trigger.event;
  }

  private detach() {
    if (this.world && this.listener && this.listenerEvent) {
      this.world.bus.off(this.listenerEvent, this.listener);
    }
    this.listener = null;
    this.listenerEvent = null;
  }
}

function matches(trigger: TutorialTrigger, data: unknown): boolean {
  if (trigger.event === "input") return true;
  const d = data as { id?: string } | undefined;
  return d?.id === trigger.puzzleId;
}

export const tutorial = new TutorialSystem();
