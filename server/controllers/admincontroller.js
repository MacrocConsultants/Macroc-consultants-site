exports.assignClient = async (req, res) => {
  const { clientId, partnerId } = req.body;

  try {
    const client = await Client.findById(clientId);
    const partner = await User.findById(partnerId);

    if (!client || !partner) {
      return res.status(404).json({ message: "Not found" });
    }

    // assign partner to client
    client.assignedPartner = partnerId;
    await client.save();

    // add client to partner
    partner.assignedClients.push(clientId);
    await partner.save();

    res.json({ message: "Client assigned successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error assigning client" });
  }
};