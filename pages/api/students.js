// pages/api/students.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { first_name, last_name, mail_id, phone, address } = req.body;

            // For now, just log the incoming data. 
            // In a real application, save this data to a database here.
            console.log('Received data:', { first_name, last_name, mail_id, phone, address });

            // Simulate a successful response
            return res.status(200).json({ message: 'Yuvak added successfully' });
        } catch (error) {
            console.error('Error saving yuvak:', error);
            return res.status(500).json({ error: 'Failed to add yuvak' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

