import transporter from '../config/emailConfig.js';

/**
 * Send OTP email to user
 * @param {string} to - recipient email
 * @param {string} otp - OTP code
 * @param {string} name - recipient name (optional)
 */
export const sendOtpEmail = async (to, otp, name = '') => {
  try {
    const mailOptions = {
      from: `"Crosslect Support Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your OTP for Crosslect Support Portal Login',
      html: `
        <p>Hi ${name || 'User'},</p>
        <p>Your One Time Password (OTP) for login is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

/**
 * Send invitation email to new user
 * @param {string} to 
 * @param {string} name 
 */
export const sendInviteEmail = async (to, name) => {
  try {
    const mailOptions = {
      from: `"Crosslect Support Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Invitation to join Crosslect Support Portal',
      html: `
        <p>Hi ${name || 'User'},</p>
        <p>You have been invited to join the <b>Crosslect Support Portal</b>.</p>
        <p>Please login using your email and the OTP you receive.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Invite email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending invite email:', error);
    return false;
  }
};
