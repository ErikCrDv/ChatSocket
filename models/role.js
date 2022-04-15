const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    role: {
        type: String,
        required: [true, 'Role required!']
    }
});

module.exports = model( 'Role', RoleSchema );