const ContactMessage = require("../models/ContactMessage");
const sendContactNotification = require("../utils/sendContactNotification");

exports.submitContactMessage = async (req, res) => {
  try {
    const { name, email, mobile, serviceRequired, message } = req.body;

    if (!name || !email || !mobile || !serviceRequired || !message) {
      return res.status(400).json({ message: "Please fill all contact form fields." });
    }

    const contactMessage = await ContactMessage.create({
      name: String(name).trim(),
      email: String(email).trim(),
      mobile: String(mobile).trim(),
      serviceRequired: String(serviceRequired).trim(),
      message: String(message).trim(),
    });

    try {
      await sendContactNotification(contactMessage);
    } catch (error) {
      console.error("CONTACT EMAIL SEND FAILED:", error.message);
    }

    res.status(201).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("SUBMIT CONTACT MESSAGE ERROR:", error);
    res.status(500).json({ message: "Could not send your message right now." });
  }
};

exports.getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    res.json(messages);
  } catch (error) {
    console.error("GET CONTACT MESSAGES ERROR:", error);
    res.status(500).json({ message: "Could not fetch contact messages." });
  }
};

exports.updateContactMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["new", "reviewed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.json(updatedMessage);
  } catch (error) {
    console.error("UPDATE CONTACT MESSAGE ERROR:", error);
    res.status(500).json({ message: "Could not update message status." });
  }
};
