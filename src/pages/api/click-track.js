export default async function handler(req, res) {

    if (req.method === 'POST') {
        try {
            console.log(req.body);
            res.status(200).json({ message: 'Click track data sent successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to send click track data.' });
        }
    } else {
        // If the request method is not POST, respond with a 405 (Method Not Allowed)
        res.status(405).json({ message: 'Method Not Allowed' });
    }
    
}