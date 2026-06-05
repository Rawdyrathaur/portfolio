#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const packageRoot = path.resolve(path.dirname(__filename), '..')

const targetName = process.argv[2]

if (!targetName) {
  console.error('Usage:')
  console.error('  npx @manishrathaur/ai-portfolio-starter my-portfolio')
  process.exit(1)
}

const targetDir = path.resolve(process.cwd(), targetName)

const blockedNames = new Set([
  'node_modules',
  '.git',
  'dist',
  'reports',
  '.cache',
  '.venv',
  'venv',
])

const blockedRootFiles = new Set([
  '.env',
  '.DS_Store',
  'repo_context.txt',
])

const blockedPackageOnlyFiles = new Set([
  '.npmignore',
])

function isEnvFile(fileName) {
  return fileName.startsWith('.env') && fileName !== '.env.example'
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function isDirectoryEmpty(dirPath) {
  const entries = await fs.readdir(dirPath)
  return entries.length === 0
}

async function copyTemplate(sourceDir, destinationDir, relativeDir = '') {
  await fs.mkdir(destinationDir, { recursive: true })

  const entries = await fs.readdir(sourceDir, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name)
    const destinationPath = path.join(destinationDir, entry.name)
    const relativePath = path.join(relativeDir, entry.name)

    if (blockedNames.has(entry.name)) continue
    if (relativeDir === '' && blockedRootFiles.has(entry.name)) continue
    if (relativeDir === '' && blockedPackageOnlyFiles.has(entry.name)) continue
    if (entry.name.endsWith('.tgz')) continue

    if (isEnvFile(entry.name)) continue

    if (
      relativePath === path.join('backend', '.env') ||
      relativePath === path.join('backend', 'venv') ||
      relativePath === path.join('backend', '.venv') ||
      relativePath === path.join('backend', 'tests', '.env.test')
    ) {
      continue
    }

    if (entry.isDirectory()) {
      await copyTemplate(sourcePath, destinationPath, relativePath)
      continue
    }

    if (entry.isFile()) {
      await fs.copyFile(sourcePath, destinationPath)
    }
  }
}

async function customizePackageJson(projectDir) {
  const packageJsonPath = path.join(projectDir, 'package.json')
  const raw = await fs.readFile(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(raw)

  packageJson.name = targetName
  packageJson.version = '0.1.0'
  packageJson.private = true

  delete packageJson.bin
  delete packageJson.files
  delete packageJson.publishConfig

  await fs.writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
  )
}

if (await pathExists(targetDir)) {
  const stats = await fs.stat(targetDir)

  if (!stats.isDirectory()) {
    console.error(`Error: "${targetName}" exists and is not a directory.`)
    process.exit(1)
  }

  if (!(await isDirectoryEmpty(targetDir))) {
    console.error(`Error: "${targetName}" already exists and is not empty.`)
    process.exit(1)
  }
}

await copyTemplate(packageRoot, targetDir)
await customizePackageJson(targetDir)

console.log('')
console.log('AI Portfolio Starter created successfully.')
console.log('')
console.log('Next steps:')
console.log(`  cd ${targetName}`)
console.log('  npm install')
console.log('  cp .env.example .env')
console.log('  npm run dev')
console.log('')
console.log('Before deploying:')
console.log('  npm run check')
console.log('')
