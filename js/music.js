// 音樂模塊
class MusicSystem {
  constructor(audioSystem) {
    this.audioSystem = audioSystem;
    this.currentSongIndex = 0;
    this.currentNoteIndex = 0;

    // 簡譜到頻率的對應 (C4為基準)
    this.noteFrequencies = {
      // 低8度 (,)
      "1,": 130.81, // Do (C3)
      "1b,": 123.47, // Do♭ (B2)
      "2,": 146.83, // Re (D3)
      "2b,": 138.59, // Re♭ (D♭3)
      "3,": 164.81, // Mi (E3)
      "3b,": 155.56, // Mi♭ (E♭3)
      "4,": 174.61, // Fa (F3)
      "4b,": 164.81, // Fa♭ (E3)
      "5,": 196.0, // So (G3)
      "5b,": 185.0, // So♭ (G♭3)
      "6,": 220.0, // La (A3)
      "6b,": 207.65, // La♭ (A♭3)
      "7,": 246.94, // Ti (B3)
      "7b,": 233.08, // Ti♭ (B♭3)

      // 中8度 (正常)
      1: 261.63, // Do (C4)
      "1b": 246.94, // Do♭ (B3)
      2: 293.66, // Re (D4)
      "2b": 277.18, // Re♭ (D♭4)
      3: 329.63, // Mi (E4)
      "3b": 311.13, // Mi♭ (E♭4)
      4: 349.23, // Fa (F4)
      "4b": 329.63, // Fa♭ (E4)
      5: 392.0, // So (G4)
      "5b": 369.99, // So♭ (G♭4)
      6: 440.0, // La (A4)
      "6b": 415.3, // La♭ (A♭4)
      7: 493.88, // Ti (B4)
      "7b": 466.16, // Ti♭ (B♭4)

      // 高8度 (.)
      "1.": 523.25, // Do (C5)
      "1b.": 493.88, // Do♭ (B4)
      "2.": 587.33, // Re (D5)
      "2b.": 554.37, // Re♭ (D♭5)
      "3.": 659.25, // Mi (E5)
      "3b.": 622.25, // Mi♭ (E♭5)
      "4.": 698.46, // Fa (F5)
      "4b.": 659.25, // Fa♭ (E5)
      "5.": 783.99, // So (G5)
      "5b.": 739.99, // So♭ (G♭5)
      "6.": 880.0, // La (A5)
      "6b.": 830.61, // La♭ (A♭5)
      "7.": 987.77, // Ti (B5)
      "7b.": 932.33, // Ti♭ (B♭5)

      0: 0, // 休止符
    };

    // 歌曲庫
    this.songs = {
      twinkle: {
        name: "Twinkle Star",
        notes: "115566544332215544332554433211556654433221",
        noteArray: [], // 將在初始化時填充
        emoji: "⭐",
      },
      babyshark: {
        name: "Baby Shark",
        notes: "5,6,111111115,6,111111115,6,111111117,",
        noteArray: [], // 將在初始化時填充
        emoji: "🦈",
      },
      bee: {
        name: "Little Bee",
        notes: "533422123455554442213553222223433334553342213551",
        noteArray: [], // 將在初始化時填充
        emoji: "🐝",
      },
      pokemon: {
        name: "Pokemon Route 1",
        notes: "123331233312334327,12227,12227,122321",
        noteArray: [], // 將在初始化時填充
        emoji: "⚡",
      },
    };

    this.currentSong = "twinkle";
    this.initializeSongs();
  }

  // 初始化歌曲，將字符串轉換為音符數組
  initializeSongs() {
    Object.keys(this.songs).forEach((songKey) => {
      const song = this.songs[songKey];
      // 支持跨8度表示法：用逗號表示低8度，點號表示高8度
      song.noteArray = this.parseNotes(song.notes);
    });

    console.log(
      `🎵 音樂系統已初始化，當前歌曲: ${this.songs[this.currentSong].name}`
    );
    console.log(
      `🎶 音符序列: ${this.songs[this.currentSong].noteArray.join(" ")}`
    );
  }

  // 解析音符字符串，支持跨8度表示和降音符
  parseNotes(noteString) {
    const notes = [];
    let i = 0;
    while (i < noteString.length) {
      const char = noteString[i];
      if (char === " ") {
        i++;
        continue;
      }

      let note = char;
      let nextIndex = i + 1;

      // 檢查降音符標記 (b)
      if (nextIndex < noteString.length && noteString[nextIndex] === "b") {
        note += "b";
        nextIndex++;
      }

      // 檢查8度標記 (, 或 .)
      if (nextIndex < noteString.length) {
        const octaveChar = noteString[nextIndex];
        if (octaveChar === "," || octaveChar === ".") {
          note += octaveChar;
          nextIndex++;
        }
      }

      if (note !== " ") {
        notes.push(note);
      }

      i = nextIndex;
    }
    return notes;
  }

