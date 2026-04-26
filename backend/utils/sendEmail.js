const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Note: User needs to configure their email in .env
    // EMAIL_USER=your_email@gmail.com
    // EMAIL_PASS=your_app_password
    
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your preferred service
        auth: {
            user: process.env.EMAIL_USER || 'test@example.com',
            pass: process.env.EMAIL_PASS || 'password',
        },
    });

    const mailOptions = {
        from: `SmartInvest <${process.env.EMAIL_USER || 'test@example.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html, // Optional: if you want to send HTML emails
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
