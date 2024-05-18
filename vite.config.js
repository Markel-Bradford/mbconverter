// https://vitejs.dev/config/
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.EXCHANGE_RATES_API_KEY': JSON.stringify(env.EXCHANGE_RATES_API_KEY)
    },
    plugins: [react()],
  }
})
