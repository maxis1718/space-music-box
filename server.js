const express = require("express");
const path = require("path");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

// 提供靜態檔案服務
app.use(express.static("."));

// 根路由重定向到 index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 健康檢查端點
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "🎮 Baby Game Server 運行中",
        timestamp: new Date().toISOString(),
    });
});

// 獲取本機 IP 地址
function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (
                alias.family === "IPv4" &&
                alias.address !== "127.0.0.1" &&
                !alias.internal
            ) {
                return alias.address;
            }
        }
    }
    return "127.0.0.1";
}

// 啟動伺服器
app.listen(PORT, "0.0.0.0", () => {
    const localIP = getLocalIPAddress();

    console.log("\n🚀 Baby Game Server 已啟動！");
    console.log("=".repeat(50));
    console.log(`📱 本機訪問: http://localhost:${PORT}`);
    console.log(`🌐 網路訪問: http://${localIP}:${PORT}`);
    console.log("=".repeat(50));
    console.log("\n📋 使用說明：");
    console.log("1. 電腦：直接點擊上方本機連結");
    console.log("2. 手機/平板：連接相同 WiFi，使用網路訪問連結");
    console.log("3. 按任意鍵或觸碰螢幕開始遊戲！");
    console.log("\n🛑 按 Ctrl+C 停止伺服器\n");
});

// 優雅關閉
process.on("SIGINT", () => {
    console.log("\n👋 Baby Game Server 已停止");
    process.exit(0);
});