  // 播放下一個音符
  playNextNote() {
    const song = this.songs[this.currentSong];

    if (this.currentNoteIndex >= song.noteArray.length) {
      // 歌曲結束，重新開始
      this.currentNoteIndex = 0;
      console.log(`🎉 "${song.name}" 播放完畢，重新開始！`);
    }

    const note = song.noteArray[this.currentNoteIndex];
    const frequency = this.noteFrequencies[note];

    if (frequency > 0) {
      // 播放音符
      this.audioSystem.playTone(frequency, 0.5);
      console.log(
        `🎵 播放音符: ${note} (${frequency.toFixed(1)}Hz) - 進度: ${
          this.currentNoteIndex + 1
        }/${song.noteArray.length}`
      );
    } else {
      // 休止符
      console.log(
        `🎵 休止符 - 進度: ${this.currentNoteIndex + 1}/${
          song.noteArray.length
        }`
      );
    }

    this.currentNoteIndex++;

    // 顯示進度和提示
    this.showProgress();
  }

  // 顯示播放進度
  showProgress() {
    const song = this.songs[this.currentSong];
    const progress = Math.round(
      (this.currentNoteIndex / song.noteArray.length) * 100
    );
    const progressBar =
      "█".repeat(Math.floor(progress / 5)) +
      "░".repeat(20 - Math.floor(progress / 5));

    console.log(
      `${song.emoji} ${song.name} 進度: [${progressBar}] ${progress}%`
    );

    // 如果完成了一句，給予鼓勵
    if (
      this.currentNoteIndex === 7 ||
      this.currentNoteIndex === 14 ||
      this.currentNoteIndex === 21
    ) {
      console.log("🌟 太棒了！言言完成了一句！");
    }
  }

  // 切換歌曲
  switchSong(songKey) {
    if (this.songs[songKey]) {
      this.currentSong = songKey;
      this.currentNoteIndex = 0;
      console.log(`🎵 切換到: ${this.songs[songKey].name}`);
    }
  }

  // 重置當前歌曲
  resetSong() {
    this.currentNoteIndex = 0;
    console.log(`🔄 重置歌曲: ${this.songs[this.currentSong].name}`);
  }

  // 獲取當前歌曲資訊
  getCurrentSongInfo() {
    const song = this.songs[this.currentSong];
    // 獲取剛剛播放的音符：
    // - 如果 currentNoteIndex = 0，顯示準備播放的第0個音符
    // - 如果 currentNoteIndex > 0，顯示剛剛播放的音符（前一個索引）
    let displayNote;
    if (this.currentNoteIndex === 0) {
      displayNote = song.noteArray[0] || "開始"; // 準備播放第一個音符
    } else if (this.currentNoteIndex >= song.noteArray.length) {
      displayNote = "完成"; // 歌曲已結束
    } else {
      displayNote = song.noteArray[this.currentNoteIndex - 1]; // 剛剛播放的音符
    }

    return {
      name: song.name,
      progress: this.currentNoteIndex,
      total: song.noteArray.length,
      currentNote: displayNote,
      emoji: song.emoji,
    };
  }

  // 獲取當前音符的頻率
  getCurrentNoteFrequency() {
    const song = this.songs[this.currentSong];
    let currentNote;

    if (this.currentNoteIndex === 0) {
      currentNote = song.noteArray[0] || null;
    } else if (this.currentNoteIndex >= song.noteArray.length) {
      return 0; // 歌曲已結束
    } else {
      currentNote = song.noteArray[this.currentNoteIndex - 1]; // 剛剛播放的音符
    }

    return currentNote ? this.noteFrequencies[currentNote] || 0 : 0;
  }

  // 添加新歌曲
  addSong(key, songData) {
    this.songs[key] = {
      name: songData.name,
      notes: songData.notes,
      noteArray: songData.notes.split("").filter((note) => note !== " "),
      emoji: songData.emoji || "🎵",
    };
    console.log(`✅ 新增歌曲: ${songData.name}`);
  }

  // 切換到下一首歌曲
  switchToNextSong() {
    const songKeys = Object.keys(this.songs);
    const currentIndex = songKeys.indexOf(this.currentSong);
    const nextIndex = (currentIndex + 1) % songKeys.length;

    this.switchSong(songKeys[nextIndex]);
    return this.songs[songKeys[nextIndex]];
  }

  // 獲取所有歌曲列表
  getAllSongs() {
    return Object.keys(this.songs).map((key) => ({
      key: key,
      name: this.songs[key].name,
      emoji: this.songs[key].emoji,
    }));
  }

  // 預覽音符（不影響進度）
  previewNote(note) {
    const frequency = this.noteFrequencies[note];
    if (frequency > 0) {
      this.audioSystem.playTone(frequency, 0.3);
    }
  }
}

