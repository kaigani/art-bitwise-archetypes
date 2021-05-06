	
//
// imagePatternVGA
// canvasPatternVGA
// -----------
// Map 8-bit color bitmap to patterns in a 2x2 grid
//

/*
 *	[ 0-7 ] [ 0-7 ]
 *	[ 0-7 ] [ 0-7 ]
 *
 *	[ b b b ] [ b b b ] [ b b b ] [ b b b ] >> 3 = [ b b b ] [ b b b ] [ b b b ] >> 3 ...
 *									^ ^ ^ test these 3 bits for R,G,B
 *	R = 1 0 0 = 4
 *	G = 0 1 0 = 2
 *	B = 0 0 1 = 1
 *
 */

 // ORDER 
 // -----
 // lower hexabit \ upper hexabit 
 // 
 // hexabit: top - fifth - fourth - third - second - beginning 
 //
 // 4:[ r g b ] 3:[ r g b ] \ 2:[ r g b ] 1:[ r g b ]
 //
 //  [ 1 ] [ 2 ]
 //  [ 3 ] [ 4 ]
 //

 // USAGE 
 //
 // ctx.drawImage( imagePatternVGA(44,2) )
 // ctx.fillStyle = canvasPatternVGA(444,2)
 //
 // let image = new Image(); 
 // img.src = imagePatternVGA.toDataURL('image/png')
 //


function imagePatternVGA(bitmap,scale,rgbaSettings){

	rgbaSettings = rgbaSettings || {r:255,g:255,b:255,a:255}
	rgbaSettings.a = rgbaSettings.a || 255

	scale = (scale > 0)?scale:1; // minimum scale:1x1

	let pattern_id = bitmap

	let patternData = createImageData(2,2)

	let p = rgbaSettings; // could define custom red,green,blue values to change palette

	let bit_red = 1 << 2
	let bit_green =  1 << 1
	let bit_blue = 1 << 0

	for(let i=0;i<patternData.data.length;i+=4){

		let n = i/4
		let redBit = 4 << n

		if(bitmap & bit_red) patternData.data[i] = p.r
		if(bitmap & bit_green) patternData.data[i+1] = p.g
		if(bitmap & bit_blue) patternData.data[i+2] = p.b
		patternData.data[i+3] = p.a

		bitmap = bitmap >> 3
	}

	patternData = scaleImageData(patternData,scale)
	
	let imagePattern = imageDataToCanvas(patternData)

	return imagePattern
}

function canvasPatternVGA(bitmap,scale,rgbaSettings){

	rgbaSettings = rgbaSettings || {r:255,g:255,b:255,a:255}
	rgbaSettings.a = rgbaSettings.a || 255

	let imagePattern = imagePatternVGA(bitmap,scale,rgbaSettings)
	let ctx = imagePattern.getContext('2d')
	let pattern = ctx.createPattern(imagePattern,'repeat')

	return pattern
}

//
// Helper functions
//

tmpCanvas = document.createElement('canvas')
tmpCtx = tmpCanvas.getContext('2d')

function createImageData(w, h) {
	return tmpCtx.createImageData(w, h)
}

function imageDataToCanvas(imageData) {
    let canvas = newCanvas(imageData.width, imageData.height)
    canvas.getContext('2d').putImageData(imageData, 0, 0)
    return canvas
}

function newCanvas(w,h) {
	let c = document.createElement('canvas')
	c.width = w
	c.height = h
	return c
}

function scaleImageData(imageData,scale){

	scale = (scale>0)?scale:1

	let output = createImageData(imageData.width*scale, imageData.height*scale)
	let w = imageData.width
	let h = imageData.height
	let dst = output.data
	let d = imageData.data

	for (let y=0; y<h; y++) {
		for (let x=0; x<w; x++) {

			let p = getPixel(imageData,x,y)

			let offsetX = x*scale
			let offsetY = y*scale
			for(let outY=0; outY<scale; outY++){
				for(let outX=0; outX<scale;outX++){

					setPixel(output,p,outX+offsetX,outY+offsetY)
				}
			}
			//setPixel(output,p,x*2,y*2)
			//setPixel(output,p,x*2+1,y*2)
			//setPixel(output,p,x*2,y*2+1)
			//setPixel(output,p,x*2+1,y*2+1)
		}
	}
	return output
}

function getPixel(imageData,x,y){

	let w = imageData.width
	let h = imageData.height
	let off = (y*w+x)*4
	let d = imageData.data

	return { r: d[off], g: d[off+1], b: d[off+2], a: d[off+3] }
}

function setPixel(imageData,p,x,y){

	p.a = p.hasOwnProperty('a') ? p.a : 255

	let w = imageData.width
	let h = imageData.height
	let off = (y*w+x)*4
	let d = imageData.data

	d[off] = p.r
	d[off+1] = p.g
	d[off+2] = p.b
	d[off+3] = p.a
}

