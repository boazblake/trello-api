import { ITicket } from "./types.ts"

const Tickets = new Map<string, ITicket>()

const getAll = () => Array.from(Tickets.values())

const getById = (id: string) => Tickets.get(id) ? Tickets.get(id) : 'error not project with that id'

const deleteById = (id: string) => Tickets.delete(id)

const updateById = (id: string, project:ITicket) => {
  deleteById(id)
  add(id, project)
}

const add = (id:string, project: ITicket) => Tickets.set(id, project)


export default { getAll , getById, add, updateById, deleteById}

