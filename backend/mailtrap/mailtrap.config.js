import { MailtrapClient } from "mailtrap";
import dotenv from 'dotenv';

dotenv.config({ path:'../.env' });

export const mailtrapClient = new MailtrapClient({ endpoint:process.env.MAILTRAP_ENDPOINT , token:process.env.MAILTRAP_TOKEN });

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Shashank",
};