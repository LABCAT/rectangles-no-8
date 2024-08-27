export default class AnimatedRectangle {
    /**
     * Inspiration:
     * https://openprocessing.org/sketch/469866
     */
    constructor(p, x, y, size, hue) {
        this.dead = false;
        this.cellSize = 10;
        this.p = p;
        this.x = x;
        this.y = y;
        this.size = size;
        this.colour = this.p.color(hue, 90, 90);
        
        this.segCount = this.p.random(2, 10);
        this.segs = [];

        this.dir = window.p5.Vector.fromAngle(
            this.p.floor(this.p.random(4)) * (this.p.TWO_PI / 4)
        ).mult(this.cellSize);

        this.pos = this.p.createVector(
            Math.ceil(this.p.random(this.size) / this.cellSize) * this.cellSize, 
            Math.ceil(this.p.random(this.size) / this.cellSize) * this.cellSize
        );

        this.newPos = this.p.createVector(0, 0);

        this.segs.push(this.pos);

        this.updateCount = 0;
    }

    update () {
        if (Math.random() < 0.3) {
			this.dir.rotate(Math.random() < 0.5 ? -(this.p.PI / 2) : (this.p.PI / 2));
		}

		//move
		this.newPos = window.p5.Vector.add(this.pos, this.dir);

		this.segs.unshift(this.newPos);
		this.pos = this.newPos;

		if (this.segs.length > this.p.segCount) {
            this.segs.pop();
        }
        this.updateCount++;
    }

    draw () {
        this.p.stroke(this.colour);
		this.dead = true;

		for (var i = 0; i < this.segs.length - 1; i++) {
			var s = this.segs[i];
			var e = this.segs[i + 1];

			if (s.x >= 0 && s.x <= this.size && s.y >= 0 && s.y <= this.size) {
				if (e.x >= 0 && e.x <= this.size && e.y >= 0 && e.y <= this.size) {

					this.p.line(s.x + this.x, s.y + this.y, e.x + this.x, e.y + this.y);
					this.p.line(s.y + this.x, s.x + this.y, e.y + this.x, e.x + this.y);

					this.p.line(this.size - s.x + this.x, s.y + this.y, this.size - e.x + this.x, e.y + this.y);
					this.p.line(this.size - s.y + this.x, s.x + this.y, this.size - e.y + this.x, e.x + this.y);

					this.p.line(s.x + this.x, this.size - s.y + this.y, e.x + this.x, this.size - e.y + this.y);
					this.p.line(s.y + this.x, this.size - s.x + this.y, e.y + this.x, this.size - e.x + this.y);

					this.p.line(this.size - s.x + this.x, this.size - s.y + this.y, this.size - e.x + this.x, this.size - e.y + this.y);
					this.p.line(this.size - s.y + this.x, this.size - s.x + this.y, this.size - e.y + this.x, this.size - e.x + this.y);

					
				}
			}
		}

        if(Math.random() < 0.9) {
            this.dead = false;
        }

        this.p.noFill();
    }
}