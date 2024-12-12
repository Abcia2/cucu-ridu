export default function handler(req, res) {
    if (req.method === 'POST') {
        const { adminName } = req.body;

        if (!adminName) {
            return res.status(400).json({ error: 'Admin name is required.' });
        }

        // Genera un ID unico per la stanza
        const roomId = Math.random().toString(36).substr(2, 8);

        // Simula la creazione della stanza
        const room = { id: roomId, admin: adminName };

        // Rispondi
        return res.status(201).json({ message: 'Room created!', room });
    } else {
        return res.status(405).json({ error: 'Method not allowed.' });
    }
}
