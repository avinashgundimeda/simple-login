const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    name : String,
    lastname : String,
    email : String,
    password : String,
    number: {
    type: String,
    minLength: 10,
    validate: {
        validator: v => /\d{2,3}-?\d{6,}/.test(v),
        message: "this is not a valid number"
    }
}
    
})

const User = mongoose.model('User', userSchema);

module.exports = User;  