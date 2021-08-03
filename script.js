"uses strict";
//Selecciono el deslizador de cambio de dificultad
const nivel=document.getElementById("rango");
//con la escucha de input solo cambia cuando se asigna el valor final al range
nivel.addEventListener("change", start);
//Selecciono el boton para generar el laberinto
const boton=document.getElementById("boton");
boton.addEventListener("click", start);
//Selecciono e instancio el canvas
const lienzo=document.getElementById("lienzo");
const ctx=lienzo.getContext("2d");

start(); // Inicio la página con las condiciones inciales, en dificultad mínima
function start(){
    /*=======================BLOQUE DE VARIABLES GLOBALES(sin asignación de modificador)====================== */
    tamañoCelda=cambiarCelda(); //funcion y asignación de cambio dinámico del tamaño de las celdas 
    anchoLinea=tamañoCelda*0.05;//Asignación del ancho de dibujo del laberinto en relación al tamaño de las celdas
    ancho=lienzo.clientWidth; //Esta línea obtiene el ancho del canvas
    alto=lienzo.clientHeight; //Esta línea obtiene el alto del canvas
    columnas= ancho/tamañoCelda;//Variable en la que se almacenan la cantidad de columnas
    filas =alto/tamañoCelda; //Variable en la que se almacenan todas las filas
    stack=[];//stack de celdas recorridas
    celdas = [];//Array inicialmente, luego matriz de objetos del tipo celda

    class Celda{
        constructor (x,y ) { 
            this.x = x; //ubicación en el eje x   
            this.y = y; //ubicación en el eje x    
            this.visitada = false;//Me permite ver que celda fue visitada 
            //Si las paredes se dibujan es porque las celdas siguientes están en valor=true    
            this.izquierda = true;    
            this.arriba = true;    
            this.derecha = true;    
            this.abajo = true;
            }
            dibujar(tamañoCelda) { 
                //Obtengo la posición de las celdas individuales por su ancho
                let i = this.x * tamañoCelda;
                let j = this.y * tamañoCelda; 
                //Estilo a las celdas visitadas y a las que no 
                if (this.visitada){ 
                    ctx.fillStyle="white";
                } else {
                    ctx.fillStyle="white";
                }
                ctx.fillRect(i, j, tamañoCelda, tamañoCelda);
                //A partir de esta línea se dibujan las 4 paredes de cada celda individual
                ctx.fillStyle="black"; //Defino las líneas de color negro
                ctx.lineWidth = anchoLinea;//Defino el ancho de línea
                if (this.derecha) {
                    ctx.beginPath();//Comienzo dibujo
                    ctx.moveTo(i+tamañoCelda,j);//Me muevo a la ubicación determinada
                    ctx.lineTo(i+tamañoCelda,j+tamañoCelda);//Trazo una línea hasta...
                    ctx.stroke();//Le doy el contorno 
                    ctx.closePath();//Ciero trazado
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
        //Creo el la matriz de objetos celdas de acuerdo al tamaño del laberinto
        for (let y=0; y< filas; y++) {    
            const filas_int = [];    
            for (let x = 0; x < columnas; x++) { 
                filas_int.push(new Celda(x, y));    
            }    
            celdas.push(filas_int);    
        }
        //La primera celda visitada será random asi genero las ramificaciones 
        let aux=[];
        aux[0]=Math.trunc(Math.random() * filas,0);
        aux[1]=Math.trunc(Math.random() * columnas,0);
        const primera=celdas[aux[0]][aux[1]];
        primera.visitada=true;
        stack.push(primera);  
    }
    function dibujar() { 
       //Mientras halla elementos en el stack se ejecuta la pila aleatoria
        while (stack.length > 0){
            let actual = stack[stack.length - 1];        
            let validador = false; //Variable que controla el ingreso al aumento del stack       
            let checks = 0; //Cantidad de iteraciones posibles ante la falla de la dirección random
            while (!validador && checks < 50) { 
                checks++;
                let direccion = Math.round(Math.random() * 3)    
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
                stack.pop(); //Sino encontró ninguna ruta posible al rededor el stack se decrementa para seguir buscando   
            }
        }
        //Dibujo las celdas sin las paredes correspondientes  
        for (let y = 0; y< filas; y++) {
            for (let x = 0; x<columnas; x++) { 
                celdas[y][x].dibujar(tamañoCelda);    
            }
        }
    }
    //Función para acomodar estéticamente los bordes y darle entrada y salida al laberinto
    function inicioFin(){       
        ctx.beginPath();
        ctx.lineWidth = anchoLinea;
        ctx.moveTo(anchoLinea/2,anchoLinea/2);
        ctx.lineTo(ancho-(anchoLinea/2),anchoLinea/2);
        ctx.lineTo(ancho-(anchoLinea/2),alto-(anchoLinea/2));
        ctx.lineTo(anchoLinea/2, alto-(anchoLinea/2));
        ctx.lineTo(anchoLinea/2,anchoLinea/2);
        ctx.stroke();
        ctx.closePath();    
        ctx.clearRect(0,anchoLinea,anchoLinea*1.1,tamañoCelda-anchoLinea);
        ctx.clearRect(ancho-anchoLinea*1.1,alto-tamañoCelda,anchoLinea*2,tamañoCelda);
        //"Personaje" de inicio de posición en el origen de coordenadas
        ctx.beginPath();
        ctx.fillStyle="red";
        ctx.arc(tamañoCelda/2, tamañoCelda/2, (tamañoCelda/2)*0.7, 0, 2 * Math.PI);
        ctx.fill();        
    }
    //Función de selección de nivel
    function cambiarCelda(){
        let aux=0; 
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
        }
    }
    inicio();
    dibujar();
    inicioFin();
    //Inicio de variables de movimiento de personaje
    desp_x=0;
    desp_y=0;
    actualPersonaje=celdas[desp_y][desp_x];
}
document.addEventListener("keydown", function(e){
    ctx.fillStyle="#002db3";
    switch(e.key){
        case "ArrowRight":
            if(actualPersonaje.x<ancho && actualPersonaje.derecha==false){
                desp_x+=1;
                actualPersonaje=celdas[desp_y][desp_x];
                ctx.fillRect(actualPersonaje.x*tamañoCelda +anchoLinea*2, actualPersonaje.y*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);
                ctx.clearRect((actualPersonaje.x-1)*tamañoCelda +anchoLinea*2, actualPersonaje.y*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);               
            }else if (actualPersonaje.x+1==columnas && actualPersonaje.y+1==filas){ 
                alert("Ganaste");
            }
        break;
        case "ArrowDown":
            if(actualPersonaje.y<alto && actualPersonaje.abajo==false){
                desp_y+=1;
                actualPersonaje=celdas[desp_y][desp_x];
                ctx.fillRect(actualPersonaje.x*tamañoCelda +anchoLinea*2, actualPersonaje.y*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);
                ctx.clearRect(actualPersonaje.x*tamañoCelda +anchoLinea*2, (actualPersonaje.y-1)*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);               
            }
        break;
        case "ArrowLeft":
            if(actualPersonaje.x>0 && actualPersonaje.izquierda==false){
                desp_x-=1;
                actualPersonaje=celdas[desp_y][desp_x];
                ctx.fillRect(actualPersonaje.x*tamañoCelda +anchoLinea*2, actualPersonaje.y*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);
                ctx.clearRect((actualPersonaje.x+1)*tamañoCelda +anchoLinea*2, actualPersonaje.y*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);               
            } 
        break;
        case "ArrowUp":
            if(actualPersonaje.y>0 && actualPersonaje.arriba==false){
                desp_y-=1;
                actualPersonaje=celdas[desp_y][desp_x];
                ctx.fillRect(actualPersonaje.x*tamañoCelda +anchoLinea*2, actualPersonaje.y*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);
                ctx.clearRect(actualPersonaje.x*tamañoCelda +anchoLinea*2, (actualPersonaje.y+1)*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);               
            }
        break;
    }       
});
let x_inicial=0;
let y_inicial=0;
let x_final=0;
let y_final=0;
lienzo.addEventListener("touchstart", function(e){
    x_inicial = e.changedTouches[0].pageX;
    y_inicial = e.changedTouches[0].pageY;
    x_inicial=Math.trunc(x_inicial,0);
    y_inicial=Math.trunc(y_inicial,0);
}); 
//touchstart, touchend,touchcancel,touchcancel,touchmove
lienzo.addEventListener("touchend", function(e){
    x_final = e.changedTouches[0].pageX;
    y_final = e.changedTouches[0].pageY;
    x_final=Math.trunc(x_final,0);
    y_final=Math.trunc(y_final,0);
});
lienzo.addEventListener("touchend", function(){
    let aux=[];
    aux[0]=x_final-x_inicial;
    aux[1]=y_final-y_inicial;
    aux[2]=Math.abs(aux[0]);
    aux[3]=Math.abs(aux[1]);
    if (aux[2]>aux[3]){
        if (aux[0]>0){
            if(actualPersonaje.x<ancho && actualPersonaje.derecha==false){
                desp_x+=1;
                actualPersonaje=celdas[desp_y][desp_x];
                ctx.fillRect(actualPersonaje.x*tamañoCelda +anchoLinea*2, actualPersonaje.y*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);
                ctx.clearRect((actualPersonaje.x-1)*tamañoCelda +anchoLinea*2, actualPersonaje.y*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);               
            }else if (actualPersonaje.x+1==columnas && actualPersonaje.y+1==filas){ 
                alert("Ganaste");
            }
        }else{
            if(actualPersonaje.x>0 && actualPersonaje.izquierda==false){
                desp_x-=1;
                actualPersonaje=celdas[desp_y][desp_x];
                ctx.fillRect(actualPersonaje.x*tamañoCelda +anchoLinea*2, actualPersonaje.y*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);
                ctx.clearRect((actualPersonaje.x+1)*tamañoCelda +anchoLinea*2, actualPersonaje.y*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);               
            }
        }
    }else{
        if (aux[1]>0){
            if(actualPersonaje.y<alto && actualPersonaje.abajo==false){
                desp_y+=1;
                actualPersonaje=celdas[desp_y][desp_x];
                ctx.fillRect(actualPersonaje.x*tamañoCelda +anchoLinea*2, actualPersonaje.y*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);
                ctx.clearRect(actualPersonaje.x*tamañoCelda +anchoLinea*2, (actualPersonaje.y-1)*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);               
            }
         }else{
            if(actualPersonaje.y>0 && actualPersonaje.arriba==false){
                desp_y-=1;
                actualPersonaje=celdas[desp_y][desp_x];
                ctx.fillRect(actualPersonaje.x*tamañoCelda +anchoLinea*2, actualPersonaje.y*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);
                ctx.clearRect(actualPersonaje.x*tamañoCelda +anchoLinea*2, (actualPersonaje.y+1)*tamañoCelda+anchoLinea*2,tamañoCelda*0.8, tamañoCelda*0.8);               
            }
    }
    }
}); 