import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, name ,verificationToken) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "Verify your email", 
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken).replace("{name}", name),
            category: "Email Verification"
        })
        console.log(verificationToken);
        
        console.log("Email sent successfully", response);
        
    } catch (error) {
        console.error(`Error sending verification mail `,error.message);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "Welcome to BeastHub", 
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
            category: "Welcome Email"
        })
        console.log("Email sent successfully", response);
        
    } catch (error) {
        console.error(`Error sending welcome mail `,error.message);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{email}]

    try {
        
        const response = await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        })

    } catch (error) {
        console.error(`Error sending password reset mail `,error.message);
        throw new Error(`Error sending password reset email: ${error.message}`);
        
    }

}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}]
     
    try {
        
        const response = await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "Password Reset Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success"
        })

        console.log("Email sent successfully", response);

    } catch (error) {
        console.error(`Error sending password reset success mail `,error.message);
        throw new Error(`Error sending password reset success email: ${error.message}`);
    }

}