// 音樂可視化效果
class MusicVisualizer {
  constructor() {
    this.activeNotes = [];
    this.lastNoteFrequency = null; // 追蹤前一個音符的頻率
  }

  // 添加音符視覺效果
  addNoteEffect(x, y, note, canvas, frequency = null) {
    // 計算移動方向
    let moveDirection = this.calculateMoveDirection(frequency);

    const effect = {
      x: x,
      y: y,
      note: note,
      size: 30,
      life: 1.0,
      decay: 0.02,
      color: this.getNoteColor(note),
      text: this.getNoteText(note),
      canvas: canvas,
      moveDirection: moveDirection, // 新增移動方向
    };

    this.activeNotes.push(effect);

    // 更新前一個音符的頻率
    if (frequency && frequency > 0) {
      this.lastNoteFrequency = frequency;
    }
  }

  // 計算移動方向
  calculateMoveDirection(currentFrequency) {
    if (!currentFrequency || currentFrequency === 0) {
      // 休止符，隨機左右移動
      return {
        x: (Math.random() - 0.5) * 3, // -1.5 到 1.5
        y: 0,
      };
    }

    if (!this.lastNoteFrequency) {
      // 第一個音符，預設往上
      return { x: 0, y: -2 };
    }

    if (currentFrequency > this.lastNoteFrequency) {
      // 音比前一個高，往上
      return { x: 0, y: -3 };
    } else if (currentFrequency < this.lastNoteFrequency) {
      // 音比前一個低，往下
      return { x: 0, y: 2 };
    } else {
      // 音高一樣，左右移動
      return {
        x: (Math.random() - 0.5) * 4, // -2 到 2
        y: 0,
      };
    }
  }

  // 根據音符獲取顏色
  getNoteColor(note) {
    // 提取基本音符數字（忽略8度標記和降音符標記）
    const baseNote = note.replace(/[,.b]/g, "");
    const colors = {
      1: "#ff6b6b", // Do - 紅色
      2: "#4ecdc4", // Re - 青色
      3: "#45b7d1", // Mi - 藍色
      4: "#96ceb4", // Fa - 綠色
      5: "#feca57", // So - 黃色
      6: "#ff9ff3", // La - 粉色
      7: "#a8e6cf", // Ti - 淺綠
      0: "#95a5a6", // 休止符 - 灰色
    };

    let color = colors[baseNote] || "#ffffff";

    // 根據降音符調整色調（稍微偏暗）
    if (note.includes("b")) {
      color = this.adjustBrightness(color, 0.8);
    }

    // 根據8度調整亮度
    if (note.includes(",")) {
      // 低8度 - 較暗
      color = this.adjustBrightness(color, 0.7);
    } else if (note.includes(".")) {
      // 高8度 - 較亮
      color = this.adjustBrightness(color, 1.3);
    }

    return color;
  }

  // 調整顏色亮度
  adjustBrightness(hex, factor) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const newR = Math.min(255, Math.max(0, Math.floor(r * factor)));
    const newG = Math.min(255, Math.max(0, Math.floor(g * factor)));
    const newB = Math.min(255, Math.max(0, Math.floor(b * factor)));

    return `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  }

  // 根據音符獲取顯示文字
  getNoteText(note) {
    // 提取基本音符數字
    const baseNote = note.replace(/[,.b]/g, "");
    const texts = {
      1: "Do",
      2: "Re",
      3: "Mi",
      4: "Fa",
      5: "So",
      6: "La",
      7: "Ti",
      0: "♪",
    };

    let text = texts[baseNote] || "♪";

    // 添加降音符標記
    if (note.includes("b")) {
      text += "♭"; // 降音符標記
    }

    // 添加8度標記
    if (note.includes(",")) {
      text += "₋"; // 下標表示低8度
    } else if (note.includes(".")) {
      text += "⁺"; // 上標表示高8度
    }

    return text;
  }

  // 更新音符效果
  update() {
    this.activeNotes.forEach((note) => {
      // 使用音符的移動方向
      if (note.moveDirection) {
        note.x += note.moveDirection.x;
        note.y += note.moveDirection.y;
      } else {
        // 向上飄動（舊邏輯，以防萬一）
        note.y -= 2;
      }
      note.life -= note.decay;
      note.size += 0.5;
    });

    // 移除過期效果
    this.activeNotes = this.activeNotes.filter((note) => note.life > 0);
  }

  // 繪製音符效果
  draw(ctx) {
    this.activeNotes.forEach((note) => {
      ctx.save();
      ctx.globalAlpha = note.life;

      // 繪製音符背景圓圈
      ctx.fillStyle = note.color;
      ctx.shadowColor = note.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(note.x, note.y, note.size, 0, Math.PI * 2);
      ctx.fill();

      // 繪製音符文字
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(note.text, note.x, note.y);

      ctx.restore();
    });
  }

  // 獲取當前活躍音符數量
  getActiveCount() {
    return this.activeNotes.length;
  }
}
