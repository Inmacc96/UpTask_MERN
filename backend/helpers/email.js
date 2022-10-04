import nodemailer from "nodemailer";

//Email para confirmar la cuenta
export const emailConfirmAccount = async (data) => {
  const { email, name, token } = data;

  //Configuramos el cliente que envia el email
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d8a613e505fdc4",
      pass: "618ba8ae630bc3",
    },
  });

  // Información del email

  //Va a enviar el email una vez que identifica las credenciales de transport correctamente
  const info = await transport.sendMail({
    from: '"UpTask - Project Manager" <accounts@uptask.com>',
    to: email,
    subject: "UpTask - Confirm your account",
    text: "Confirm your UpTask account",
    html: `<p>Hi, ${name}. Confirm your UpTask account.</p>
    <p>Your account is almost ready, just confirm it by clicking on the following link:

    <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm Account</a>

    <p>If you did not create this account, you can ignore the message. </p>
   
    `
  })
};
