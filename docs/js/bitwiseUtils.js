function randomHex(length){
    let hex = ''
    for(let i=0;i<length;i++){
        hex += parseInt(Math.random()*16).toString(16)
    }
    return hex 
}

// Binary string to Hex
function bin2hex(bin){
    //return parseInt(bin, 2).toString(16).padStart(64,'0')
    
    let parts = bin.match(/.{1,4}/g) // Replace n with the size of the substring
    let hex = parts.map( b=>parseInt(b, 2).toString(16)).join('')

    return hex
}

function hexToBigInt(hex){
    let v = BigInt(0)
    for(let i=0;i<hex.length;i++){
        v *= 16n
        v += BigInt(parseInt(hex.substr(i,1),16))
    }
    return v
}


// HEX -- bits arranged in a grid, coordinate functions
function peek(hex,x,y,width=16,height=16){
    /*
    return  x >= 0 && x < 16 && y >= 0 && y < 16 &&
            (parseInt(sprite.substr(-4*(y+1),4),16) & 1 << x) > 0
    */
   let bit = y*width+x
   let bigNum = hexToBigInt(hex)

   return   x >= 0 && x < width && y >= 0 && y < height && // keep within bounds
            (bigNum & 1n << BigInt(bit)) > 0n
}

function poke(hex,x,y,width=16,height=16){
    
    let bit = y*width+x
    let bigNum = hexToBigInt(hex)
    return x >= 0 && x < width && y >= 0 && y < height ? (bigNum | (1n << BigInt(bit))).toString(16).padStart(64,'0') : sprite
 }


function unset(hex,x,y,width=16,height=16){
    let bit = y*width+x
    let mask = BigInt(0) // fill with bits except for the unset bit
    for(let i=0; i<width*height; i++){
        mask = width*height-1-i === bit ? mask << 1n : (mask << 1n) + 1n // count from the end
    }
    let bigNum = hexToBigInt(hex)
    return x >= 0 && x < width && y >= 0 && y < height ? (bigNum & mask).toString(16).padStart(64,'0') : hex
}