import { IProject } from "./types.ts"
import { R } from './deps.ts'

const projects = new Map<string, IProject>()

const getAll = () : IProject[] => Array.from(projects.values())


const getById = (id: string) : IProject | undefined => projects.get(id)

const deleteById = (id: string): boolean => projects.delete(id)

const updateById = (id: string, project:IProject): IProject | undefined => {
  deleteById(id)
  return add(id, project)
}

const add = (id:string, project: IProject): IProject | undefined=> projects.set(id, project).get(id)


export default { getAll , getById, add, updateById, deleteById}
