const { neon } = require('@neondatabase/serverless');
const nodemailer = require('nodemailer');

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

    // Send confirmation email (optional, depends on EMAIL_USER and EMAIL_PASS)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const getRatingStars = (rating) => {
          const filledStar = '★';
          const emptyStar = '☆';
          return filledStar.repeat(parseInt(rating)) + emptyStar.repeat(5 - parseInt(rating));
        };

        const mailOptions = {
          from: `EverPure Organics <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `✨ We've received your review for ${product}!`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f5f7f6 0%, #e8f3f1 100%);">
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 640px; margin: 0 auto; background: white;">
                <!-- Header Banner -->
                <div style="background: linear-gradient(135deg, #2d9a6f 0%, #1e6b52 100%); padding: 40px 20px; text-align: center; color: white;">
                  <div style="font-size: 48px; margin-bottom: 15px;">✓</div>
                  <h1 style="margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">Thank You, ${name}!</h1>
                  <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Your feedback has been received</p>
                </div>

                <!-- Main Content -->
                <div style="padding: 40px 30px;">
                  <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 25px 0;">
                    We truly appreciate you taking the time to review <strong style="color: #2d9a6f;">${product}</strong>. Your insights help us craft better, more authentic natural products.
                  </p>

                  <!-- Review Card -->
                  <div style="background: linear-gradient(135deg, #f9fdfb 0%, #eef9f6 100%); border-left: 4px solid #2d9a6f; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
                    <div style="margin-bottom: 18px;">
                      <div style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 8px;">Your Rating</div>
                      <div style="font-size: 32px; color: #2d9a6f; letter-spacing: 4px;">
                        ${getRatingStars(rating)}
                      </div>
                      <div style="font-size: 18px; font-weight: 600; color: #333; margin-top: 8px;">${rating}/5 Stars</div>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #d4e8e2; margin: 20px 0;">
                    <div>
                      <div style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 10px;">Your Review</div>
                      <p style="font-size: 15px; color: #444; line-height: 1.7; margin: 0; font-style: italic;">"${review}"</p>
                    </div>
                  </div>

                  <!-- Benefits -->
                  <div style="background: #f0f9f7; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 20px 0; color: #2d5a27; font-size: 18px;">What Happens Next?</h3>
                    <ul style="margin: 0; padding: 0; list-style: none;">
                      <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                        <span style="color: #2d9a6f; font-weight: bold; margin-right: 12px; margin-top: 2px;">→</span>
                        <span style="color: #555; font-size: 14px; line-height: 1.5;">Your review helps other customers discover great products</span>
                      </li>
                      <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                        <span style="color: #2d9a6f; font-weight: bold; margin-right: 12px; margin-top: 2px;">→</span>
                        <span style="color: #555; font-size: 14px; line-height: 1.5;">We read every review to continuously improve our formulations</span>
                      </li>
                      <li style="display: flex; align-items: flex-start;">
                        <span style="color: #2d9a6f; font-weight: bold; margin-right: 12px; margin-top: 2px;">→</span>
                        <span style="color: #555; font-size: 14px; line-height: 1.5;">Special offers and new products are coming your way soon</span>
                      </li>
                    </ul>
                  </div>

                <!-- Footer -->
                <div style="background: #f9fdfb; padding: 30px; text-align: center; border-top: 1px solid #e0e8e5;">
                  <p style="color: #888; font-size: 14px; margin: 0 0 12px 0;">
                    <strong style="color: #2d5a27;">EverPure Organics</strong><br>
                    Crafting nature's finest for your well-being
                  </p>
                  <p style="color: #aaa; font-size: 12px; margin: 15px 0 0 0; line-height: 1.6;">
                    This is an automated message from EverPure Organics. Please don't reply to this email.<br>
                    Have questions? Contact us at support@everpureorganics.com
                  </p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
      } catch (err) {
        console.error('Email sending error:', err);
      }
    } else {
      console.warn('EMAIL_USER or EMAIL_PASS is missing. Skipping confirmation email.');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Review submitted successfully' }),
    };
  } catch (error) {
    console.error('SERVER ERROR:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};
