import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
const files = execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean)
const problems=[]
const tokens=[/\b(?:sk_live_|pk_live_|whsec_)[A-Za-z0-9]{16,}/, /\bgh[pousr]_[A-Za-z0-9]{24,}/, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/]
for(const file of files){
 if ((/^\.env(?:\.|$)/.test(file)&&file!=='.env.example') || file.startsWith('.vercel/') || /\.(?:dump|pem|p12|pfx)$/.test(file)) problems.push(file+': private file path')
 const bytes=readFileSync(file)
 if(bytes.includes(0))continue
 const text=bytes.toString('utf8')
 if(tokens.some(regex=>regex.test(text)))problems.push(file+': possible credential or private key')
 if(/\b(?:prj_|team_)[A-Za-z0-9]{15,}/.test(text))problems.push(file+': cloud project identifier')
}
if(problems.length){console.error(problems.join('\n'));process.exit(1)}
console.log(`Checked ${files.length} tracked source files for private paths, known secret patterns, and cloud project identifiers.`)
