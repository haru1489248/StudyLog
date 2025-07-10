// prisma/merge.mts
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ES Modules では __dirname がないので自前で定義
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const modelsDir = path.join(__dirname, 'models')
const outputPath = path.join(__dirname, 'schema.prisma')

// ヘッダー（generator や datasource を先頭に固定）
const header = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}\n\n`

// models/*.prisma を結合
const modelFiles = fs
  .readdirSync(modelsDir)
  .filter((file) => file.endsWith('.prisma'))
  .sort()

const body = modelFiles
  .map((file) => fs.readFileSync(path.join(modelsDir, file), 'utf-8'))
  .join('\n\n')

fs.writeFileSync(outputPath, header + body)

console.log(`✅ schema.prisma has been updated with ${modelFiles.length} model(s).`)
