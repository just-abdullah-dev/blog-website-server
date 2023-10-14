const User = require("../models/user");
const fileRemover = require("../utils/fileRemover");
const uploadPictureMiddleware = require("../middleware/uploadPictureMiddleware");

const userRegister = async (req, res, next) => {
    try {
        const { name, password, email } = req.body;

        //Checking whether user exists or not
        let user = await User.findOne({ email })
        if (user) {
            throw new Error('User is already registered.')
        }

        // Creating a new user
        user = await User.create({
            name,
            email,
            password,
        });

        return res.status(201).json({
            _id: user._id,
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            verified: user.verified,
            admin: user.admin,
            token: await user.generateJWT(),
        });
    } catch (error) {
        next(error)
    }
}

const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            throw new Error("Email is not registered.");
        } else {
            if (await user.comparePassword(password)) {
                res.status(201).json({
                    message: "Logged in successfully.",
                    _id: user._id,
                    avatar: user.avatar,
                    name: user.name,
                    email: user.email,
                    verified: user.verified,
                    admin: user.admin,
                    token: await user.generateJWT(),
                });
            } else {
                throw new Error('Password is incorrect.');
            }
        }
    } catch (error) {
        next(error);
    }
}

const userProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.status(201).json({
                _id: user._id,
                avatar: user.avatar,
                name: user.name,
                email: user.email,
                verified: user.verified,
                admin: user.admin,
            })
        } else {
            let error = new Error('User not found.');
            error.statusCode = 404;
            next(error);
        }
    } catch (error) {
        next(error);
    }
}

const userUpdate = async (req, res, next) => {
    try {
        let user = await User.findById(req.user._id);
        if (!user) {
            throw new Error('user not found.');
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password && req.body.password.length < 6) {
            throw new Error('Password length must be 6 or more characters.')
        } else if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
        })
    } catch (error) {
        next(error)
    }
}

const updateProfilePicture = (req, res, next) => {
    try {
        const upload = uploadPictureMiddleware.single("profilePicture");

        upload(req, res, async function (err) {
            if (err) {
                const error = new Error(err.message)
                next(error);
            } else {
                //Everything went well
                if (req.file) {
                    let prevFilename;
                    let updatedUser = await User.findById(req.user._id);
                    prevFilename = updatedUser.avatar;
                    if (prevFilename) {
                        //Removing previuos file
                        fileRemover(prevFilename);
                    }
                    updatedUser.avatar = req.file.filename;
                    await updatedUser.save();
                    res.json({
                        _id: updatedUser._id,
                        avatar: updatedUser.avatar,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        verified: updatedUser.verified,
                        admin: updatedUser.admin,
                        token: await updatedUser.generateJWT(),
                    })
                } else {
                    let filename;
                    let updatedUser = await User.findById(req.user._id);
                    filename = updatedUser.avatar;
                    updatedUser.avatar = "";
                    await updatedUser.save();
                    fileRemover(filename);
                    res.json({
                        _id: updatedUser._id,
                        avatar: updatedUser.avatar,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        verified: updatedUser.verified,
                        admin: updatedUser.admin,
                        token: await updatedUser.generateJWT(),
                    });
                }
            }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    userRegister,
    userLogin,
    userProfile,
    userUpdate,
    updateProfilePicture
}
