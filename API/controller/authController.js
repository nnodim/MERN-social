const User =  require('../model/user')
const bcrypt = require('bcrypt')


const register = async (req, res) => {
    const { username, email, password } = req.body;
    if(!username || !password || !email){
        return res.status(400).json({ message: 'Username, email and password are required' });
    }

    const existingUser = await User.findOne({ username: username }).exec();
    if(existingUser){
        return res.status(400).json({ message: 'Username already exists' });
    }

    const existingUserEmail = await User.findOne({ email: email }).exec();
    if(existingUserEmail){
        return res.status(400).json({ message: 'Email already exists' });
    }

    try {
        const password = req.body.password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username: username,
            email: email,
            password: hashedPassword
        })

        await user.save()
        res.status(201).send(user)

    } catch (error) {
        res.status(400).send(error)
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ email: email }).exec();
    if(!existingUser){
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    try {
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect){
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // const roles = Object.values(existingUser.roles);
        // const  accessToken = jwt.sign(
        //     {
        //         "UserInfo": {
        //             "email": existingUser.email,
        //             "roles": roles
        //         }
        //     },
        //     process.env.ACCESS_TOKEN_SECRET,
        //     { expiresIn: '5m' }
        // );

        // const refreshToken = jwt.sign(
        //     { "email": existingUser.username },
        //     process.env.REFRESH_TOKEN_SECRET,
        //     { expiresIn: '1d' }
        // );

        // existingUser.refreshToken = refreshToken;
        // existingUser.accessToken = accessToken;
        // const result = await existingUser.save();

        // res.cookie('jwt', refreshToken, { httpOnly: true, /*secure: true,*/ sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });

        res.status(200).json({ message: 'Login successful', user: existingUser});
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports = {
    register,
    login
}