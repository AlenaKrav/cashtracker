import { transport } from "../config/nodemailer"

type UserEmailType = {
    name: string,
    email: string,
    token: string //al crear token conm la funcion auxiliar realmente genera un string aunque en la bd a aprece como valor numerico
}

export class AuthEmail{
    static sendConfirmationEmail= async (user : UserEmailType) => {
        const email = await transport.sendMail({
            from: '"CashTracker" <no-reply@cashtrackr.dev>',
            to: user.email,
            subject: 'CashTracker - Confirma tu cuenta',
            html: `
                <p>Hola: ${user.name}, has creado tu cuenta en CashTracker, y ya casi está lista</p>
                <p>Visita el siguiente enlace para confirmarla:</p>
                <a href="#">Confirmar mi cuenta</a>
                <p>e igresa este código: <b>${user.token}</b></p>`
        })
        console.log('Mensaje enviado: ', email.messageId)
    }

        static sendPasswordResetToken= async (user : UserEmailType) => {
        const email = await transport.sendMail({
            from: '"CashTracker" <no-reply@cashtrackr.dev>',
            to: user.email,
            subject: 'CashTracker - Restablece tu contraseña',
            html: `
                <p>Hola: ${user.name}, has solicitado restablecer tu contraseña de CashTracker</p>
                <p>Visita el siguiente enlace para confirmarla:</p>
                <a href="#">Restablecer mi contraseña</a>
                <p>e igresa este código: <b>${user.token}</b></p>`
        })
        console.log('Mensaje enviado: ', email.messageId)
    }
}