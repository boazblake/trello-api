import { IIssue} from "./types.ts"

const Issues = new Map<string, IIssue>()


const getAll = () => Array.from(Issues.values())

const getById = (id: string) => Issues.get(id) ? Issues.get(id) : 'error not issue with that id'

const deleteById = (id: string) => Issues.delete(id)

const updateById = (id: string, issue:IIssue) => {
  deleteById(id)
  add(id, issue)
}

const add = (id:string, issue: IIssue) => Issues.set(id, issue)


export default { getAll , getById, add, updateById, deleteById}

