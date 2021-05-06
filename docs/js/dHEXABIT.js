const paletteMap = mapPalette()
console.log('paletteMap',paletteMap)
const cleanIndex = generatePatternIndex(paletteMap)
const randomIndex = generatePatternIndex(paletteMap,true) // randomized



function drawPixelized(){
    renderPixelized(document.getElementsByTagName('canvas')[1],document.getElementsByTagName('canvas')[0])
}

// transfer from the source image to a pattern rendered version 2x in size
function renderPixelized(from,to,variation=false){
    let c1 = from.getContext('2d')
    let c2 = to.getContext('2d')
    let imageDataFrom = c1.getImageData(0,0,128,128)
    let imageDataTo = c2.createImageData(256,256)

    for(let x=0;x<128;x++){
        for(let y=0;y<128;y++){

            let pattern = variation ? getClosestPatternFromPixelVariation(getPixel(imageDataFrom,x,y)) : getClosestPatternFromPixel(getPixel(imageDataFrom,x,y))
            setPixel(imageDataTo,pattern[0],x*2,y*2)
            setPixel(imageDataTo,pattern[1],x*2+1,y*2)
            setPixel(imageDataTo,pattern[2],x*2,y*2+1)
            setPixel(imageDataTo,pattern[3],x*2+1,y*2+1)
        }
    }
    //c2.putImageData(scaleImageData(imageDataTo,4),0,0) // 1024 scale
    c2.putImageData(imageDataTo,0,0)

    // capture the value of imageData
    //let bitmap = imageDataTo.data.reduce((prev,curr)=>{ return curr ? '1'+prev : '0'+prev },'')
    //bitmap = bin2hex(bitmap)
    //let bitmap = from.toDataURL('image/png')
    //console.log('BITMAP:',bitmap)
}

// removes redundant items from the list
function generatePatternIndex(map,random=false){
                
    // count all the duplicates
    let o = map.reduce( (prev,curr,i)=>{
        let key = pixelToHexColor(curr)
        prev[key] = prev.hasOwnProperty(key) ? prev[key] : []
        prev[key].push(i)
        return prev
    },{})
    //return o
    let index = Object.keys(o).map( key =>{
        let choose_i = random ? o[key][ parseInt( Math.random() * o[key].length )] : o[key][ o[key].length-1 ]
        return choose_i
        //return o[key][0]
    })
    return index
}

// pixel conversion
function pixelToHexColor(p){
    return `#${p.r.toString(16).padStart(2,'0')}${p.g.toString(16).padStart(2,'0')}${p.b.toString(16).padStart(2,'0')}`
}

// lookup the closest pattern in terms of distance to the given pixel
// this function determines what type of pattern we get - clean or with variation
/*
function getClosestPatternFromPixel(p){

    let o = paletteMap.reduce( (prev,curr,i)=>{

        let dist = colorDistance(p,curr)

        if(prev === null || dist < prev.dist ){
            return {
                dist: dist,
                match: [i]
            }
        }else if( dist === prev.dist ){
            prev.match.push(i)
            return prev
        }else{
            return prev
        }
    },null)

    //o.match.length > 128 && console.log('Match list len',o.match.length,o.match,p)
    //let rand_i = parseInt(Math.random()*o.match.length)
    let rand_i = o.match.length-1
    return valueToPattern(o.match[rand_i])
}
*/
function getClosestPatternFromPixel(p){

    let o = cleanIndex.reduce( (prev,curr,i)=>{

        let p2 = paletteMap[curr]
        let dist = colorDistance(p,p2)

        if(prev === null || dist < prev.dist ){
            return {
                dist: dist,
                match: [curr]
            }
        }else if( dist === prev.dist ){
            prev.match.push(curr)
            return prev
        }else{
            return prev
        }
    },null)

    //o.match.length > 128 && console.log('Match list len',o.match.length,o.match,p)
    let rand_i = parseInt(Math.random()*o.match.length)
    //let rand_i = o.match.length-1
    return valueToPattern(o.match[0])
}

// lookup the closest pattern in terms of distance to the given pixel - with variation
function getClosestPatternFromPixelVariation(p){

    let o = randomIndex.reduce( (prev,curr,i)=>{

        let p2 = paletteMap[curr]
        let dist = colorDistance(p,p2)

        if(prev === null || dist < prev.dist ){
            return {
                dist: dist,
                match: [curr]
            }
        }else if( dist === prev.dist ){
            prev.match.push(curr)
            return prev
        }else{
            return prev
        }
    },null)

    //o.match.length > 128 && console.log('Match list len',o.match.length,o.match,p)
    let rand_i = parseInt(Math.random()*o.match.length)
    //let rand_i = o.match.length-1
    return valueToPattern(o.match[0])
}

// map all 4096 patterns to a single pixel of color
function mapPalette(){
    let map = []
    for(let i=0;i<4096;i++){
        let pt = valueToPattern(i)
        map.push({
            r: Math.floor((pt[0].r + pt[1].r + pt[2].r + pt[3].r)/4),
            g: Math.floor((pt[0].g + pt[1].g + pt[2].g + pt[3].g)/4),
            b: Math.floor((pt[0].b + pt[1].b + pt[2].b + pt[3].b)/4),
        })
    }
    return map
}

// 'distance' between 2 RGB values
function colorDistance(p1,p2){
    return Math.sqrt( Math.pow(p2.r-p1.r,2) + Math.pow(p2.g-p1.g,2) + Math.pow(p2.b-p1.b,2) )
}

// this is a custom pattern background
function drawPattern(canvas,value){

    let c = canvas.getContext('2d')
    let w = 256
    let h = 256
    let imageData = c.createImageData(w,h)


    // convert the value to the pixel pattern

    let pattern = valueToPattern(value)
    console.log('Pattern matrix',pattern)

    for(let x=0;x<w;x++){
        for(let y=0;y<h;y++){
            let offset = 2*(y%2)+(x%2)
            let pick = Math.random() < 0.5 ? pattern[0] : pattern[offset]
            setPixel(imageData,pick,x,y)
        }
    }

    c.putImageData(scaleImageData(imageData,4), 0, 0)
}

// Returns an array of RGB pixels from a the bits of an integer
// d: 111 c: 111 b: 111 a: 111
// [a,b,c,d]
// represents a 2x2 pattern
// a b
// c d
function valueToPattern(value){
    let pattern = []
    for(let i=0;i<4;i++){
        let p = { r:0,g:0,b:0,a:255 }
        p.r = value & 4 ? 255 : 0 // red
        p.g = value & 2 ? 255 : 0 // green
        p.b = value & 1 ? 255 : 0 // blue
        pattern.push(p)
        value = value >> 3
    }
    return pattern 
}