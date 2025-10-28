export async function sendEmail({ to, subject, text }){
  // Stub for demo purposes. Integrate with Gov SMTP or a provider later.
  console.log(`[EMAIL] to=${to} subject=${subject} text=${text}`)
}
