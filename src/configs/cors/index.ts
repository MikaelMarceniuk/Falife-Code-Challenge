import cors from 'cors'

const corsConfig: cors.CorsOptions = {
  origin: '*'
}

export default cors(corsConfig)
