import { User } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { genrateTokenAndSetCookie } from '../utils/genrateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/emails.js';


export const signup = async (req , res) => {

    const {email , password, name} = req.body;
    
    try {
        if(!email || !password || !name) {
            throw new Error ('All fields are required!')
        }

        const userAlreadyExists = await User.findOne({email});
            
        if(userAlreadyExists) {
            return res.status(400).json({success:false, message:'User already exists!'});
            
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000  // 24 hours
        })

        await user.save();

        //jwt token

        genrateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, user.name, user.verificationToken);
        

        res.status(201).json({success:true, message:'User created successfully!', user : {...user._doc, password:undefined}});
            
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
}

export const verifyEmail = async(req, res) => {
    const {code} = req.body;

    try {
        const user =await User.findOne({
            verificationToken: code,
            verificationTokenExpires: {$gt: Date.now()}});

            if(!user) {
                throw new Error('Invalid or expired verification code');
            }

            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpires = undefined;

            await user.save();

            await sendWelcomeEmail(user.email, user.name);

            res.status(200).json({
                success:true, 
                message:'Email verified successfully!',
            user : {
                ...user._doc, 
                password:undefined}});

    } catch (error) {   
        console.error(`error in verifyEmail: ${error.message}`);
        
        res.status(400).json({success:false, message:error.message});
    }
}

export const login = async (req , res) => {
    res.send('login route')
}

export const logout = async (req , res) => {
    res.send('logout route')
}