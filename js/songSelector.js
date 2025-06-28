// 歌曲選擇器模組
class SongSelector {
  constructor(musicSystem) {
    this.musicSystem = musicSystem;
    this.isVisible = false;
    this.selectorElement = null;
    this.createSelectorUI();
  }

  createSelectorUI() {
    // 建立歌曲選擇器 UI
    this.selectorElement = document.createElement("div");
    this.selectorElement.className = "song-selector";
    this.selectorElement.innerHTML = `
            <div class="song-selector-header">
                <h3>🎵 選擇歌曲</h3>
                <button class="close-btn">×</button>
            </div>
            <div class="song-list"></div>
        `;

    // 添加樣式
    this.addStyles();

    // 添加到頁面
    document.body.appendChild(this.selectorElement);

    // 綁定事件
    this.bindEvents();

    // 更新歌曲列表
    this.updateSongList();
  }

  addStyles() {
    const style = document.createElement("style");
    style.textContent = `
            .song-selector {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(26, 26, 46, 0.95);
                border: 2px solid #64ffda;
                border-radius: 15px;
                padding: 20px;
                z-index: 1000;
                min-width: 300px;
                backdrop-filter: blur(10px);
                display: none;
                box-shadow: 0 0 30px rgba(100, 255, 218, 0.3);
            }
            
            .song-selector.visible {
                display: block;
                animation: fadeIn 0.3s ease-in-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            
            .song-selector-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                color: #64ffda;
            }
            
            .song-selector-header h3 {
                margin: 0;
                font-family: 'Courier New', monospace;
            }
            
            .close-btn {
                background: none;
                border: none;
                color: #64ffda;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .close-btn:hover {
                background: rgba(100, 255, 218, 0.2);
                border-radius: 50%;
            }
            
            .song-item {
                display: flex;
                align-items: center;
                padding: 12px;
                margin: 8px 0;
                background: rgba(100, 255, 218, 0.1);
                border: 1px solid rgba(100, 255, 218, 0.3);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #ffffff;
                font-family: 'Courier New', monospace;
            }
            
            .song-item:hover {
                background: rgba(100, 255, 218, 0.2);
                transform: translateX(5px);
            }
            
            .song-item.active {
                background: rgba(100, 255, 218, 0.3);
                border-color: #64ffda;
                box-shadow: 0 0 15px rgba(100, 255, 218, 0.4);
            }
            
            .song-emoji {
                font-size: 24px;
                margin-right: 12px;
            }
            
            .song-info {
                flex: 1;
            }
            
            .song-name {
                font-weight: bold;
                margin-bottom: 2px;
            }
            
            .song-progress {
                font-size: 12px;
                opacity: 0.7;
            }
        `;
    document.head.appendChild(style);
  }

  bindEvents() {
    // 關閉按鈕
    const closeBtn = this.selectorElement.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => this.hide());

    // 點擊外部關閉
    this.selectorElement.addEventListener("click", (e) => {
      if (e.target === this.selectorElement) {
        this.hide();
      }
    });

    // ESC 鍵關閉
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible) {
        this.hide();
      }
    });
  }

  updateSongList() {
    const songList = this.selectorElement.querySelector(".song-list");
    const songs = this.musicSystem.getAllSongs();
    const currentSong = this.musicSystem.currentSong;

    songList.innerHTML = songs
      .map((song) => {
        const songInfo = this.musicSystem.getCurrentSongInfo();
        const isActive = song.key === currentSong;
        const progress = isActive
          ? `${songInfo.progress}/${songInfo.total}`
          : `0/${this.musicSystem.songs[song.key].noteArray.length}`;

        return `
                <div class="song-item ${isActive ? "active" : ""}" data-song="${
          song.key
        }">
                    <div class="song-emoji">${song.emoji}</div>
                    <div class="song-info">
                        <div class="song-name">${song.name}</div>
                        <div class="song-progress">進度: ${progress}</div>
                    </div>
                </div>
            `;
      })
      .join("");

    // 綁定歌曲選擇事件
    songList.querySelectorAll(".song-item").forEach((item) => {
      item.addEventListener("click", () => {
        const songKey = item.dataset.song;
        this.musicSystem.switchSong(songKey);
        console.log(`🎵 手動切換歌曲: ${this.musicSystem.songs[songKey].name}`);
        this.updateSongList();
        this.hide();
      });
    });
  }

  show() {
    this.isVisible = true;
    this.updateSongList();
    this.selectorElement.classList.add("visible");
  }

  hide() {
    this.isVisible = false;
    this.selectorElement.classList.remove("visible");
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
}
