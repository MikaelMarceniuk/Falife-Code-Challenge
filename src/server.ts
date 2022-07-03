import 'dotenv/config'
import express from 'express'
import configs from './configs'
import morgan from 'morgan'
import router from './router'
import 'reflect-metadata'

class App {
  app

  constructor() {
    this.app = express()
    this.runMiddlewares()
    this.runRoutes()
  }

  runMiddlewares() {
    this.app.use(configs.cors)
    this.app.use(morgan('dev'))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  runRoutes() {
    router(this.app)
  }
}

export default new App().app
