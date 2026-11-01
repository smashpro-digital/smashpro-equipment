import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'tests/browser',testMatch:['ardhi-postdelivery.spec.mjs','ardhi-v4.spec.mjs','ardhi-delivery.spec.mjs'],
  workers:1,timeout:60000,use:{baseURL:'http://127.0.0.1:4191',headless:true,reducedMotion:'reduce'},
  outputDir:'tmp/ardhi-postdelivery-results',
  webServer:{command:`${process.platform==='win32'?'npm.cmd':'npm'} run preview -- --host 127.0.0.1 --port 4191 --strictPort`,url:'http://127.0.0.1:4191/equipment/sp-ardhi-26.html',reuseExistingServer:false,timeout:120000},
});
