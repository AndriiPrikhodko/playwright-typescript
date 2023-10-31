## Project Weathershopper
### Overview
This project is a sample application that demonstrates how to use Playwright, TypeScript, and Docker to run end-to-end tests for a e-commerce web application.

### Getting Started
To get started with this project, you will need to have Node.js and Docker installed on your machine. Once you have Node.js and Docker installed, you can choose one of the following:

### Running Tests Locally
1. Clone the repository to your local machine.
2. Open a terminal window and navigate to the root directory of the project.
3. Run npm ci to install all dependencies needed to run your tests.
4. Run npx playwright install to install the necessary dependencies for Playwright.
5. Run npx playwright test to run your tests locally.

### Running Tests in Docker
1. Clone the repository to your local machine.
2. Open a terminal window and navigate to the root directory of the project.
3. Run npm ci to install all dependencies needed to run your tests.
4. Run docker pull mcr.microsoft.com/playwright:v1.39.0-jammy to pull the  Playwright Docker image.
5. Run docker build -t weathershopper-playwright . to build the Docker image for your project.
6. Run docker run weathershopper-playwright to start a container from the weathershopper-playwright image and run the tests inside the container.

### Contributing
If you would like to contribute to this project, please fork the repository and submit a pull request. We welcome contributions of all kinds, including bug fixes, new features, and documentation improvements.

### License
This project is licensed under the ISC License. See the LICENSE file for details.