const container = document.getElementById("particles");

const canvas = document.createElement("canvas");
container.appendChild(canvas);

const ctx = canvas.getContext("2d");

let w;
let h;

function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

const particles = [];
const count = 45;

for(let i=0;i<count;i++){

    particles.push({

        x:Math.random()*w,
        y:Math.random()*h,

        vx:(Math.random()-.5)*0.7,
        vy:(Math.random()-.5)*0.7,

        r:2+Math.random()*3

    });

}

function animate(){

    ctx.clearRect(0,0,w,h);

    for(let i=0;i<particles.length;i++){

        const p=particles[i];

        p.x+=p.vx;
        p.y+=p.vy;

        if(p.x<0||p.x>w) p.vx*=-1;
        if(p.y<0||p.y>h) p.vy*=-1;

        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="#3b82f6";
        ctx.fill();

        for(let j=i+1;j<particles.length;j++){

            const q=particles[j];

            const dx=p.x-q.x;
            const dy=p.y-q.y;

            const dist=Math.sqrt(dx*dx+dy*dy);

            if(dist<140){

                ctx.beginPath();

                ctx.moveTo(p.x,p.y);

                ctx.lineTo(q.x,q.y);

                ctx.strokeStyle="rgba(59,130,246,"+(1-dist/140)*0.35+")";

                ctx.lineWidth=1;

                ctx.stroke();

            }

        }

    }

    requestAnimationFrame(animate);

}

animate();