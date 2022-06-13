import { ITicket } from "./types.ts"

const Tickets = new Map<string, ITicket>()

const getAll = ():ITicket[] => Array.from(Tickets.values())

const getById = (id: string): ITicket | undefined => Tickets.get(id)
const deleteById = (id: string): Boolean => Tickets.delete(id)

const updateById = (id: string, project:ITicket) :ITicket | undefined => {
  deleteById(id)
  return add(id, project)
}

const add = (id:string, project: ITicket) :ITicket | undefined => Tickets.set(id, project).get(id)


export default { getAll , getById, add, updateById, deleteById}

