import ContactMessage from "../models/ContactMessage.js";
import emailService from "../utils/emailService.js";

export const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required (name, email, message)"
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address"
      });
    }

    // 1. Save to database
    const contactMessage = await ContactMessage.create({
      name,
      email,
      message
    });

    // 2. Send email notification to admin
    try {
      const adminEmailSubject = `New Contact Message from ${name}`;
      const adminEmailContent = `
        <h3>New Contact Message Received</h3>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p><strong>Received at:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          This message was sent through the HighQ Classes contact form.
        </p>
      `;

      await emailService.sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@highqclasses.com',
        subject: adminEmailSubject,
        html: adminEmailContent
      });

      // 3. Send confirmation email to user
      const userEmailSubject = "Thank you for contacting HighQ Classes";
      const userEmailContent = `
        <h3>Thank you for reaching out!</h3>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        
        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h4>Your message:</h4>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <p>Our team typically responds within 24-48 hours during business days.</p>
        <p>Best regards,<br>HighQ Classes Team</p>
        
        <hr>
        <p style="font-size: 12px; color: #666;">
          If you need immediate assistance, please call us at [Your Phone Number] or email admin@highqclasses.com
        </p>
      `;

      await emailService.sendEmail({
        to: email,
        subject: userEmailSubject,
        html: userEmailContent
      });

    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the entire request if email fails
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      messageId: contactMessage._id
    });

  } catch (error) {
    console.error("Error sending contact message:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
};

// Send contact message from authenticated student/teacher
export const sendStudentTeacherMessage = async (req, res) => {
  const { subject, message } = req.body;

  try {
    // Validation
    if (!subject || !message) {
      return res.status(400).json({
        message: "Subject and message are required"
      });
    }

    // Get user info from JWT token (added by protect middleware)
    const { name, email, role, _id } = req.user;

    // 1. Save to database with user info
    const contactMessage = await ContactMessage.create({
      name,
      email,
      message: `Subject: ${subject}\n\n${message}`,
      userId: _id,
      userRole: role,
      category: role === 'teacher' ? 'teacher_inquiry' : 'student_inquiry'
    });

    // 2. Send email notification to admin
    try {
      const adminEmailSubject = `New ${role.toUpperCase()} Message from ${name}`;
      const adminEmailContent = `
        <h3>New ${role.charAt(0).toUpperCase() + role.slice(1)} Message Received</h3>
        <p><strong>From:</strong> ${name} (${role})</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p><strong>Received at:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          This message was sent by an authenticated ${role} through the HighQ Classes dashboard.
        </p>
      `;

      await emailService.sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@highqclasses.com',
        subject: adminEmailSubject,
        html: adminEmailContent
      });

      // 3. Send confirmation email to user
      const userEmailSubject = "Your message has been sent to Admin";
      const userEmailContent = `
        <h3>Message Sent Successfully!</h3>
        <p>Dear ${name},</p>
        <p>Your message has been sent to the admin team and we will get back to you as soon as possible.</p>
        
        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h4>Subject: ${subject}</h4>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <p>Our admin team typically responds within 24-48 hours during business days.</p>
        <p>You can check for replies in your dashboard.</p>
        <p>Best regards,<br>HighQ Classes Admin Team</p>
        
        <hr>
        <p style="font-size: 12px; color: #666;">
          This is an automated confirmation for your message sent through the HighQ Classes dashboard.
        </p>
      `;

      await emailService.sendEmail({
        to: email,
        subject: userEmailSubject,
        html: userEmailContent
      });

    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the entire request if email fails
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully! Admin will respond soon.",
      messageId: contactMessage._id
    });

  } catch (error) {
    console.error("Error sending student/teacher message:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
};

// Get all contact messages (Admin only)
export const getContactMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;

    let query = {};
    if (status !== 'all') {
      query.status = status;
    }

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await ContactMessage.countDocuments(query);

    res.status(200).json({
      success: true,
      data: messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching messages"
    });
  }
};

// Get student/teacher messages only (Admin only)
export const getStudentTeacherMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all', role = 'all' } = req.query;

    let query = {
      userRole: { $in: ['student', 'teacher'] } // Only authenticated users
    };

    if (status !== 'all') {
      query.status = status;
    }

    if (role !== 'all') {
      query.userRole = role;
    }

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await ContactMessage.countDocuments(query);

    res.status(200).json({
      success: true,
      data: messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error("Error fetching student/teacher messages:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching messages"
    });
  }
};

// Mark message as read/replied (Admin only)
export const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status, adminReply } = req.body;

    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      messageId,
      {
        status,
        adminReply,
        repliedAt: status === 'replied' ? new Date() : undefined,
        repliedBy: status === 'replied' ? req.user._id : undefined
      },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Message status updated successfully",
      data: updatedMessage
    });

  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating message status"
    });
  }
};
