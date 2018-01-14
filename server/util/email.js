const nodemailer = require('nodemailer')

exports.createTransporter = () => {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  })
}

exports.mailOptions = {
  passwordReset: function(targetEmail, resetId) {
    const link = `http://${process.env.DOMAIN}/reset-password/?id=${resetId}`
    return {
      from: `"Do Not Reply" <${process.env.EMAIL}>`,
      to: targetEmail,
      subject: 'Password Reset - Calendar',
      html: `<div>To finish resetting your password, please follow this link: 
      <a href = "${link}">${link}</a></div>
      <div>This link will be valid for 24 hours.  If you did not request a password change, 
      please ignore this message.</div>`
    }
  },
}