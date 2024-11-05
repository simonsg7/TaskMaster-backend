export default {
    testEnvironment: "node",
    transform: {},
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    },
    testMatch: [
        "**/tests/**/*.js",
        "**/?(*.)+(spec|test).js"
    ],
    verbose: true
};