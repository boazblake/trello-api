import { SQLite3Connector, Database, Relationships } from "../deps.ts"
import Project from "./projects"

const connector = new SQLite3Connector({
  filepath: "./database.sqlite",
})

const db = new Database(connector)

const ProjectTickets = Relationships

db.link([Project])

