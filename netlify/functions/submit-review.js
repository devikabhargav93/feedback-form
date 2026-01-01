const { neon } = require('@neondatabase/serverless');
const { Resend } = require('resend');

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
    const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
    const sql = neon(connectionString);

    // Insert into DB
    await sql`
      INSERT INTO feedback (name, email, product, rating, review, subscribe)
      VALUES (${name}, ${email}, ${product}, ${rating}, ${review}, ${!!subscribe})
    `;

    // Send confirmation email
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
      await resend.emails.send({
        from: 'EverPure Organics <onboarding@resend.dev>',
        to: email,
        subject: 'Thank you for your review!',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #2d5a27;">Thank you for your feedback, ${name}!</h2>
            <p>We've received your review for <strong>${product}</strong>.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Rating:</strong> ${rating} / 5</p>
              <p><strong>Review:</strong> ${review}</p>
            </div>
            <p>Your insights help us grow and improve our organic offerings.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">This is an automated message from EverPure Organics.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // We don't fail the whole request if email fails, but we log it
    }

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
