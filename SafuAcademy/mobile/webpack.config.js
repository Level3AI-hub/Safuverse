const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
const webpack = require('webpack');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);

    // Provide React globally for packages that use JSX without importing React
    config.plugins = [
        ...(config.plugins || []),
        new webpack.ProvidePlugin({
            React: 'react',
        }),
    ];

    // Enable import.meta for ESM packages
    config.module.rules.push({
        test: /\.m?js$/,
        resolve: {
            fullySpecified: false,
        },
    });

    // Find the babel-loader rule and extend it to include @walletconnect packages
    config.module.rules = config.module.rules.map(rule => {
        // Handle babel-loader rules
        if (rule.oneOf) {
            rule.oneOf = rule.oneOf.map(oneOfRule => {
                if (
                    oneOfRule.use &&
                    oneOfRule.use.loader &&
                    oneOfRule.use.loader.includes('babel-loader')
                ) {
                    // Extend to include @walletconnect/react-native-compat
                    const originalExclude = oneOfRule.exclude;
                    oneOfRule.exclude = (modulePath) => {
                        // Don't exclude @walletconnect packages
                        if (modulePath.includes('@walletconnect')) {
                            return false;
                        }
                        if (typeof originalExclude === 'function') {
                            return originalExclude(modulePath);
                        }
                        if (originalExclude instanceof RegExp) {
                            return originalExclude.test(modulePath);
                        }
                        return false;
                    };
                }
                return oneOfRule;
            });
        }

        // Disable source-map-loader for problematic packages
        if (rule.loader && rule.loader.includes('source-map-loader')) {
            return {
                ...rule,
                exclude: /node_modules\/@walletconnect/,
            };
        }
        return rule;
    });

    // Add explicit TypeScript handling for @walletconnect packages
    config.module.rules.unshift({
        test: /\.tsx?$/,
        include: [
            path.resolve(__dirname, 'node_modules/@walletconnect'),
        ],
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['babel-preset-expo'],
            },
        },
    });

    return config;
};
