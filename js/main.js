// 主遊戲控制器
class BabyGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.shapeManager = new ShapeManager(this.canvas);

    // 音樂系統
    this.musicSystem = null;
    this.musicVisualizer = new MusicVisualizer();
    this.musicButton = null;
    this.songSelector = null;

    // 遊戲狀態
    this.isRunning = false;
    this.frameCount = 0;

    this.init();
  }

  init() {
    this.setupCanvas();
    this.setupEventListeners();
    this.start();
    console.log("🎮 Baby Game 已初始化");
  }

  setupCanvas() {
    // 設定 Canvas 尺寸為全螢幕
    this.resizeCanvas();

    // 監聽視窗大小變化
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // 設定 Canvas 樣式確保高清顯示
    const dpr = window.devicePixelRatio || 1;
    this.canvas.style.width = window.innerWidth + "px";
    this.canvas.style.height = window.innerHeight + "px";
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  setupEventListeners() {
    // 鍵盤事件
    document.addEventListener("keydown", (e) => this.handleInput(e));

    // 觸控事件
    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      this.createShapeAt(x, y);
    });

    // 滑鼠事件
    this.canvas.addEventListener("mousedown", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.createShapeAt(x, y);
    });

    // 創建音樂切換按鈕
    this.createMusicButton();
  }

  handleInput(event) {
    // 初始化音效系統（首次互動時）
    if (!audioSystem.initialized) {
      audioSystem.initialize();
    }

    // 在隨機位置創建形狀
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height * 0.7; // 上方 70% 區域

    this.createShapeAt(x, y);
  }

  createShapeAt(x, y) {
    // 初始化音效和音樂系統（首次互動時）
    if (!audioSystem.initialized) {
      audioSystem.initialize();
      // 音樂系統依賴音效系統，所以在這裡初始化
      this.musicSystem = new MusicSystem(audioSystem);
      // 更新音樂按鈕顯示
      this.updateMusicButton();
    }

    // 播放音樂中的下一個音符
    if (this.musicSystem) {
      this.musicSystem.playNextNote();

      // 獲取當前音符信息
      const songInfo = this.musicSystem.getCurrentSongInfo();
      const currentNote = songInfo.currentNote;
      const currentFrequency = this.musicSystem.getCurrentNoteFrequency();

      // 添加音符視覺效果
      this.musicVisualizer.addNoteEffect(
        x,
        y,
        currentNote,
        this.canvas,
        currentFrequency
      );
    }

    // 30% 機率觸發視覺特效（降低機率，讓音樂成為主角）
    const effectRoll = Math.random();

    if (effectRoll < 0.08) {
      // 8% 機率：超新星爆炸
      this.shapeManager.addSupernova(x, y);
      console.log("🌟 超新星爆炸！");
    } else if (effectRoll < 0.12) {
      // 4% 機率：螺旋星雲
      this.shapeManager.addSpiral(x, y);
      console.log("🌀 螺旋星雲！");
    } else if (effectRoll < 0.18) {
      // 6% 機率：彗星拖尾
      this.shapeManager.addComet(x, y);
      console.log("☄️ 彗星拖尾！");
    } else if (effectRoll < 0.22) {
      // 4% 機率：爆炸效果
      this.shapeManager.addExplosion(x, y);
      console.log("💥 爆炸效果！");
    } else if (effectRoll < 0.3) {
      // 8% 機率：普通形狀
      this.shapeManager.addShape(x, y);
    }
    // 70% 機率：只有音樂效果，沒有額外視覺效果
  }

  update() {
    this.frameCount++;
    this.shapeManager.update();
    this.musicVisualizer.update();
  }

  draw() {
    // 輕微淡出效果，不覆蓋背景星星
    this.ctx.fillStyle = "rgba(10, 10, 10, 0.03)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 繪製所有形狀
    this.shapeManager.draw(this.ctx);

    // 繪製音樂視覺效果
    this.musicVisualizer.draw(this.ctx);

    // 繪製調試信息（可選）
    if (this.frameCount % 60 === 0) {
      // 每秒更新一次
      const shapeCount = this.shapeManager.getShapeCount();
      const noteCount = this.musicVisualizer.getActiveCount();
      console.log(`🎨 形狀: ${shapeCount} | 🎵 音符: ${noteCount}`);

      // 顯示當前歌曲信息
      if (this.musicSystem) {
        const songInfo = this.musicSystem.getCurrentSongInfo();
        console.log(
          `${songInfo.emoji} ${songInfo.name}: ${songInfo.progress}/${songInfo.total}`
        );
        // 更新按鈕顯示
        this.updateMusicButton();
      }
    }
  }

  gameLoop() {
    if (!this.isRunning) return;

    this.update();
    this.draw();

    // 使用 requestAnimationFrame 確保 60fps
    requestAnimationFrame(() => this.gameLoop());
  }

  start() {
    this.isRunning = true;
    this.gameLoop();
    console.log("🚀 遊戲開始！");
  }

  stop() {
    this.isRunning = false;
    console.log("⏹️ 遊戲暫停");
  }

  createMusicButton() {
    // 創建音樂切換按鈕
    this.musicButton = document.createElement("div");
    this.musicButton.className = "music-button";
    this.musicButton.innerHTML = `
            <div class="music-icon">🎵</div>
            <div class="music-text">
                <div class="song-name">Tap to Start</div>
                <div class="song-hint">Select Songs</div>
            </div>
        `;

    // 添加樣式
    this.addMusicButtonStyles();

    // 添加到頁面
    document.body.appendChild(this.musicButton);

    // 綁定點擊事件 - 觸發歌曲選擇器
    this.musicButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("🎵 音樂按鈕被點擊");

      if (!this.songSelector && this.musicSystem) {
        // 創建歌曲選擇器（如果還沒有的話）
        this.songSelector = new SongSelector(this.musicSystem);
      }

      if (this.songSelector) {
        this.songSelector.show();
      }
    });
  }

  addMusicButtonStyles() {
    const style = document.createElement("style");
    style.textContent = `
            .music-button {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
                background-size: 300% 300%;
                border: none;
                border-radius: 25px;
                padding: 15px 25px;
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                z-index: 1000;
                box-shadow: 0 8px 25px rgba(100, 255, 218, 0.4);
                animation: gradientShift 3s ease infinite, bounce 2s ease-in-out infinite;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.3);
                min-width: 200px;
                user-select: none;
                transition: transform 0.3s ease;
            }
            
            .music-button:hover {
                transform: translateX(-50%) scale(1.05);
            }
            
            .music-button:active {
                transform: translateX(-50%) scale(0.95);
            }
            
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            @keyframes bounce {
                0%, 100% { 
                    transform: translateX(-50%) translateY(0px); 
                    box-shadow: 0 8px 25px rgba(100, 255, 218, 0.4);
                }
                50% { 
                    transform: translateX(-50%) translateY(-5px); 
                    box-shadow: 0 15px 35px rgba(100, 255, 218, 0.6);
                }
            }
            
            .music-icon {
                font-size: 28px;
                animation: pulse 1.5s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            
            .music-text {
                display: flex;
                flex-direction: column;
                color: white;
                font-family: 'Courier New', monospace;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .song-name {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 2px;
            }
            
            .song-hint {
                font-size: 12px;
                opacity: 0.9;
            }
            
            /* 平板適配 */
            @media (max-width: 768px) {
                .music-button {
                    bottom: 30px;
                    padding: 20px 30px;
                    min-width: 250px;
                }
                
                .music-icon {
                    font-size: 32px;
                }
                
                .song-name {
                    font-size: 18px;
                }
                
                .song-hint {
                    font-size: 14px;
                }
            }
        `;
    document.head.appendChild(style);
  }

  updateMusicButton() {
    if (this.musicButton && this.musicSystem) {
      const songInfo = this.musicSystem.getCurrentSongInfo();
      const iconElement = this.musicButton.querySelector(".music-icon");
      const nameElement = this.musicButton.querySelector(".song-name");
      const hintElement = this.musicButton.querySelector(".song-hint");

      iconElement.textContent = songInfo.emoji;
      nameElement.textContent = songInfo.name;
      hintElement.textContent = `${songInfo.progress}/${songInfo.total} | Tap to Switch`;
    }
  }
}

// 等待 DOM 載入完成後啟動遊戲
document.addEventListener("DOMContentLoaded", () => {
  const game = new BabyGame();

  // 全局訪問遊戲實例（方便調試）
  window.babyGame = game;
});
