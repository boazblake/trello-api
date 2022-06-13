export type IProject = {
  id: string,
  title: string
  order: number
}

export type ITicket = {
  id: string,
  title: string
  projectId: string
  order: number
}

export type IIssue = {
  id: string,
  title: string,
  ticketId: string,
  order: number
}

