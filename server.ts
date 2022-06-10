import {Application, Router, helpers, oakCors, etag, R}  from "./deps.ts"
import Projects from './projects.ts'
import Tickets from './tickets.ts'
import Issues from './issues.ts'
import logger from './logger.ts'


const port = 8000
const app = new Application()
const router = new Router()

router.get('/projects', (ctx) => {
  ctx.response.body = Projects.getAll()
})


router.get('/projects/:id', (ctx) => {
  let {id} = helpers.getQuery(ctx, { mergeParams: true })

  ctx.response.body = Projects.getById(id)
})

router.post('/projects', async ctx => {
  let {value} =  ctx.request.body({ type: 'json' })
  let project = await value
  Projects.add(project.id,project)
  ctx.response.body = Projects.getById(project.id)
})

router.put('/projects/:id', async ctx => {
  let {id} = helpers.getQuery(ctx, { mergeParams: true })
  let {value} =  ctx.request.body({ type: 'json' })
  let project = await value
  Projects.updateById(id,project)
  ctx.response.body = Projects.getById(id)
})


router.options('/projects/:id', oakCors({ origin: "http://localhost:3000" }))
  .delete('/projects/:id', oakCors({ origin: "http://localhost:3000" }), async ctx => {
  let { id } = helpers.getQuery(ctx, { mergeParams: true })
  let issues = Issues.getAll()
  let ticketIds = R.compose(R.pluck('id'), R.filter(R.propEq('projectId', id)))(Tickets.getAll())
  let issueIds = R.compose(R.pluck('id'), R.map((id: string) => issues.filter(R.propEq('ticketId', id))))(ticketIds)
  issueIds.forEach((id: string) => Issues.deleteById(id))
  ticketIds.forEach(((id: string) => Tickets.deleteById(id)))
  Projects.deleteById(id)
  ctx.response.body = []
})

router.get('/tickets', (ctx) => {
  ctx.response.body = Tickets.getAll()
})

router.post('/tickets', async (ctx) => {
  let {value} =  ctx.request.body({ type: 'json' })
  let ticket = await value
  Tickets.add(ticket.id,ticket)
  ctx.response.body = Tickets.getById(ticket.id)
})

router.put('/tickets/:id', async ctx => {
  let {id} = helpers.getQuery(ctx, { mergeParams: true })
  let {value} =  ctx.request.body({ type: 'json' })
  let ticket = await value
  Tickets.updateById(id,ticket)
  ctx.response.body = Tickets.getById(id)
})

router.get('/issues', (ctx) => {
  ctx.response.body = Issues.getAll()
})

router.post('/issues', async (ctx) => {
  let {value} =  ctx.request.body({ type: 'json' })
  let issue = await value
  Issues.add(issue.id,issue)
  ctx.response.body = Issues.getById(issue.id)
})

router.put('/issues', async (ctx) => {
  let {value} =  ctx.request.body({ type: 'json' })
  let issue = await value
  Issues.updateById(issue.id,issue)
  ctx.response.body = Issues.getById(issue.id)
})

app.use(etag.factory())
app.use(logger.logger)
app.use(logger.responseTime)
app.use(oakCors({ origin: "*" }))
app.use(router.allowedMethods())
app.use(router.routes())

app.addEventListener('listen', (e) => {
  console.log(`Listening on: localhost:${port}`)
})

await app.listen({ port })

