export interface IProject {
  id: string,
  title: string
}

export interface ITicket {
  id: string,
  title: string
  projectId: string
  isSelected: boolean
}

export interface IIssue {
  id: string,
  title: string,
  ticketId: string,
  isSelected: boolean
}

// export {
//   IIssues, ITicket, IProject
// }
