import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'tests/browser',testMatch:'media-equipment.spec.mjs',workers:1,timeout:60000,
  outputDir:'tmp/media-equipment-results',
  use:{baseURL:process.env.MEDIA_LIVE?'https://smashpro.app':'http://127.0.0.1:4187',headless:true,reducedMotion:'reduce'},
  webServer:process.env.MEDIA_LIVE?undefined:{command:`${process.platform==='win32'?'npm.cmd':'npm'} run preview -- --host 127.0.0.1 --port 4187 --strictPort`,url:'http://127.0.0.1:4187/equipment/',reuseExistingServer:false,timeout:60000},
});
