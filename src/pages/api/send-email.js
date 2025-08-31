import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use any email service of your choice
      auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS,  // Your email password or app password
      },
    });

    // Define the email content
    const mailOptions = {
      from: email,  // Sender's email
      to: 'info@smylsync.com',  // Your company's email address
      subject: `New Message from ${name}`,
      text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    try {
        console.log('Attempting to send email with options:', mailOptions);
        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send email.' });
    }
  } else {
    // If the request method is not POST, respond with a 405 (Method Not Allowed)
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
