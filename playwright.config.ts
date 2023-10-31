import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
    testDir: '.',
    timeout: 60 * 1000,
    retries: 1,
    use: {
        navigationTimeout: 10000,
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
        headless: process.env.CI === 'true' ? true : false,
        // Viewport used for all pages in the context.
        viewport: { width: 1280, height: 762 },
    
        // Record trace only when retrying a test for the first time.
        trace: 'on-first-retry',
    },
}

export default config
