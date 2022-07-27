const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const pug = require('pug')
const path = require('path')
const { htmlToText } = require('html-to-text')

dotenv.config({ path: './config.env' })

class Email {
    constructor(to) {
        this.to = to
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: 'apikey',
                    pass: process.env.SENDGRID_API_KEY,
                },
            })
        }

        return nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        })
    }

    async send(template, subject, mailData) {
        const html = pug.renderFile(
            path.join(__dirname, '..', 'views', 'emails', `${template}.pug`),
            mailData
        )

        await this.newTransport().sendMail({
            from: process.env.MAIL_FROM,
            to: this.to,
            subject,
            html,
            text: htmlToText(html),
        })
    }

    async sendWelcome(userName) {
        await this.send('welcome', 'Welcome to our app', { userName })
    }

    async sendNewPost(totalPrice) {
        await this.send('newPost', ' tanks for you pursache', { totalPrice })
    }
}

module.exports = { Email }
