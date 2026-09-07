import { env } from './env.js'
import sql from 'mssql'

const config = {
  production: {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    server: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
  }
}

const poolConnection = new sql.ConnectionPool(config.production).connect()

export async function getPool() {
  return poolConnection
}

export default config
