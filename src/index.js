const app = require('./app')
const ENV_CONFIG = require('./configs/env.config')
const { connectMongoDb, setupUser } = require('./db')

const start = async () => {
  try {
    // connect databases
    await connectMongoDb()
    console.log('🍃 Connect mongodb successfully')

    await setupUser()

    app.listen(ENV_CONFIG.PORT, () => {
      console.log('🍂 Server is running on port ' + ENV_CONFIG.PORT)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
