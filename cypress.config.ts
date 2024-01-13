import { defineConfig } from "cypress";
import webpack from "@cypress/webpack-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";

// Setup Node Events for Cypress
async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  // Enable Cucumber Preprocessor Plugin
  await addCucumberPreprocessorPlugin(on, config);

  // Setup Webpack Preprocessor
  on("file:preprocessor", webpack(createWebpackOptions(config)));

  return config; // Return modified configuration
}

// Create Webpack Options based on Cypress configuration
function createWebpackOptions(config: Cypress.PluginConfigOptions) {
  return {
    webpackOptions: {
      resolve: {
        extensions: [".ts", ".js"], // Resolve TypeScript and JavaScript files
      },
      module: {
        rules: [
          // TypeScript files handling
          {
            test: /\.ts$/,
            exclude: [/node_modules/],
            use: [{ loader: "ts-loader" }],
          },
          // Feature files handling for Cucumber
          {
            test: /\.feature$/,
            use: [{ loader: "@badeball/cypress-cucumber-preprocessor/webpack", options: config }],
          },
        ],
      },
    },
  };
}

// Cypress Configuration
export default defineConfig({
  e2e: {
    baseUrl: "https://duckduckgo.com", // Base URL for E2E tests
    specPattern: "**/*.feature", // Pattern to match test spec files
    setupNodeEvents, // Setup Node Events
  },
});
