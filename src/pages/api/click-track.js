import { neon } from "@neondatabase/serverless"

export default async function handler(req, res) {

    if (req.method === 'POST') {

      //console.log('process.env.PERSIST_CLICK_TRACK', process.env.PERSIST_CLICK_TRACK)
      if (new Boolean(process.env.PERSIST_CLICK_TRACK).valueOf) {
        try {
            //console.log(req.body);
            //console.log('process.env.NETLIFY_DATABASE_URL', process.env.NETLIFY_DATABASE_URL)
            const p = req.body;
            const sql = neon(process.env.NETLIFY_DATABASE_URL);

            // persist the click track data to analytics database
			const data =
				await sql`INSERT INTO smylsync_clicktrack (user_id, click_timestamp, relative_timestamp, tag_name, element_id, to_url, from_url, user_agent, viewport_width, viewport_height, do_not_track) VALUES(${p.userId}, ${p.clickTimestamp}, ${p.relativeTimestamp}, ${p.tag}, ${p.elementId}, ${p.toUrl}, ${p.fromUrl}, ${p.userAgent}, ${p.viewport.width}, ${p.viewport.height}, ${p.doNotTrack}) RETURNING *`;
        
            //console.log(data);
            res.status(200).json({ message: 'Click track data sent successfully!'});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to send click track data.' });
        }
      }
    } else {
        // If the request method is not POST, respond with a 405 (Method Not Allowed)
        res.status(405).json({ message: 'Method Not Allowed' });
    }
    
}