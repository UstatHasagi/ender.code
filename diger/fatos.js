const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let width;
let height;
let dpr;

function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const layers = 9;

function heartPoint(t, scale) {

    const x = 16 * Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    return {
        x: x * scale,
        y: -y * scale
    };
}

function drawHeartText(radius, rotation, fontSize, opacity, spacing) {

    ctx.save();

    ctx.translate(width / 2, height / 2);

    ctx.rotate(rotation);

    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(255,255,255,.7)";
    ctx.shadowBlur = fontSize * 0.6;

    ctx.fillStyle = `rgba(255,255,255,${opacity})`;

    const text = "Fatoş 🤍";

    const total = Math.floor(2 * Math.PI * radius / spacing);

    for (let i = 0; i < total; i++) {

        const t = (i / total) * Math.PI * 2;

        const point = heartPoint(t, radius / 18);

        const next = heartPoint(t + 0.01, radius / 18);

        const angle = Math.atan2(
            next.y - point.y,
            next.x - point.x
        );

        ctx.save();

        ctx.translate(point.x, point.y);

        ctx.rotate(angle);

        ctx.fillText(text, 0, 0);

        ctx.restore();
    }

    ctx.restore();
}

let time = 0;

function animate() {

    time += 0.008;

    ctx.clearRect(0, 0, width, height);

    /*
        Hafif merkez parlaması
    */

    const glow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.min(width, height) * .55
    );

    glow.addColorStop(0, "rgba(255,255,255,.025)");
    glow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    /*
        Kalpler
    */

    for (let i = 0; i < layers; i++) {

        const pulse =
            1 +
            Math.sin(time * 2 + i * .45) * 0.025;

        const base =
            Math.min(width, height) *
            (0.009 + i * 0.0095);

        const rotation =
            time * (i % 2 === 0 ? 0.08 : -0.08);

        drawHeartText(
            base * pulse,
            rotation,
            Math.max(7, base * .08),
            0.15 + i * 0.06,
            Math.max(20, base * .18)
        );
    }

    /*
        Ortadaki küçük kalp
    */

    ctx.save();

    ctx.translate(width / 2, height / 2);

    const centerScale =
        1 +
        Math.sin(time * 3) * 0.08;

    ctx.scale(centerScale, centerScale);

    ctx.font = "42px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "white";

    ctx.shadowColor = "white";
    ctx.shadowBlur = 25;

    ctx.fillText("🤍", 0, 0);

    ctx.restore();

    requestAnimationFrame(animate);
}

animate();