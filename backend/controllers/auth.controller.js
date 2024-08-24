import crypto from 'crypto'
import { User } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { genrateTokenAndSetCookie } from '../utils/genrateTokenAndSetCookie.js';
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/emails.js';


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

        const hashedPassword = await bcrypt.hash(password, 10);
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
    
    const {email , password} = req.body;
    
    try {
        
        const user = await User.findOne({email});

        if(!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        genrateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();

        await user.save();

        res.status(200).json({
            success:true, 
            message:'Logged in successfully.',
        user : {
            ...user._doc, 
            password:undefined}});

    } catch (error) {
        console.error('Error in login: ', error.message);
        res.status(400).json({success:false, message:error.message}); 
    }

}

export const logout = async (req , res) => {
    res.clearCookie('token');
    res.status(200).json({success:true, message:'Logged out successfully!'});
}

export const forgotPassword = async (req , res) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) {
            throw new Error('User not found');
        }

        //Generate random reset token

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;

        await user.save();
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken }`);

        res.status(200).json({success:true, message:'Password reset link sent to your email.'});
    } catch (error) {
        console.error('Error in forgotPassword: ', error.message);
        res.status(400).json({success:false, message:error.message});
    }
}

export const resetPassword = async (req , res) => {

    try {
        
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: {$gt: Date.now()}});

        if(!user) {
            throw new Error('Invalid or expired reset token');
        }

        //update password

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email, `${process.env.CLIENT_URL}/login`);

        res.status(200).json({success:true, message:'Password reset successfully!'});

    } catch (error) {
        console.error('Error in resetPassword: ', error.message);
        res.status(400).json({success:false, message:error.message});
        
    }

}