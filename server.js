const { app } = require('./app')

const { initModels } = require('./models/init.models')

const { db } = require('./utils/db')

db.authenticate()
    .then(() => console.log('Db authenticated'))
    .catch((err) => console.log(err))

initModels()

db.sync()
    .then(() => console.log('Db synced'))
    .catch((err) => console.log(err))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Express app running!!', PORT)
})
