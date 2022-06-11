import { DataTypes, Model } from "../deps.ts"

class Project extends Model {
  static table = "projects"
  static timestamps = true
  static fields = {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      length: 25,
    },
  }
}

export default Project

