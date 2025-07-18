/**
 * SVGPathParser.js - SVG Path Data Parser for q5.js
 * 
 * Parses SVG path data and converts to q5.js drawing commands
 */

export class SVGPathParser {
    constructor() {
        this.commands = [];
        this.currentX = 0;
        this.currentY = 0;
        this.startX = 0;
        this.startY = 0;
    }

    /**
     * Parse SVG path data string into drawing commands
     * @param {string} pathData - SVG path data string
     * @returns {Array} - Array of drawing commands
     */
    parse(pathData) {
        if (!pathData || typeof pathData !== 'string') {
            console.error('Invalid path data provided');
            return [];
        }

        try {
            this.commands = [];
            this.currentX = 0;
            this.currentY = 0;
            this.startX = 0;
            this.startY = 0;

            // Clean and tokenize the path data
            const tokens = this.tokenize(pathData);
            
            // Process each command
            let i = 0;
            while (i < tokens.length) {
                const command = tokens[i];
                i = this.processCommand(command, tokens, i);
            }

            return this.commands;
        } catch (error) {
            console.error('Error parsing SVG path:', error);
            return [];
        }
    }

    /**
     * Tokenize SVG path data
     * @param {string} pathData - SVG path data string
     * @returns {Array} - Array of tokens
     */
    tokenize(pathData) {
        // Remove extra whitespace and split by commands
        const cleaned = pathData.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
        
        // Split by command letters, keeping the letters
        const tokens = [];
        let current = '';
        
        for (let i = 0; i < cleaned.length; i++) {
            const char = cleaned[i];
            
            if (this.isCommand(char)) {
                if (current.trim()) {
                    tokens.push(...current.trim().split(' '));
                }
                tokens.push(char);
                current = '';
            } else {
                current += char;
            }
        }
        
        if (current.trim()) {
            tokens.push(...current.trim().split(' '));
        }

        return tokens.filter(token => token !== '');
    }

    /**
     * Check if character is a path command
     * @param {string} char - Character to check
     * @returns {boolean} - True if it's a command
     */
    isCommand(char) {
        return /[MmLlHhVvCcSsQqTtAaZz]/.test(char);
    }

    /**
     * Process a single path command
     * @param {string} command - Command letter
     * @param {Array} tokens - All tokens
     * @param {number} index - Current index
     * @returns {number} - Next index
     */
    processCommand(command, tokens, index) {
        switch (command.toLowerCase()) {
            case 'm':
                return this.processMove(command, tokens, index);
            case 'l':
                return this.processLine(command, tokens, index);
            case 'h':
                return this.processHorizontalLine(command, tokens, index);
            case 'v':
                return this.processVerticalLine(command, tokens, index);
            case 'c':
                return this.processCubicBezier(command, tokens, index);
            case 's':
                return this.processSmoothCubicBezier(command, tokens, index);
            case 'q':
                return this.processQuadraticBezier(command, tokens, index);
            case 't':
                return this.processSmoothQuadraticBezier(command, tokens, index);
            case 'a':
                return this.processArc(command, tokens, index);
            case 'z':
                return this.processClose(command, tokens, index);
            default:
                console.warn('Unknown SVG command:', command);
                return index + 1;
        }
    }

    /**
     * Process Move command
     */
    processMove(command, tokens, index) {
        const isAbsolute = command === 'M';
        let i = index + 1;
        
        while (i < tokens.length && !this.isCommand(tokens[i])) {
            const x = parseFloat(tokens[i]);
            const y = parseFloat(tokens[i + 1]);
            
            if (isAbsolute) {
                this.currentX = x;
                this.currentY = y;
            } else {
                this.currentX += x;
                this.currentY += y;
            }
            
            this.commands.push({
                type: 'move',
                x: this.currentX,
                y: this.currentY
            });
            
            this.startX = this.currentX;
            this.startY = this.currentY;
            
            i += 2;
        }
        
        return i;
    }

    /**
     * Process Line command
     */
    processLine(command, tokens, index) {
        const isAbsolute = command === 'L';
        let i = index + 1;
        
        while (i < tokens.length && !this.isCommand(tokens[i])) {
            const x = parseFloat(tokens[i]);
            const y = parseFloat(tokens[i + 1]);
            
            if (isAbsolute) {
                this.currentX = x;
                this.currentY = y;
            } else {
                this.currentX += x;
                this.currentY += y;
            }
            
            this.commands.push({
                type: 'line',
                x: this.currentX,
                y: this.currentY
            });
            
            i += 2;
        }
        
        return i;
    }

