module.exports = {
  transporter : {
    host: "mail.okpol.pl",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'm.demski@okpol.pl', // generated ethereal user
      pass: 'jukendens09', // generated ethereal password
    }
  }
};
