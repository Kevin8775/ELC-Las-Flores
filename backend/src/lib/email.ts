import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM ?? "ELC Las Flores <onboarding@resend.dev>";
const TO = "fermar8775@gmail.com";

export async function sendNewTestimonialNotification(nombre: string) {
  if (!resend) return;

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `Nuevo testimonio de ${nombre}`,
    html: `<p>Se ha recibido un nuevo testimonio de <strong>${nombre}</strong>.</p>
<p>Revisalo en el panel de administración: <a href="https://elc-las-flores.netlify.app/testimonios">Admin Testimonios</a></p>`,
  });
}

export async function sendNewCommentNotification(correo: string) {
  if (!resend) return;

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `Nuevo comentario de ${correo}`,
    html: `<p>Se ha recibido un nuevo comentario de <strong>${correo}</strong>.</p>
<p>Revisalo en el panel de administración: <a href="https://elc-las-flores.netlify.app/comentarios">Admin Comentarios</a></p>`,
  });
}