    /**
     * Process Horizontal Line command
     */
    processHorizontalLine(command, tokens, index) {
        const isAbsolute = command === 'H';
        let i = index + 1;
        
        while (i < tokens.length && !this.isCommand(tokens[i])) {
            const x = parseFloat(tokens[i]);
            
            if (isAbsolute) {
                this.currentX = x;
            } else {
                this.currentX += x;
            }
            
            this.commands.push({
                type: 'line',
                x: this.currentX,
                y: this.currentY
            });
            
            i += 1;
        }
        
        return i;
    }

    /**
     * Process Vertical Line command
     */
    processVerticalLine(command, tokens, index) {
        const isAbsolute = command === 'V';
        let i = index + 1;
        
        while (i < tokens.length && !this.isCommand(tokens[i])) {
            const y = parseFloat(tokens[i]);
            
            if (isAbsolute) {
                this.currentY = y;
            } else {
                this.currentY += y;
            }
            
            this.commands.push({
                type: 'line',
                x: this.currentX,
                y: this.currentY
            });
            
            i += 1;
        }
        
        return i;
    }

    /**
     * Process Cubic Bezier command
     */
    processCubicBezier(command, tokens, index) {
        const isAbsolute = command === 'C';
        let i = index + 1;
        
        while (i < tokens.length && !this.isCommand(tokens[i])) {
            const x1 = parseFloat(tokens[i]);
            const y1 = parseFloat(tokens[i + 1]);
            const x2 = parseFloat(tokens[i + 2]);
            const y2 = parseFloat(tokens[i + 3]);
            const x = parseFloat(tokens[i + 4]);
            const y = parseFloat(tokens[i + 5]);
            
            let cp1x = x1, cp1y = y1, cp2x = x2, cp2y = y2;
            
            if (isAbsolute) {
                this.currentX = x;
                this.currentY = y;
            } else {
                cp1x += this.currentX;
                cp1y += this.currentY;
                cp2x += this.currentX;
                cp2y += this.currentY;
                this.currentX += x;
                this.currentY += y;
            }
            
            this.commands.push({
                type: 'cubic',
                cp1x, cp1y, cp2x, cp2y,
                x: this.currentX,
                y: this.currentY
            });
            
            i += 6;
        }
        
        return i;
    }

    /**
     * Process other commands (simplified implementations)
     */
    processSmoothCubicBezier(command, tokens, index) {
        // Simplified implementation
        return this.processLine(command === 'S' ? 'L' : 'l', tokens, index);
    }

    processQuadraticBezier(command, tokens, index) {
        // Simplified implementation
        return this.processLine(command === 'Q' ? 'L' : 'l', tokens, index);
    }

    processSmoothQuadraticBezier(command, tokens, index) {
        // Simplified implementation
        return this.processLine(command === 'T' ? 'L' : 'l', tokens, index);
    }

    processArc(command, tokens, index) {
        // Simplified implementation
        return this.processLine(command === 'A' ? 'L' : 'l', tokens, index);
    }

    processClose(command, tokens, index) {
        this.commands.push({
            type: 'close',
            x: this.startX,
            y: this.startY
        });
        
        this.currentX = this.startX;
        this.currentY = this.startY;
        
        return index + 1;
    }

    /**
     * Execute parsed commands using q5.js
     * @param {Array} commands - Array of drawing commands
     * @param {Object} transform - Transform parameters
     */
    executeCommands(commands, transform = {}) {
        if (!commands || commands.length === 0) return;

        const { scaleX = 1, scaleY = 1, offsetX = 0, offsetY = 0 } = transform;

        beginShape();
        
        for (const command of commands) {
            const x = command.x * scaleX + offsetX;
            const y = command.y * scaleY + offsetY;
            
            switch (command.type) {
                case 'move':
                    // q5.js doesn't have explicit move, just start new contour
                    break;
                case 'line':
                    vertex(x, y);
                    break;
                case 'cubic':
                    const cp1x = command.cp1x * scaleX + offsetX;
                    const cp1y = command.cp1y * scaleY + offsetY;
                    const cp2x = command.cp2x * scaleX + offsetX;
                    const cp2y = command.cp2y * scaleY + offsetY;
                    bezierVertex(cp1x, cp1y, cp2x, cp2y, x, y);
                    break;
                case 'close':
                    endShape(CLOSE);
                    beginShape();
                    break;
            }
        }
        
        endShape();
    }
}

// Export default instance
export default new SVGPathParser();