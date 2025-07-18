/**
 * webpack.config.js - Webpack Configuration for q5.js Application
 * 
 * Configure webpack for q5.js bundling, optimization, and highlight.xyz deployment
 */

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
    const isProduction = argv.mode === 'production';
    const isDevelopment = !isProduction;

    console.log(`Building for ${isProduction ? 'production' : 'development'}`);

    return {
        // Entry point
        entry: {
            main: './main-new.js'
        },

        // Output configuration
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: isProduction ? '[name].[contenthash].js' : '[name].js',
            chunkFilename: isProduction ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
            clean: true,
            publicPath: './'
        },

        // Module resolution
        resolve: {
            extensions: ['.js', '.ts', '.json'],
            alias: {
                '@': path.resolve(__dirname, '../src'),
                '@config': path.resolve(__dirname, '../config'),
                '@lib': path.resolve(__dirname, '../lib')
            }
        },

        // Module rules
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    modules: false // Don't transform ES modules
                                }]
                            ]
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/images/[name].[hash][ext]'
                    }
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/fonts/[name].[hash][ext]'
                    }
                }
            ]
        },

        // Plugins
        plugins: [
            // Clean dist directory
            new CleanWebpackPlugin(),

            // Copy static assets
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'lib/q5.js',
                        to: 'lib/q5.js'
                    },
                    {
                        from: 'lib/hl-gen.js',
                        to: 'lib/hl-gen.js'
                    },
                    {
                        from: 'src/styles.css',
                        to: 'styles.css',
                        noErrorOnMissing: true
                    }
                ]
            }),

            // Generate HTML file
            new HtmlWebpackPlugin({
                template: './index.html',
                filename: 'index.html',
                inject: 'body',
                minify: isProduction ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                } : false,
                templateParameters: {
                    title: 'Onchain Summer Vibes - Generative Art',
                    mode: isProduction ? 'production' : 'development'
                }
            })
        ],

        // Optimization
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: isProduction ? true : false,
                            drop_debugger: true
                        },
                        mangle: {
                            safari10: true
                        },
                        format: {
                            comments: false
                        }
                    },
                    extractComments: false
                })
            ],
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        enforce: true
                    }
                }
            },
            runtimeChunk: isDevelopment ? 'single' : false
        },

        // Development server
        devServer: {
            static: [
                {
                    directory: path.resolve(__dirname, '../'),
                    publicPath: '/'
                }
            ],
            port: 8081,
            open: true,
            hot: true,
            compress: true,
            historyApiFallback: true,
            client: {
                overlay: {
                    errors: true,
                    warnings: false
                }
            },
            devMiddleware: {
                writeToDisk: false
            }
        },

        // Source maps
        devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',

        // Performance hints
        performance: {
            hints: isProduction ? 'warning' : false,
            maxAssetSize: 512000, // 500kb
            maxEntrypointSize: 512000 // 500kb
        },

        // Target
        target: ['web', 'es5'],

        // Mode
        mode: isProduction ? 'production' : 'development',

        // Stats
        stats: {
            preset: 'minimal',
            moduleTrace: true,
            errorDetails: true,
            warnings: true,
            timings: true,
            assets: true,
            chunks: false,
            modules: false,
            entrypoints: false
        }
    };
};

// Export additional configuration for highlight.xyz deployment
export const highlightConfig = {
    outputPath: path.resolve(__dirname, '../dist'),
    requiredFiles: [
        'index.html',
        'lib/q5.js',
        'lib/hl-gen.js'
    ],
    optionalFiles: [
        'styles.css',
        'assets/'
    ],
    maxBundleSize: 2 * 1024 * 1024, // 2MB
    targetBrowsers: [
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Safari versions',
        'last 2 Edge versions'
    ]
};