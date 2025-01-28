export default function handler(req, res) {
    if (req.method === 'POST') {
        const callLog = req.body;
        // Here, you would normally save the call log data to a database
        console.log('Call log saved:', callLog);
        res.status(200).json({ success: true, message: 'Call log saved' });
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
