/**
 * Tour & Travel Email Service
 * Node.js server for sending emails via SMTP
 */

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // false for TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Email transporter verification failed:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Email service is running',
        timestamp: new Date().toISOString()
    });
});

// Send email endpoint
app.post('/send-email', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validation
        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Create email HTML template
        const emailHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: linear-gradient(135deg, #10221b 0%, #219150 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                    }
                    .content {
                        background: #f9f9f9;
                        padding: 30px;
                        border: 1px solid #ddd;
                    }
                    .field {
                        margin-bottom: 20px;
                        background: white;
                        padding: 15px;
                        border-left: 4px solid #219150;
                        border-radius: 5px;
                    }
                    .field-label {
                        font-weight: bold;
                        color: #10221b;
                        font-size: 14px;
                        text-transform: uppercase;
                        margin-bottom: 5px;
                    }
                    .field-value {
                        color: #555;
                        font-size: 16px;
                    }
                    .message-box {
                        background: white;
                        padding: 20px;
                        border-left: 4px solid #219150;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    .footer {
                        background: #10221b;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 0 0 10px 10px;
                        font-size: 12px;
                    }
                    .timestamp {
                        color: #999;
                        font-size: 12px;
                        margin-top: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🌍 New Contact Form Submission</h1>
                    <p style="margin: 5px 0 0 0;">Tour & Travel Website</p>
                </div>
                
                <div class="content">
                    <div class="field">
                        <div class="field-label">👤 Name</div>
                        <div class="field-value">${name}</div>
                    </div>
                    
                    <div class="field">
                        <div class="field-label">📧 Email</div>
                        <div class="field-value">${email}</div>
                    </div>
                    
                    <div class="field">
                        <div class="field-label">📱 Phone</div>
                        <div class="field-value">${phone}</div>
                    </div>
                    
                    <div class="field">
                        <div class="field-label">📝 Subject</div>
                        <div class="field-value">${subject}</div>
                    </div>
                    
                    <div class="message-box">
                        <div class="field-label">💬 Message</div>
                        <div class="field-value">${message}</div>
                    </div>
                    
                    <div class="timestamp">
                        ⏰ Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                    </div>
                </div>
                
                <div class="footer">
                    <p>This email was sent from Tour & Travel contact form</p>
                    <p>© ${new Date().getFullYear()} Travel.com - All rights reserved</p>
                </div>
            </body>
            </html>
        `;

        // Email options
        const mailOptions = {
            from: `"Tour & Travel 🌍" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Sending to your email
            replyTo: email, // User's email for reply
            subject: `New Contact: ${subject}`,
            html: emailHTML,
            text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}

Received: ${new Date().toLocaleString()}
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Email sent successfully:', info.messageId);
        console.log('📧 From:', name, `<${email}>`);
        console.log('📌 Subject:', subject);

        res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 ===================================');
    console.log(`📧 Email Service is running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`📬 Email endpoint: http://localhost:${PORT}/send-email`);
    console.log('🚀 ===================================');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down email service...');
    process.exit(0);
});
