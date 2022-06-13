import { IIssue } from "./types.ts"

const Issues = new Map<string, IIssue>()


const getAll = (): IIssue[] => Array.from(Issues.values())

const getById = (id: string) :IIssue | undefined => Issues.get(id)

const deleteById = (id: string): boolean => Issues.delete(id)

const updateById = (id: string, issue:IIssue): IIssue | undefined => {
  deleteById(id)
  return add(id, issue)
}

const add = (id:string, issue: IIssue) :IIssue | undefined => Issues.set(id, issue).get(id)


export default { getAll , getById, add, updateById, deleteById}

