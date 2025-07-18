/**
 * highlight-package.js - Highlight.xyz Deployment Package Script
 * 
 * Creates deployment package for highlight.xyz platform
 */

import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { execSync } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';

// Import webpack configuration
import webpackConfig, { highlightConfig } from './webpack.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HighlightPackager {
    constructor() {
        this.config = highlightConfig;
        this.outputPath = this.config.outputPath;
        this.packageName = 'onchain-summer-vibes-package.zip';
        this.packagePath = path.join(this.outputPath, this.packageName);
        this.verbose = process.argv.includes('--verbose');
        this.skipBuild = process.argv.includes('--skip-build');
        
        this.log('Highlight.xyz Deployment Packager initialized');
        this.log(`Output path: ${this.outputPath}`);
        this.log(`Package name: ${this.packageName}`);
    }

    /**
     * Log message with timestamp
     * @param {string} message - Message to log
     * @param {string} level - Log level (info, warn, error)
     */
    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✅';
        console.log(`[${timestamp}] ${prefix} ${message}`);
    }

    /**
     * Execute shell command with error handling
     * @param {string} command - Command to execute
     * @param {string} description - Description for logging
     */
    execCommand(command, description) {
        try {
            this.log(`Executing: ${description}`);
            const result = execSync(command, { 
                cwd: path.join(__dirname, '..'), 
                stdio: this.verbose ? 'inherit' : 'pipe',
                encoding: 'utf8'
            });
            this.log(`✓ ${description} completed successfully`);
            return result;
        } catch (error) {
            this.log(`✗ ${description} failed: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Build the project using webpack
     */
    async buildProject() {
        if (this.skipBuild) {
            this.log('Skipping build (--skip-build flag specified)');
            return;
        }

        this.log('Building project for production...');
        
        try {
            // Clean previous build
            if (fs.existsSync(this.outputPath)) {
                this.log('Cleaning previous build...');
                fs.rmSync(this.outputPath, { recursive: true, force: true });
            }

            // Run webpack build
            this.execCommand('npm run build', 'Webpack production build');
            
            this.log('✓ Project build completed successfully');
        } catch (error) {
            this.log(`Build failed: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Validate required files exist
     * @returns {boolean} - True if all required files exist
     */
    validateRequiredFiles() {
        this.log('Validating required files...');
        
        const missingFiles = [];
        
        for (const file of this.config.requiredFiles) {
            const filePath = path.join(this.outputPath, file);
            if (!fs.existsSync(filePath)) {
                missingFiles.push(file);
            } else {
                this.log(`✓ Required file found: ${file}`);
            }
        }
        
        if (missingFiles.length > 0) {
            this.log(`Missing required files: ${missingFiles.join(', ')}`, 'error');
            return false;
        }
        
        this.log('✓ All required files validated successfully');
        return true;
    }

    /**
     * Check file sizes and bundle size
     * @returns {boolean} - True if sizes are within limits
     */
    validateFileSizes() {
        this.log('Validating file sizes...');
        
        let totalSize = 0;
        const fileSizes = [];
        
        // Get all files in dist directory
        const files = this.getAllFiles(this.outputPath);
        
        for (const file of files) {
            const relativePath = path.relative(this.outputPath, file);
            const stats = fs.statSync(file);
            const sizeKB = Math.round(stats.size / 1024);
            
            fileSizes.push({ file: relativePath, size: sizeKB });
            totalSize += stats.size;
            
            if (this.verbose) {
                this.log(`File: ${relativePath} (${sizeKB} KB)`);
            }
        }
        
        const totalSizeKB = Math.round(totalSize / 1024);
        const maxSizeKB = Math.round(this.config.maxBundleSize / 1024);
        
        this.log(`Total bundle size: ${totalSizeKB} KB (max: ${maxSizeKB} KB)`);
        
        if (totalSize > this.config.maxBundleSize) {
            this.log(`Bundle size exceeds limit: ${totalSizeKB} KB > ${maxSizeKB} KB`, 'error');
            return false;
        }
        
        this.log('✓ File sizes validated successfully');
        return true;
    }

    /**
     * Get all files recursively from directory
     * @param {string} dir - Directory path
     * @returns {Array} - Array of file paths
     */
    getAllFiles(dir) {
        const files = [];
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);
            
            if (stats.isDirectory()) {
                files.push(...this.getAllFiles(fullPath));
            } else {
                files.push(fullPath);
            }
        }
        
        return files;
    }

    /**
     * Create zip package for highlight.xyz
     * @returns {Promise<boolean>} - True if packaging successful
     */
    async createPackage() {
        this.log('Creating highlight.xyz deployment package...');
        
        return new Promise((resolve, reject) => {
            // Remove existing package
            if (fs.existsSync(this.packagePath)) {
                fs.unlinkSync(this.packagePath);
            }
            
            const output = fs.createWriteStream(this.packagePath);
            const archive = archiver('zip', {
                zlib: { level: 9 } // Maximum compression
            });
            
            output.on('close', () => {
                const sizeKB = Math.round(archive.pointer() / 1024);
                this.log(`✓ Package created: ${this.packageName} (${sizeKB} KB)`);
                resolve(true);
            });
            
            archive.on('error', (err) => {
                this.log(`Package creation failed: ${err.message}`, 'error');
                reject(err);
            });
            
            archive.pipe(output);
            
            // Add all files from dist directory
            const files = this.getAllFiles(this.outputPath);
            
            for (const file of files) {
                if (file !== this.packagePath) { // Don't include the zip itself
                    const relativePath = path.relative(this.outputPath, file);
                    archive.file(file, { name: relativePath });
                    
                    if (this.verbose) {
                        this.log(`Added to package: ${relativePath}`);
                    }
                }
            }
            
            archive.finalize();
        });
    }

    /**
     * Validate package contents
     * @returns {boolean} - True if package is valid
     */
    async validatePackage() {
        this.log('Validating package contents...');
        
        if (!fs.existsSync(this.packagePath)) {
            this.log('Package file not found', 'error');
            return false;
        }
        
        const stats = fs.statSync(this.packagePath);
        const sizeKB = Math.round(stats.size / 1024);
        const maxSizeKB = Math.round(this.config.maxBundleSize / 1024);
        
        this.log(`Package size: ${sizeKB} KB (max: ${maxSizeKB} KB)`);
        
        if (stats.size > this.config.maxBundleSize) {
            this.log(`Package size exceeds limit: ${sizeKB} KB > ${maxSizeKB} KB`, 'error');
            return false;
        }
        
        // TODO: Add zip content validation if needed
        this.log('✓ Package validation completed successfully');
        return true;
    }

    /**
     * Generate deployment metadata
     */
    generateMetadata() {
        this.log('Generating deployment metadata...');
        
        const metadata = {
            name: 'Onchain Summer Vibes',
            version: '1.0.0',
            description: 'Generative wave patterns with q5.js and WebGPU',
            author: 'Generated with Claude Code',
            created: new Date().toISOString(),
            platform: 'highlight.xyz',
            files: {
                entry: 'index.html',
                required: this.config.requiredFiles,
                optional: this.config.optionalFiles
            },
            config: {
                maxBundleSize: this.config.maxBundleSize,
                targetBrowsers: this.config.targetBrowsers
            },
            features: [
                'q5.js WebGPU rendering',
                'SVG masking',
                'Theme system',
                'Deterministic randomness',
                'Responsive design'
            ]
        };
        
        const metadataPath = path.join(this.outputPath, 'deployment-metadata.json');
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        
        this.log(`✓ Deployment metadata created: ${metadataPath}`);
        return metadata;
    }

    /**
     * Run complete packaging process
     */
    async package() {
        try {
            this.log('Starting highlight.xyz deployment packaging...');
            
            // Step 1: Build project
            await this.buildProject();
            
            // Step 2: Validate required files
            if (!this.validateRequiredFiles()) {
                throw new Error('Required files validation failed');
            }
            
            // Step 3: Validate file sizes
            if (!this.validateFileSizes()) {
                throw new Error('File size validation failed');
            }
            
            // Step 4: Generate metadata
            this.generateMetadata();
            
            // Step 5: Create package
            await this.createPackage();
            
            // Step 6: Validate package
            if (!await this.validatePackage()) {
                throw new Error('Package validation failed');
            }
            
            this.log('✅ Highlight.xyz deployment package created successfully!');
            this.log(`📦 Package location: ${this.packagePath}`);
            this.log(`🚀 Ready for deployment to highlight.xyz`);
            
            return true;
            
        } catch (error) {
            this.log(`❌ Packaging failed: ${error.message}`, 'error');
            
            // Cleanup on failure
            if (fs.existsSync(this.packagePath)) {
                fs.unlinkSync(this.packagePath);
                this.log('Cleaned up incomplete package');
            }
            
            throw error;
        }
    }

    /**
     * Get package information
     * @returns {Object} - Package information
     */
    getPackageInfo() {
        if (!fs.existsSync(this.packagePath)) {
            return null;
        }
        
        const stats = fs.statSync(this.packagePath);
        
        return {
            name: this.packageName,
            path: this.packagePath,
            size: stats.size,
            sizeKB: Math.round(stats.size / 1024),
            created: stats.birthtime,
            modified: stats.mtime
        };
    }
}

// CLI execution
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    const packager = new HighlightPackager();
    
    packager.package()
        .then(() => {
            console.log('\n✅ Packaging completed successfully!');
            
            const info = packager.getPackageInfo();
            if (info) {
                console.log(`📦 Package: ${info.name}`);
                console.log(`📏 Size: ${info.sizeKB} KB`);
                console.log(`📁 Location: ${info.path}`);
            }
            
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Packaging failed:', error.message);
            process.exit(1);
        });
}

export default HighlightPackager;