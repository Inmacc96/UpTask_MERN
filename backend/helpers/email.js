import nodemailer from "nodemailer";

//Email para confirmar la cuenta
export const emailConfirmAccount = async (data) => {
  const { email, name, token } = data;

  //Configuramos el cliente que envia el email

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


  // Información del email

  //Va a enviar el email una vez que identifica las credenciales de transport correctamente
  const info = await transport.sendMail({
    from: `UpTask - Project Manager" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "UpTask - Confirm your account",
    text: "Confirm your UpTask account",
    html: `<p>Hi, ${name}. Confirm your UpTask account.</p>
    <p>Your account is almost ready, just confirm it by clicking on the following link:

    <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm Account</a>

    <p>If you did not create this account, you can ignore the message. </p>
   
    `,
  });
};

//Email para recuperar la contraseña
export const emailResetPassword = async (data) => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información del email

  const info = await transport.sendMail({
    from: '"UpTask - Project Manager" <accounts@uptask.com>',
    to: email,
    subject: "UpTask - Reset your password",
    text: "Reset your password",
    html: `<p>Hi, ${name}. You have requested to reset your password.</p>
    <p>Click on the following link to generate a new password:

    <a href="${process.env.FRONTEND_URL}/forget-password/${token}">Reset Password</a>

    <p>If you did not request this email, you can ignore the message. </p>
   
    `,
  });
};
