"uses strict";
const nivel=document.getElementById("rango");
nivel.addEventListener("input", start);
const boton=document.getElementById("boton");
boton.addEventListener("click", start);


const lienzo=document.getElementById("lienzo");
const ctx=lienzo.getContext("2d");


start();
function start(){    
    document.addEventListener("keydown", teclado);
    const tamañoCelda=cambiarCelda();
    const anchoLinea=tamañoCelda*0.05;
    const ancho=lienzo.clientWidth;
    const alto=lienzo.clientHeight;
    const columnas= ancho/tamañoCelda;
    const filas =alto/tamañoCelda;
    const stack=[];
    const celdas = [];

    class Celda{
        constructor (x,y ) { 
            this.x = x;    
            this.y = y;    
            this.visitada = false;
                
            this.izquierda = true;    
            this.arriba = true;    
            this.derecha = true;    
            this.abajo = true;
            }
            dibujar(tamañoCelda) { 
                let i = this.x * tamañoCelda;
                let j = this.y * tamañoCelda;  
                if (this.visitada){ 
                    ctx.fillStyle="white";
                } else {
                    ctx.fillStyle="white";
                }
                ctx.fillRect(i, j, tamañoCelda, tamañoCelda);
                ctx.fillStyle="black";
                ctx.lineWidth = anchoLinea;
                if (this.derecha) {
                    ctx.beginPath();
                    ctx.moveTo(i+tamañoCelda,j);
                    ctx.lineTo(i+tamañoCelda,j+tamañoCelda);
                    ctx.stroke();
                    ctx.closePath();
                }
                if (this.abajo) {
                    ctx.beginPath();
                    ctx.moveTo(i,j+tamañoCelda);
                    ctx.lineTo(i+tamañoCelda,j+tamañoCelda);
                    ctx.stroke();
                    ctx.closePath();
                }
                if (this.izquierda){
                    ctx.beginPath();
                    ctx.moveTo(i,j);
                    ctx.lineTo(i,j+tamañoCelda);
                    ctx.stroke();
                    ctx.closePath();
                }
                if (this.arriba) {
                    ctx.beginPath();
                    ctx.moveTo(i,j);
                    ctx.lineTo(i+tamañoCelda,j);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
    }
    function inicio() { 
        for (let y=0; y< filas; y++) {    
            const filas = [];    
            for (let x = 0; x < columnas; x++) { 
                filas.push(new Celda(x, y));    
            }    
            celdas.push(filas);    
        }
        const primera=celdas[0][0];
        primera.visitada=true;
        stack.push(primera);  
    }
    function dibujar() { 
        //cambiar a if si quiero ver el proceso de diseño o while para que se muestre entrero
        while (stack.length > 0){
            let actual = stack[stack.length - 1];        
            let validador = false;        
            let checks = 0;
            while (!validador && checks < 20) { 
                checks++
                let direccion = Math.round(Math.random() * 4)    
                switch (direccion) {        
                // IZQUIERDA        
                    case 0:        
                    if (actual.x > 0) {        
                        let next = celdas[actual.y][actual.x - 1]        
                        if (!next.visitada) { 
                            actual.izquierda = false; 
                            next.derecha = false; 
                            next.visitada = true; 
                            stack.push(next); 
                            validador = true;        
                        }
                    }
                    break;        
                    // arriba        
                    case 1:        
                    if (actual.y > 0) {        
                        let next = celdas[actual.y-1][actual.x]        
                        if (!next.visitada) { 
                            actual.arriba = false; 
                            next.abajo = false;        
                            next.visitada = true; 
                            stack.push(next); 
                            validador = true;        
                        }   
                    }
                    break;        
                    // DERECHA 
                    case 2:        
                    if (actual.x <(columnas-1)) {        
                        let next = celdas[actual.y][actual.x+1]        
                        if (!next.visitada) { 
                            actual.derecha = false; 
                            next.izquierda = false;
                            next.visitada = true; 
                            stack.push(next); 
                            validador = true;        
                        }
                    }
                    break;        
                    // ABAJO    
                    case 3:        
                    if (actual.y <(filas-1)) {        
                        let next = celdas[actual.y+1][actual.x]        
                        if (!next.visitada) { 
                            actual.abajo = false; 
                            next.arriba = false;
                            next.visitada = true 
                            stack.push(next); 
                            validador = true;  
                        }   
                    }
                    break;
                }
            }
            if (!validador){
                stack.pop();    
            }
        }  
        for (let y = 0; y< filas; y++) {
            for (let x = 0; x<columnas; x++) { 
                celdas[y][x].dibujar(tamañoCelda);    
            }
        }
    }
    function inicioFin(){
        let coordenadas=[];
        ctx.beginPath();
        ctx.lineWidth = anchoLinea;
        ctx.moveTo(anchoLinea/2,anchoLinea/2);
        ctx.lineTo(ancho-(anchoLinea/2),anchoLinea/2);
        ctx.lineTo(ancho-(anchoLinea/2),alto-(anchoLinea/2));
        ctx.lineTo(anchoLinea/2, alto-(anchoLinea/2));
        ctx.lineTo(anchoLinea/2,anchoLinea/2);
        ctx.stroke();
        ctx.closePath();    
        ctx.clearRect(0,anchoLinea,anchoLinea,tamañoCelda-anchoLinea);
        ctx.clearRect(ancho-anchoLinea*1.1,alto-tamañoCelda,anchoLinea*2,tamañoCelda);
        
        ctx.beginPath();
        ctx.fillStyle="red";
        ctx.arc(tamañoCelda/2, tamañoCelda/2, (tamañoCelda/2)*0.7, 0, 2 * Math.PI);
        ctx.fill();        
    }
    function cambiarCelda(){
        let aux=5; 
        aux=parseInt(nivel.value);
        switch (aux){
            case 0:
                return aux=300;
            case 1:
                return aux=200;
            case 2:
                return aux=100;
            case 3:
                return aux=50;
            case 4:
                return aux=20;
            case 5:
                return aux=10;
            case 6:
                return aux=5;       
        }

    }
    cambiarCelda();
    inicio();
    dibujar();
    inicioFin();

    const recorrido=[];
    const primera1=celdas[0][0];
    primera1.visitada=true;
    recorrido.push(primera1);

           
     

    function teclado(e){
        let actual = recorrido[recorrido.length - 1]; 
        //izquierda
        if(e.keyCode==37){
            
        }
        //arriba
        if(e.keyCode==38){
            alert("Arriba");
        }
        //derecha
        if(e.keyCode==39 && actual.x<ancho){
            let next = celdas[actual.y][actual.x + 1]
            if (actual.derecha==false){ 
                ctx.fillStyle="red";
                ctx.fillRect(((actual.x-1)*tamañoCelda)+anchoLinea*2,actual.y+anchoLinea*2,tamañoCelda-anchoLinea*4,tamañoCelda-anchoLinea*4);  
                recorrido.push(next);
            }
            
            // ctx.beginPath();
            // ctx.fillStyle="red";
            // ctx.arc((tamañoCelda/2), (tamañoCelda/2), (tamañoCelda/2)*0.7, 0, 2 * Math.PI);
            // ctx.fill();  
            
        }
        //abajo
        if(e.keyCode==40){
            alert("Abajo");
        }
    }
}
