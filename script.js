const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let spieler = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    größe: 25,
    geschwindigkeit: 4
};

let zombies = [];
let kugeln = [];

let leben = 100;
let punkte = 0;

let bewegung = {
    x: 0,
    y: 0
};


// Zombie erstellen
function zombieErstellen() {
    zombies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        größe: 30,
        geschwindigkeit: 1.2
    });
}

setInterval(zombieErstellen, 1500);


// Schießen
function schießen() {

    kugeln.push({
        x: spieler.x,
        y: spieler.y,
        geschwindigkeit: 8
    });

}


// Spiel zeichnen
function spiel() {

    ctx.clearRect(0,0,canvas.width,canvas.height);


    // Spieler
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(spieler.x, spieler.y, spieler.größe,0,Math.PI*2);
    ctx.fill();



    // Kugeln
    ctx.fillStyle = "yellow";

    kugeln.forEach((kugel,index)=>{

        kugel.y -= kugel.geschwindigkeit;

        ctx.beginPath();
        ctx.arc(kugel.x,kugel.y,6,0,Math.PI*2);
        ctx.fill();


        if(kugel.y < 0){
            kugeln.splice(index,1);
        }

    });



    // Zombies

    ctx.fillStyle="green";

    zombies.forEach((zombie,zIndex)=>{

        let dx = spieler.x - zombie.x;
        let dy = spieler.y - zombie.y;

        let entfernung = Math.sqrt(dx*dx+dy*dy);


        zombie.x += dx/entfernung * zombie.geschwindigkeit;
        zombie.y += dy/entfernung * zombie.geschwindigkeit;


        ctx.beginPath();
        ctx.arc(zombie.x,zombie.y,zombie.größe,0,Math.PI*2);
        ctx.fill();



        // Treffer prüfen

        kugeln.forEach((kugel,kIndex)=>{

            let abstand =
            Math.sqrt(
            (kugel.x-zombie.x)**2 +
            (kugel.y-zombie.y)**2
            );


            if(abstand < zombie.größe){

                zombies.splice(zIndex,1);
                kugeln.splice(kIndex,1);

                punkte += 10;

                document.getElementById("punkteText").innerHTML=punkte;
            }

        });



        // Zombie trifft Spieler

        if(entfernung < 40){

            leben -= 0.5;

            document.getElementById("lebenText").innerHTML=
            Math.floor(leben);

        }

    });



    // Bewegung

    spieler.x += bewegung.x * spieler.geschwindigkeit;
    spieler.y += bewegung.y * spieler.geschwindigkeit;


    requestAnimationFrame(spiel);

}

spiel();


// Schuss Taste

document.getElementById("shoot")
.addEventListener("touchstart",schießen);


// einfacher Joystick

let joystick = document.getElementById("joystick");

joystick.addEventListener("touchmove",(e)=>{

    let finger=e.touches[0];

    let rect=joystick.getBoundingClientRect();

    let x=finger.clientX-(rect.left+65);
    let y=finger.clientY-(rect.top+65);


    bewegung.x=x/65;
    bewegung.y=y/65;

});


joystick.addEventListener("touchend",()=>{

    bewegung.x=0;
    bewegung.y=0;

});
