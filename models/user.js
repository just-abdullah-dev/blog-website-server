const mongoose = require('mongoose')
const { hash, compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        avatar: { type: String, default: "" },
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        verified: { type: Boolean, default: false },
        verificationCode: { type: String, required: false },
        admin: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hash(this.password, 10);
        return next();
    }
    return next();
})

userSchema.methods.generateJWT = async function () {
    return await sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

userSchema.methods.comparePassword = async function (enteredPassword){
    return await compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;