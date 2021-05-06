// ARCHETYPE - sprite generation for the collaborative piece with IX SHELLS
//
class Archetype {
    constructor(width=16,height=16){
        // Hold the frames - with sprites
        this.frames = null // array of sprites 
        this.forward = true // direction
        this.frameIndex = 0

       
        // DEFINE the hex values to cycle through in the animation
        let buffer = ['10081188000005a0024002401db81c380180018015a881818001d5ab14281c38']
        for(let i=0;i<10;i++){
            if(buffer.length === 0){
                buffer.push(generateHex())
            }
            let prev = buffer.pop()
            let hex = generateHex()
            
            let merged = (hexToBigInt(prev) | hexToBigInt(hex)).toString(16)
            
            buffer.push(prev)
            buffer.push(merged)
            buffer.push(hex)
        }

        this.frames = buffer.map( o=>new Sprite(o,width,height,8) )

        // GENERATE THE HEX for each SPRITE
        function generateHex(){

            let hex = '0'

            for(let i=0;i<12;i++){
                let x = parseInt(Math.random()*width)
                let y = parseInt(Math.random()*height)
                // random walk of 0-4
                let max = parseInt(Math.random()*3)+1
                for(let j=0;j<max;j++){
                    
                    hex = poke(hex,x,y,width,height)
                    x = 15-x
                    
                    hex = poke(hex,x,y,width,height)

                    let choice = parseInt(Math.random()*4)

                    switch(choice){
                        case 0:
                            x = x<width-1 ? x+1 : x
                            break
                        case 1:
                            x = x>0 ? x-1 : x
                            break
                        case 2:
                            y = y<height-1 ? y+1 : y
                            break
                        default:
                            y = y>0 ? y-1 : y
                            break
                    }
                }
            }

            return hex
        }
    }

    // return the current frame, don't advance
    getFrame(){
        return this.frames[this.frameIndex]
    }

    // return the current sprite and advance the frame
    getNextFrame(){
        let sprite = this.frames[this.frameIndex]
        if(this.forward){
            this.frameIndex++
            if(this.frameIndex === this.frames.length){
                this.frameIndex -= 2
                this.forward = false
                console.log('reverse')
            }
        }else{
            this.frameIndex--
            if(this.frameIndex < 0){
                this.frameIndex = 1
                this.forward = true
                console.log('forward')
            }
        }
        return sprite
    }
} 

