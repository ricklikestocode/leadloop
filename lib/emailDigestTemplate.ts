export function getEmailDigestHTML({
  name,
  streak,
  timeSaved,
  conversion,
  hotLeads,
  aiReplies,
  followUps,
  wins,
  date,
}: {
  name: string
  streak: number
  timeSaved: number
  conversion: number
  hotLeads: number
  aiReplies: number
  followUps: number
  wins: number
  date: string
}) {
  return `
  <div style="font-family: 'Inter', Arial, sans-serif; background: #18181b; color: #fff; padding: 32px; border-radius: 16px; max-width: 480px; margin: auto;">
    <h2 style="font-size: 1.5rem; margin-bottom: 8px;">Good morning, ${name} ☀️</h2>
    <p style="color: #a1a1aa; margin-bottom: 24px;">Here's your daily performance summary for <b>${date}</b>.</p>
    <div style="background: linear-gradient(90deg,#f472b6,#818cf8); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 8px 0; font-size: 1.1rem;">🔥 Streak: <b>${streak} days</b></h3>
      <p style="margin: 0;">⏱️ <b>${timeSaved} hours</b> saved this week</p>
      <p style="margin: 0;">🏆 <b>${wins}</b> wins celebrated</p>
    </div>
    <table style="width: 100%; margin-bottom: 24px;">
      <tr>
        <td>📈 <b>Conversion</b></td>
        <td align="right">${conversion}%</td>
      </tr>
      <tr>
        <td>🔥 <b>Hot Leads</b></td>
        <td align="right">${hotLeads}</td>
      </tr>
      <tr>
        <td>🤖 <b>AI Replies</b></td>
        <td align="right">${aiReplies}</td>
      </tr>
      <tr>
        <td>⏳ <b>Follow-ups Due</b></td>
        <td align="right">${followUps}</td>
      </tr>
    </table>
    <div style="background: #27272a; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
      <p style="margin: 0; color: #a1a1aa; font-size: 0.95rem;">Keep your streak alive! Respond to hot leads and celebrate your wins to maximize results.</p>
    </div>
    <p style="color: #818cf8; font-size: 0.95rem; margin-bottom: 0;">Your AI is learning from every conversation. 🚀</p>
    <p style="color: #a1a1aa; font-size: 0.85rem; margin-top: 24px;">You are receiving this email because you are a B2B SaaS platform user. <a href="#" style="color: #f472b6; text-decoration: underline;">Unsubscribe</a></p>
  </div>
  `
}
