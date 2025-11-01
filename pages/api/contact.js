export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
      }

      console.log("✅ Form submitted:", { name, email, message });

      // Example response
      return res.status(200).json({ success: true, message: "Form submitted successfully!" });
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      return res.status(500).json({ error: "Error submitting form." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
