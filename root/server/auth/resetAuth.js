const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

async function sendResetPasswordEmail(userEmail, resetLink) {
    try {
        const accessToken = await oauth2Client.getAccessToken();
        console.log('Access Token:', accessToken.token); 

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
            tls: {
                rejectUnauthorized: false, // This line will allow self-signed certificates
            },
        });

        await transporter.sendMail({
            to: userEmail,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            html: `<p>You requested a password reset</p><p>Click this <a href="${resetLink}">link</a> to reset your password. This link is valid for 1 hour.</p>`,
        });

        console.log('Reset password email sent successfully!');
    } catch (error) {
        console.error('Error sending reset password email:', error);
    }
}

module.exports = {
    sendResetPasswordEmail,
};