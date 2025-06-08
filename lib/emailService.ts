interface EmailData {
    to: string
    subject: string
    prospect: {
      name: string
      email: string
      company: string
      phone?: string
    }
  }
  
  export async function sendNewProspectNotification(emailData: EmailData) {
    try {
      // Using your existing setup - you can integrate with SendGrid, Resend, or Nodemailer
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })
  
      return response.ok
    } catch (error) {
      console.error('Error sending email notification:', error)
      return false
    }
  }
  
  export async function sendProspectStatusUpdate(prospectId: string, status: string, prospectData: any) {
    try {
      const emailData = {
        to: 'team@staxx.com', // Your team email
        subject: `Prospect Status Update: ${prospectData.company}`,
        prospect: prospectData,
        status,
        prospectId
      }
  
      const response = await fetch('/api/send-status-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })
  
      return response.ok
    } catch (error) {
      console.error('Error sending status update:', error)
      return false
    }
  }