const dotenv = require('dotenv')
const winston = require('winston')
const GithubHook = require('./util/github')

winston.cli()
dotenv.config()

const githubHookEmitter = new GithubHook({
  path: '/api/v1/hooks/update',
  events: ['push', 'ping'],
  secret: process.env.GITHUB_HOOK_SECRET || ''
})

module.exports = exports = (app, io) => {
  app.use(githubHookEmitter)

  githubHookEmitter.on('*', (event, repo, payload) => {
    const { ref } = payload
    const requiredRef = 'refs/heads/master'
    const requiredRepo = 'nicklasfrahm/indesy-robot'
    if (event) winston.info(`[GWE] Event: ${event}`)
    if (repo) winston.info(`[GWE] Repo: ${repo}`)
    if (ref) winston.info(`[GWE] Ref: ${ref}`)
    if (repo === requiredRepo && ref === requiredRef) {
      winston.info('[GHE] Triggering update.')
      io.to('robots').emit('updateAvailable')
    }
  })
}
