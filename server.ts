import { Application, Router, helpers, oakCors, etag, R } from "./deps.ts"
import Projects from './projects.ts'
import Tickets from './tickets.ts'
import Issues from './issues.ts'
import logger from './logger.ts'
import {ITicket, IProject, IIssue   } from './types.ts'

const log = (m:string) => (v:any) => { console.log(m, v);  return v}
const range = (size: number) => [...Array(size).keys()]


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
  let last = Projects.getAll().at(-1)
  if (last) {
    project.order = (last.order) + 1
  }
  Projects.add(project.id,project)
  ctx.response.body = Projects.getById(project.id)
})

router.put('/projects/:id', async ctx => {
  let {id} = helpers.getQuery(ctx, { mergeParams: true })
  let {value} =  ctx.request.body({ type: 'json' })
  let project = await value
  let prev = Projects.getById(id)
  if(prev){  if ((prev.order) != (project.order)) {
    let idx = range(Math.abs((prev.order) - (project.order)))
    let ord  = (prev.order) > (project.order)
    let xs  = Projects.getAll().filter((x: IProject) => idx.includes((x.order)))
    xs.forEach((x:IProject) => {
      x.order = ord ? ((x.order) + 1) : ((x.order) - 1)
      Projects.updateById(x.id, x)
    })
  }}
  Projects.updateById(id,project)
  ctx.response.body = Projects.getById(id)
})


router.options('/projects/:id', oakCors({ origin: "http://localhost:3000" }))
  .delete('/projects/:id', oakCors({ origin: "http://localhost:3000" }), async ctx => {
  let { id } = helpers.getQuery(ctx, { mergeParams: true })
  let ticketIds = R.compose(R.pluck('id'), R.filter(R.propEq('projectId', id)))(Tickets.getAll())
  let issues = Issues.getAll()
    let issueIds = R.compose(R.pluck('id'), R.filter((x: IIssue) => ticketIds.includes(x.ticketId)))(issues)
    console.log('delete 0project', issueIds)
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
    let last = Tickets.getAll().filter(R.propEq('projectId', ticket.projectId)).sort(R.prop('order')).at(-1)
  if (last) {
    ticket.order = (last.order) + 1
  }
  console.log('tickert',ticket, last)
  Tickets.add(ticket.id,ticket)
  ctx.response.body = Tickets.getById(ticket.id)
})

router.put('/tickets/:id', async ctx => {
  let {id} = helpers.getQuery(ctx, { mergeParams: true })
  let {value} =  ctx.request.body({ type: 'json' })
  let ticket = await value
  let prev = Tickets.getById(id)
  if(prev){  if ((prev.order) != (ticket.order)) {
    let idx = range(Math.abs((prev.order) - (ticket.order)))
    let ord  = (prev.order) > (ticket.order)
    let xs  = Tickets.getAll().filter((x: ITicket) => idx.includes((x.order)))
    xs.forEach((x:ITicket) => {
      x.order = ord ? ((x.order) + 1) : ((x.order) - 1)
      Tickets.updateById(x.id, x)
    })
  }}
  Tickets.updateById(id,ticket)
  ctx.response.body = Tickets.getById(id)
})

router.options('/tickets/:id', oakCors({ origin: "http://localhost:3000" }))
  .delete('/tickets/:id', oakCors({ origin: "http://localhost:3000" }), async ctx => {
  let { id } = helpers.getQuery(ctx, { mergeParams: true })
  let issueIds = R.compose(R.pluck('id'), R.filter(R.propEq('ticketId', id)))(Issues.getAll())
    console.log('delete ticket', issueIds)
  issueIds.forEach(((id: string) => Issues.deleteById(id)))
  Tickets.deleteById(id)
  ctx.response.body = []
})

router.get('/issues', (ctx) => {
  ctx.response.body = Issues.getAll()
})

router.post('/issues', async (ctx) => {
  let {value} =  ctx.request.body({ type: 'json' })
  let issue = await value
    let last = Issues.getAll().filter(R.propEq('ticketId', issue.ticketId)).sort(R.prop('order')).at(-1)
  if (last) {
    issue.order = (last.order) + 1
  }
  Issues.add(issue.id,issue)
  ctx.response.body = Issues.getById(issue.id)
})

router.put('/issues/:id', async (ctx) => {
  let {id} = helpers.getQuery(ctx, { mergeParams: true })
  let {value} =  ctx.request.body({ type: 'json' })
  let issue = await value
  let prev = Issues.getById(id)
  if (prev) {

    if (prev.ticketId == issue.ticketId) {
      if ((prev.order) != (issue.order)) {
        //same ticket
        let idxs = range(Math.abs((prev.order) - (issue.order)))
        let ord = (prev.order) > (issue.order)
        let xs = Issues.getAll().filter((x: IIssue) => idxs.includes((x.order)))
        xs.forEach((x: IIssue) => {
          x.order = ord ? ((x.order) + 1) : ((x.order) - 1)
          Issues.updateById(x.id, x)
        })
      }
    } else {
      // handle prev ticket issues
      let prevXs = Issues.getAll().filter((x: IIssue) => prev && (x.order) > (prev.order))
      prevXs.forEach(x => {
        x.order = ((x.order) - 1)
          Issues.updateById(x.id, x)
      })

      // handle new ticket issues

        let newXs = Issues.getAll().filter((x: IIssue) => x.ticketId == issue.ticketId && (x.order) > (issue.order))
        newXs.forEach((x: IIssue) => {
          x.order =  ((x.order) + 1)
          Issues.updateById(x.id, x)
        })
    }
  }
  Issues.updateById(issue.id,issue)
  ctx.response.body = Issues.getById(issue.id)
})

router.options('/issues/:id', oakCors({ origin: "http://localhost:3000" }))
  .delete('/issues/:id', oakCors({ origin: "http://localhost:3000" }), async ctx => {
  let { id } = helpers.getQuery(ctx, { mergeParams: true })
  Issues.deleteById(id)
  ctx.response.body = []
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

