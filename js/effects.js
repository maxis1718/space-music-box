// 特效系統模組

// 超新星爆炸效果
class Supernova {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;

        this.size = 0;
        this.maxSize = 150 + Math.random() * 100;
        this.expandSpeed = 8;
        this.life = 1.0;
        this.decay = 0.012;

        this.color = "#ffff99";
        this.particles = [];

        // 生成輻射粒子
        for (let i = 0; i < 20; i++) {
            const angle = ((Math.PI * 2) / 20) * i;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * (5 + Math.random() * 10),
                vy: Math.sin(angle) * (5 + Math.random() * 10),
                size: 3 + Math.random() * 8,
                life: 1.0,
                decay: 0.015 + Math.random() * 0.01,
            });
        }
    }

    update() {
        // 爆炸核心擴張
        if (this.size < this.maxSize) {
            this.size += this.expandSpeed;
        }

        // 更新粒子
        this.particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            particle.life -= particle.decay;
        });

        // 移除死亡粒子
        this.particles = this.particles.filter((p) => p.life > 0);

        this.life -= this.decay;
    }

    draw(ctx) {
        if (this.life <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.life;

        // 繪製爆炸核心
        const gradient = ctx.createRadialGradient(
            this.x,
            this.y,
            0,
            this.x,
            this.y,
            this.size
        );
        gradient.addColorStop(0, "rgba(255, 255, 200, 0.8)");
        gradient.addColorStop(0.5, "rgba(255, 200, 100, 0.4)");
        gradient.addColorStop(1, "rgba(255, 100, 50, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 繪製輻射粒子
        this.particles.forEach((particle) => {
            ctx.globalAlpha = particle.life * this.life;
            ctx.fillStyle = "#ffaa00";
            ctx.shadowColor = "#ffaa00";
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// 螺旋星雲效果
class Spiral {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;

        this.rotation = 0;
        this.rotationSpeed = 0.1;
        this.radius = 20;
        this.maxRadius = 120;
        this.expandSpeed = 2;
        this.life = 1.0;
        this.decay = 0.008;

        this.arms = [];
        // 生成螺旋臂
        for (let arm = 0; arm < 3; arm++) {
            this.arms.push({
                angle: ((Math.PI * 2) / 3) * arm,
                particles: [],
            });
        }
    }

    update() {
        this.rotation += this.rotationSpeed;

        if (this.radius < this.maxRadius) {
            this.radius += this.expandSpeed;
        }

        // 更新螺旋臂
        this.arms.forEach((arm) => {
            // 添加新粒子
            if (Math.random() < 0.3) {
                const distance = Math.random() * this.radius;
                const angle = arm.angle + this.rotation + distance * 0.05;
                arm.particles.push({
                    distance: distance,
                    angle: angle,
                    size: 2 + Math.random() * 6,
                    life: 1.0,
                    decay: 0.02,
                });
            }

            // 更新粒子
            arm.particles.forEach((particle) => {
                particle.angle += 0.02;
                particle.life -= particle.decay;
            });

            // 移除死亡粒子
            arm.particles = arm.particles.filter((p) => p.life > 0);
        });

        this.life -= this.decay;
    }

    draw(ctx) {
        if (this.life <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.life;

        this.arms.forEach((arm) => {
            arm.particles.forEach((particle) => {
                const x = this.x + Math.cos(particle.angle) * particle.distance;
                const y = this.y + Math.sin(particle.angle) * particle.distance;

                ctx.globalAlpha = particle.life * this.life;
                ctx.fillStyle = "#b388ff";
                ctx.shadowColor = "#b388ff";
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(x, y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });
        });

        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// 彗星拖尾效果
class Comet {
    constructor(x, y, canvas) {
        this.canvas = canvas;

        // 隨機方向飛行
        const angle = Math.random() * Math.PI * 2;
        const speed = 8 + Math.random() * 12;

        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.trail = [];
        this.maxTrailLength = 25;
        this.size = 8 + Math.random() * 12;
        this.life = 1.0;
        this.decay = 0.006;

        this.color = "#82b1ff";
    }

    update() {
        // 更新位置
        this.x += this.vx;
        this.y += this.vy;

        // 添加拖尾點
        this.trail.push({ x: this.x, y: this.y, life: 1.0 });

        // 限制拖尾長度
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // 更新拖尾透明度
        this.trail.forEach((point, index) => {
            point.life = index / this.trail.length;
        });

        // 邊界彈跳
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -0.8;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -0.8;

        this.life -= this.decay;
    }

    draw(ctx) {
        if (this.life <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.life;

        // 繪製拖尾
        for (let i = 1; i < this.trail.length; i++) {
            const current = this.trail[i];
            const prev = this.trail[i - 1];

            ctx.globalAlpha = current.life * this.life;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = (i / this.trail.length) * this.size;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;

            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(current.x, current.y);
            ctx.stroke();
        }

        // 繪製彗星頭部
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// 爆炸效果
class Explosion {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;

        this.particles = [];
        this.life = 1.0;
        this.decay = 0.015;

        // 生成爆炸粒子
        const particleCount = 15 + Math.random() * 20;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 15;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.random() * 8,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                color: this.getRandomColor(),
            });
        }
    }

    getRandomColor() {
        const colors = [
            "#ff6b6b",
            "#4ecdc4",
            "#45b7d1",
            "#96ceb4",
            "#feca57",
            "#ff9ff3",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.95;
            particle.vy *= 0.95;
            particle.vy += 0.2; // 重力
            particle.life -= particle.decay;
        });

        this.particles = this.particles.filter((p) => p.life > 0);
        this.life -= this.decay;
    }

    draw(ctx) {
        if (this.life <= 0) return;

        ctx.save();

        this.particles.forEach((particle) => {
            ctx.globalAlpha = particle.life * this.life;
            ctx.fillStyle = particle.color;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    isDead() {
        return this.life <= 0 || this.particles.length === 0;
    }
}
