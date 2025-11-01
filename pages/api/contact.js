export default function handler(req, res) {
  if (req.method === 'POST') {
    res.status(200).json({ success: true, message: 'Form submitted successfully!' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

