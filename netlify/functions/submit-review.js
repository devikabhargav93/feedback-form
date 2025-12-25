const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, product, rating, review, subscribe } = data;

    // Basic validation
    if (!name || !email || !product || !review) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Initialize Neon connection
    // DATABASE_URL or NETLIFY_DATABASE_URL should be set in environment variables
    const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
    const sql = neon(connectionString);

    // Insert into DB
    await sql`
      INSERT INTO feedback (name, email, product, rating, review, subscribe)
      VALUES (${name}, ${email}, ${product}, ${rating}, ${review}, ${!!subscribe})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Review submitted successfully' }),
    };
  } catch (error) {
    console.error('FULL DATABASE ERROR:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save review', details: error.message }),
    };
  }
};
