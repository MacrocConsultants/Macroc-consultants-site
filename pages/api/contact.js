export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body;

      // Basic validation
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
      }

      // Here you can later add logic like sending email using Nodemailer or SendGrid.
      // For now, we’ll just return success.
      return res.status(200).json({
        success: true,
        message: '✅ Message received successfully!',
      });
    } catch (error) {
      console.error('Error in contact API:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.',
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
