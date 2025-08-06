import ContactMessage from "../models/ContactMessage.js";
import nodemailer from "nodemailer";

export const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 1. Save to database
    await ContactMessage.create({ name, email, message });

    // 2. Send email (optional)
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      // Replace `process.env.EMAIL_USERNAME` with the admin's receiving email (e.g., 'admin@highqclasses.com') once it's ready.
      to: process.env.EMAIL_USERNAME,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending contact message:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};
