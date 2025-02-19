module.exports = {
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "^axios$": require.resolve("axios"),
  },
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["/node_modules/(?!axios)"], // Asegura que Jest transforme Axios
};