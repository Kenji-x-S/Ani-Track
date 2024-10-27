// import type { Config } from "jest";
// import nextJest from "next/jest.js";

// // Create a custom Jest configuration using nextJest
// const createJestConfig = nextJest({
//   // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
//   dir: "./",
// });

// // Add any custom config to be passed to Jest
// const config: Config = {
//   coverageProvider: "v8",
//   testEnvironment: "jsdom",
//   // Resolve the '@' alias to the root directory
//   moduleNameMapper: {
//     "^@/(.*)$": "<rootDir>/$1",
//   },
//   // Add more setup options before each test is run
//   // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
// };

// // createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// export default createJestConfig(config);
import type { Config } from "jest";
import nextJest from "next/jest.js";

// Create a custom Jest configuration using nextJest
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "node", // Change this to 'node' for API testing
  // Resolve the '@' alias to the root directory
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
