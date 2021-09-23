#! /usr/bin/env node
console.log('# dev')
const path = require('path')
const fs = require('fs')

console.log('__dirname', __dirname)
console.log('process.cwd()', process.cwd())

const shell = require('shelljs')

shell.exec('npm install ../../../')
shell.exec('npm run ext:invoke')
// shell.exec('npm run front:dev')