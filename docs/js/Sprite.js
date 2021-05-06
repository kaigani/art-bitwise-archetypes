// Create a new sprite objects
// width x height dimensions 
// includes imageData to be rendered at draw time

class Sprite {
    constructor(hex,width,height,scale=1){
        this.hex = hex
        this.width = width
        this.height = height
        this.scale = scale
        this.canvas =  newCanvas(width*scale,height*scale),
        this.imageData = createImageData(width,height)

    }

    setPixel(x,y){
        //setPixel(this.imageData,p,x,y) // from canvasUtils
        this.hex = poke(this.hex,x,y,this.width,this.height) // from bitwiseUtils
    }

    setHex(hex){
        this.hex = hex

    }

    // color = {r:...,g:...,b:...,a:...}
    // dx,dy - canvas offset
    draw(canvas,color,dx=0,dy=0){
        
        const clearColor = {r:0,g:0,b:0,a:0}
        for(let x=0;x<this.width;x++){
            for(let y=0;y<this.height;y++){
                if(peek(this.hex,x,y,this.width,this.height)){
                    setPixel(this.imageData,color,x,y)
                }else{
                    setPixel(this.imageData,clearColor,x,y)
                }
            }
        }
        // write to internal canvas
        this.canvas.getContext('2d').putImageData(this.scale === 1 ? this.imageData : scaleImageData(this.imageData,this.scale), 0, 0)
        // draw to external canvas
        canvas.getContext('2d').drawImage(this.canvas, dx, dy)
    }
}

/*
function createSprite(hex,width,height){

    let sprite = {
        hex: hex,
        width: width,
        height: height,
        canvas: newCanvas(width,height),
        imageData: createImageData(width,height)
    }

    sprite.setPixel = (p,x,y)=>{
        setPixel(sprite.imageData,p,x,y)
        sprite.hex = poke(sprite.hex,x,y,sprite.width,sprite.height)
    }

    sprite.update = ()=>{
        sprite.canvas.getContext('2d').putImageData(sprite.imageData, 0, 0)
    }

    //sprite.canvas.style.imageRendering = 'pixelated'

    let p = { r: 255, b: 0, g: 0, a: 255 }

    for(let x=0;x<width;x++){
        for(let y=0;y<height;y++){
            if(peek(hex,x,y,width,height)){
                sprite.setPixel(p,x,y)
            }
        }
    }

    sprite.update()

    return sprite
}

function updateSprite(sprite,hex){

    let pOn = { r: 255, b: 0, g: 0, a: 255 }
    let pOff = { r: 0, b: 0, g: 0, a: 0 }

    for(let x=0;x<sprite.width;x++){
        for(let y=0;y<sprite.height;y++){
            if(peek(hex,x,y,sprite.width,sprite.height)){
                sprite.setPixel(pOn,x,y)
            }else{
                sprite.setPixel(pOff,x,y)
                sprite.hex = unset(sprite.hex,x,y,sprite.width,sprite.height)
            }
        }
    }

    sprite.update()
}
*/