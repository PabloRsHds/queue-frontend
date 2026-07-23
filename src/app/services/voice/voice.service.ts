import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  private synth = window.speechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  // Configurações de voz
  private config = {
    rate: 0.9,      // Velocidade da fala (0.1 a 10)
    pitch: 1.0,     // Tom da voz (0 a 2)
    volume: 1.0,    // Volume (0 a 1)
    lang: 'pt-BR'   // Idioma
  };

  public speak(text: string): void {
    // Cancela qualquer fala em andamento
    this.stop();

    // Cria uma nova utterance
    this.utterance = new SpeechSynthesisUtterance(text);

    // Aplica configurações
    this.utterance.rate = this.config.rate;
    this.utterance.pitch = this.config.pitch;
    this.utterance.volume = this.config.volume;
    this.utterance.lang = this.config.lang;

    // Tenta encontrar uma voz em português
    const voices = this.synth.getVoices();
    const ptBrVoice = voices.find(v => v.lang.startsWith('pt'));
    if (ptBrVoice) {
      this.utterance.voice = ptBrVoice;
    }

    // Fala!
    this.synth.speak(this.utterance);
  }

  public stop(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.utterance = null;
  }
}
