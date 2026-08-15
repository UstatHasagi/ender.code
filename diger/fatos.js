const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let W = 0;
let H = 0;
let dpr = 1;

function resize() {

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resize);
resize();

/* ================================================= */
/*                     SAKURA                        */
/* ================================================= */

const petals = [];

const PETAL_COUNT = 45;

for (let i = 0; i < PETAL_COUNT; i++) {

    petals.push({
        x: Math.random() * W,
        y: Math.random() * H,

        size: Math.random() * 8 + 5,

        speed: Math.random() * 1.2 + .4,

        rotation: Math.random() * Math.PI * 2,

        rotationSpeed:
            (Math.random() - .5) * .025,

        sway: Math.random() * Math.PI * 2,

        swaySpeed:
            Math.random() * .015 + .005,

        opacity:
            Math.random() * .45 + .35
    });

}

function drawPetal(p) {

    ctx.save();

    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    ctx.globalAlpha = p.opacity;

    ctx.fillStyle = "#f3b6c8";

    ctx.beginPath();

    /*
        Sakura yaprağı şekli
    */

    ctx.moveTo(0, -p.size);

    ctx.bezierCurveTo(
        p.size,
        -p.size * .65,
        p.size,
        p.size * .5,
        0,
        p.size
    );

    ctx.bezierCurveTo(
        -p.size,
        p.size * .5,
        -p.size,
        -p.size * .65,
        0,
        -p.size
    );

    ctx.fill();

    /*
        Ortadaki küçük çentik
    */

    ctx.fillStyle = "#000";

    ctx.beginPath();

    ctx.moveTo(0, -p.size);
    ctx.lineTo(-2, -p.size * .35);
    ctx.lineTo(2, -p.size * .35);

    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function updatePetals() {

    for (const p of petals) {

        p.y += p.speed;

        p.sway += p.swaySpeed;

        p.x += Math.sin(p.sway) * .45;

        p.rotation += p.rotationSpeed;

        if (p.y > H + 30) {

            p.y = -30;

            p.x = Math.random() * W;
        }

        if (p.x > W + 30) {
            p.x = -30;
        }

        if (p.x < -30) {
            p.x = W + 30;
        }

    }

}

/* ================================================= */
/*                  KALP FONKSİYONU                  */
/* ================================================= */

function heartPoint(t, scale) {

    const x =
        16 * Math.pow(Math.sin(t), 3);

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

/* ================================================= */
/*              KALBE YAZI DİZME                   */
/* ================================================= */

function drawHeart(time) {

    const centerX = W / 2;
    const centerY = H / 2;

    /*
        Ekrana göre kalp boyutu
    */

    const scale =
        Math.min(W, H) * 0.026;

    /*
        Kalbin nefes alması
    */

    const pulse =
        1 +
        Math.sin(time * 0.0022) * 0.035;

    ctx.save();

    ctx.translate(centerX, centerY);

    /*
        Hafif dönen ışık
    */

    const glow =
        Math.sin(time * 0.002) * 5 + 18;

    ctx.shadowColor = "rgba(255,255,255,.8)";
    ctx.shadowBlur = glow;

    ctx.fillStyle = "#fff";

    ctx.font = "600 14px Arial";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    /*
        Yazı kalbin çizgisi boyunca ilerliyor
    */

    const text = "FATOŞ 🤍";

    const total = 300;

    for (let i = 0; i < total; i++) {

        const t =
            (Math.PI * 2 / total) * i;

        const p =
            heartPoint(t, scale * pulse);

        /*
            Bir sonraki nokta ile açı hesaplama
        */

        const next =
            heartPoint(
                t + 0.012,
                scale * pulse
            );

        const angle =
            Math.atan2(
                next.y - p.y,
                next.x - p.x
            );

        /*
            Hafif hareket
        */

        const wave =
            Math.sin(
                time * 0.0018 +
                i * .15
            ) * .8;

        ctx.save();

        ctx.translate(
            p.x,
            p.y + wave
        );

        ctx.rotate(angle);

        /*
            Küçük noktaları biraz şeffaf,
            ana yazıları daha parlak yap
        */

        ctx.globalAlpha =
            .72 +
            Math.sin(
                time * 0.002 +
                i * .08
            ) * .18;

        ctx.fillText(
            text,
            0,
            0
        );

        ctx.restore();
    }

    ctx.restore();

}

/* ================================================= */
/*                 MERKEZ PARLAMA                   */
/* ================================================= */

function drawCenterGlow(time) {

    const pulse =
        1 +
        Math.sin(time * .003) * .08;

    const radius =
        75 * pulse;

    const gradient =
        ctx.createRadialGradient(
            W / 2,
            H / 2,
            0,
            W / 2,
            H / 2,
            radius
        );

    gradient.addColorStop(
        0,
        "rgba(255,255,255,.08)"
    );

    gradient.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        W / 2 - radius,
        H / 2 - radius,
        radius * 2,
        radius * 2
    );

}

/* ================================================= */
/*                     ANİMASYON                    */
/* ================================================= */

let start = performance.now();

function animate(now) {

    const time = now - start;

    /*
        Temizleme
    */

    ctx.clearRect(
        0,
        0,
        W,
        H
    );

    /*
        Hafif siyah üzerine beyaz ışık
    */

    const bg =
        ctx.createRadialGradient(
            W / 2,
            H / 2,
            0,
            W / 2,
            H / 2,
            Math.min(W,H) * .6
        );

    bg.addColorStop(
        0,
        "rgba(255,255,255,.025)"
    );

    bg.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = bg;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

    /*
        Sakura
    */

    updatePetals();

    for (const petal of petals) {
        drawPetal(petal);
    }

    /*
        Kalp
    */

    drawHeart(time);

    /*
        Merkez ışığı
    */

    drawCenterGlow(time);

    requestAnimationFrame(animate);

}

requestAnimationFrame(animate);