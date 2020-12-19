const mongoose = require('mongoose');
mongoose.connect(require('../config/keys').MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log('thanh cong'))
    .catch(err => console.log('that bai'))