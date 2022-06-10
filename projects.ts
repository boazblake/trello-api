import { IProject } from "./types.ts"

const projects = new Map<string, IProject>()

const getAll = () => Array.from(projects.values())

const getById = (id: string) => projects.get(id) ? projects.get(id) : 'error not project with that id'

const deleteById = (id: string) => projects.delete(id)

const updateById = (id: string, project:IProject) => {
  deleteById(id)
  add(id, project)
}

const add = (id:string, project: IProject) => projects.set(id, project)


export default { getAll , getById, add, updateById, deleteById}
