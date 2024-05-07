let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const userSchema = new Schema({
    id: String, 
    pw: String,
    content: {type: String, required: false}
})

module.exports = mongoose.model('User', userSchema)

