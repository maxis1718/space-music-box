// 音效模組
class AudioSystem {
  constructor() {
    this.audioContext = null;
    this.initialized = false;
    this.frequencies = [220, 261.63, 329.63, 392, 440, 523.25]; // 和諧音階
  }

  // 初始化音頻上下文（需要用戶互動後才能啟動）
  async initialize() {
    if (this.initialized) return;

    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.initialized = true;
      console.log("🔊 音效系統已啟動");
    } catch (error) {
      console.warn("音效系統初始化失敗:", error);
    }
  }

  // 播放柔和的電子音
  playTone(frequency = null, duration = 0.3) {
    if (!this.initialized || !this.audioContext) return;

    // 隨機選擇頻率或使用指定頻率
    const freq =
      frequency ||
      this.frequencies[Math.floor(Math.random() * this.frequencies.length)];

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // 連接音頻節點
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // 設定音調為柔和的正弦波
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);

    // 音量包絡（淡入淡出效果）
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0.1,
      this.audioContext.currentTime + 0.05
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    // 播放音效
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // 播放粒子音效（更高頻率）
  playParticleSound() {
    const highFreq = 800 + Math.random() * 400;
    this.playTone(highFreq, 0.15);
  }
}

// 建立全局音效實例
const audioSystem = new AudioSystem();
