import configs from './configs'
import app from './server'

const PORT = configs.ENV.PORT

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

// Fazer calculo da idade
// Tem q ser maior de idade
