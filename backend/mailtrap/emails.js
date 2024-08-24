import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js"
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