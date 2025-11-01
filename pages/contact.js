export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, email, message } = req.body;
      // send email logic or database logic
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Error submitting form" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
