/**
 * RadialGrowthPattern.js - Organic radiating growth pattern
 *
 * This pattern simulates the growth of colonies, like mushrooms or lichen,
 * in a radial fashion. It's converted from a p5.js example.
 */

class RadiatorColony {
    constructor(x, y, options, colors) {
        this.x = x;
        this.y = y;
        this.options = options;
        this.colors = colors;

        // Highly variable density
        const densityType = Math.random();
        const densityMultiplier = this.options.densityVariation;
        if (densityType < 0.3) {
            this.lines = Math.floor((Math.random() * 40 + 15) * densityMultiplier);
        } else if (densityType < 0.7) {
            this.lines = Math.floor((Math.random() * 150 + 100) * densityMultiplier);
        } else {
            this.lines = Math.floor((Math.random() * 300 + 200) * densityMultiplier);
        }

        this.baseGrowth = (Math.random() * 0.8 + 0.2) * 0.125;

        // Variable size
        const sizeType = Math.random();
        const sizeMultiplier = this.options.sizeVariation;
        if (sizeType < 0.2) {
            this.maxLength = (Math.random() * 25 + 10) * sizeMultiplier;
        } else if (sizeType < 0.6) {
            this.maxLength = (Math.random() * 80 + 40) * sizeMultiplier;
        } else {
            this.maxLength = (Math.random() * 150 + 80) * sizeMultiplier;
        }

        this.age = 0;
        this.baseLifespan = (Math.random() * 400 + 200) * 4;
        this.opacity = 0;

        this.irregularityAmount = Math.random() * 0.3 + 0.1;
        this.angleOffset = Math.random() * Math.PI * 2;
    }

    update() {
        this.age++;
        const currentLifespan = this.baseLifespan * this.options.lifespan;

        if (this.age < currentLifespan * 0.2) {
            this.opacity = Math.min(1, this.age / (currentLifespan * 0.2));
        } else if (this.age > currentLifespan * 0.8) {
            this.opacity = Math.max(0, 1 - (this.age - currentLifespan * 0.8) / (currentLifespan * 0.2));
        } else {
            this.opacity = 1;
        }
    }

    draw(ctx) {
        const currentGrowth = this.baseGrowth * this.options.growthSpeed;
        const currentLength = Math.min(this.maxLength, this.age * currentGrowth);
        const centerRadius = 1 + this.age * 0.0025;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw radial lines
        const [pr, pg, pb] = this.colors.primary;
        const finalOpacity = this.opacity * this.options.opacity;

        for (let i = 0; i < this.lines; i++) {
            const baseAngle = (i / this.lines) * Math.PI * 2 + this.angleOffset;
            const irregularityEffect = this.options.irregularity * this.irregularityAmount;
            const angle = baseAngle + (Math.sin(baseAngle * 3) * irregularityEffect);
            const lengthVariation = 0.8 + Math.sin(baseAngle * 7) * 0.2;
            const length = currentLength * lengthVariation;
            
            ctx.lineWidth = 0.2 + (this.lines / 500) + Math.random() * 0.1;
            ctx.strokeStyle = `rgba(${pr}, ${pg}, ${pb}, ${finalOpacity * 0.5})`;
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
            ctx.stroke();
        }

        // Draw center point
        const [ar, ag, ab] = this.colors.accent;
        ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${finalOpacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    isDead() {
        return this.age > this.baseLifespan * this.options.lifespan;
    }
}

export class RadialGrowthPattern {
    constructor() {
        this.name = 'Radial Growth';
        this.type = 'radialgrowth';
        this.colonies = [];
        this.initialized = false;
        this.animationTime = 0;
    }

    spawnColony(width, height, options) {
        if (this.colonies.length < options.maxColonies) {
            let x, y;
            if (this.colonies.length > 0 && Math.random() < options.clusterTendency) {
                const parent = this.colonies[Math.floor(Math.random() * this.colonies.length)];
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() < 0.4 ? (Math.random() * 30 + 15) : (Math.random() * 80 + 30);
                x = parent.x + Math.cos(angle) * distance;
                y = parent.y + Math.sin(angle) * distance;
            } else {
                const centerBias = Math.random() * 0.6 + 0.4 * options.centerBias;
                x = width / 2 + (Math.random() - 0.5) * width * centerBias;
                y = height / 2 + (Math.random() - 0.5) * height * centerBias;
            }
            x = Math.max(50, Math.min(width - 50, x));
            y = Math.max(50, Math.min(height - 50, y));
            this.colonies.push(new RadiatorColony(x, y, options, this.colors));
        }
    }

    render(ctx, time, width, height, colors, options = {}) {
        if (!this.initialized) {
            this.colors = colors;
            this.initialized = true;
        }
        this.options = options;
        this.colors = colors; // Update colors every frame

        // Clear canvas
        ctx.fillStyle = `rgb(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]})`;
        ctx.fillRect(0, 0, width, height);

        this.animationTime++;

        if (this.animationTime % Math.floor(options.spawnRate) === 0) {
            this.spawnColony(width, height, options);
        }

        this.colonies = this.colonies.filter(colony => !colony.isDead());

        this.colonies.forEach(colony => {
            colony.update();
            colony.draw(ctx);
        });
    }

    calculateComplexity(params = {}) {
        const {
            maxColonies = 60,
            densityVariation = 1.0,
            growthSpeed = 1.0,
        } = params;

        let complexity = 15;

        // Max colonies is a major factor
        complexity += 50 * Math.min(maxColonies / 150, 1);

        // Density variation adds to perceived complexity
        complexity += 20 * Math.min(densityVariation / 3.0, 1);

        // Growth speed affects how quickly the screen fills
        complexity += 10 * Math.min(growthSpeed / 3.0, 1);

        return Math.min(Math.max(Math.round(complexity), 1), 100);
    }
}

export default RadialGrowthPattern;