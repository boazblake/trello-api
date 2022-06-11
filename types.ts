export type IProject = {
  id: string,
  title: string
  order: number
}

export type ITicket = {
  id: string,
  title: string
  projectId: string
  isSelected: boolean
  order: number
}

export type IIssue = {
  id: string,
  title: string,
  ticketId: string,
  isSelected: boolean
  order: number
}

// export {
//   IIssues, ITicket, IProject
// }
