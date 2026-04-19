import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const isProduction = process.env.NODE_ENV === 'production'
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: databaseUrl,
    http: {
      storeCors: process.env.STORE_CORS || '.*',
      adminCors: process.env.ADMIN_CORS || '.*',
      authCors: process.env.AUTH_CORS || '.*',
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  admin: {
    disabled: isProduction
  },
  plugins: []
})