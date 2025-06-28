// 形狀系統模組
class Shape {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;

        // 隨機初始速度
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 0.5) * 15 - 5; // 輕微向上

        // 物理屬性
        this.gravity = 0.3;
        this.bounce = 0.7;
        this.friction = 0.99;

        // 視覺屬性
        this.size = 20 + Math.random() * 30;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;

        // 生命週期
        this.life = 1.0;
        this.decay = 0.008;

        // 隨機形狀類型
        this.shapeType = Math.floor(Math.random() * 3); // 0: 圓形, 1: 方形, 2: 三角形

        // 護眼科技風顏色調色盤
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = [
            "#64ffda", // 青綠色
            "#82b1ff", // 藍色
            "#b388ff", // 紫色
            "#ff8a65", // 橘色（柔和）
            "#81c784", // 綠色
            "#ffb74d", // 黃色（柔和）
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        // 物理運動
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        // 旋轉
        this.rotation += this.rotationSpeed;

        // 邊界彈跳
        if (
            this.x + this.size / 2 > this.canvas.width ||
            this.x - this.size / 2 < 0
        ) {
            this.vx *= -this.bounce;
            this.x = Math.max(
                this.size / 2,
                Math.min(this.canvas.width - this.size / 2, this.x)
            );
        }

        if (
            this.y + this.size / 2 > this.canvas.height ||
            this.y - this.size / 2 < 0
        ) {
            this.vy *= -this.bounce;
            this.y = Math.max(
                this.size / 2,
                Math.min(this.canvas.height - this.size / 2, this.y)
            );
        }

        // 摩擦力
        this.vx *= this.friction;
        this.vy *= this.friction;

        // 生命週期衰減
        this.life -= this.decay;
    }

    draw(ctx) {
        if (this.life <= 0) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // 設定透明度和發光效果
        ctx.globalAlpha = this.life;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

        // 根據形狀類型繪製
        switch (this.shapeType) {
            case 0: // 圓形
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 1: // 方形
                ctx.fillRect(
                    -this.size / 2,
                    -this.size / 2,
                    this.size,
                    this.size
                );
                ctx.strokeRect(
                    -this.size / 2,
                    -this.size / 2,
                    this.size,
                    this.size
                );
                break;

            case 2: // 三角形
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
        }

        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// 形狀管理器
class ShapeManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.shapes = [];
    }

    addShape(x, y) {
        // 添加主形狀
        this.shapes.push(new Shape(x, y, this.canvas));

        // 添加一些小粒子效果
        for (let i = 0; i < 3; i++) {
            const particle = new Shape(x, y, this.canvas);
            particle.size = 5 + Math.random() * 10;
            particle.vx = (Math.random() - 0.5) * 20;
            particle.vy = (Math.random() - 0.5) * 20;
            particle.decay = 0.02;
            this.shapes.push(particle);
        }
    }

    update() {
        // 更新所有形狀
        this.shapes.forEach((shape) => shape.update());

        // 移除已死亡的形狀
        this.shapes = this.shapes.filter((shape) => !shape.isDead());
    }

    draw(ctx) {
        this.shapes.forEach((shape) => shape.draw(ctx));
    }

    getShapeCount() {
        return this.shapes.length;
    }

    // 添加特殊效果方法
    addSupernova(x, y) {
        this.shapes.push(new Supernova(x, y, this.canvas));
    }

    addSpiral(x, y) {
        this.shapes.push(new Spiral(x, y, this.canvas));
    }

    addComet(x, y) {
        this.shapes.push(new Comet(x, y, this.canvas));
    }

    addExplosion(x, y) {
        this.shapes.push(new Explosion(x, y, this.canvas));
    }
}
