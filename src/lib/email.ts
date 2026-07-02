import nodemailer from 'nodemailer';
import { Order } from '@/types/order';
import { getProducts } from '@/lib/products-db';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendOrderEmail = async (order: Order) => {
  // If email is not configured, silently skip sending
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.log('Email not configured. Skipping notification.');
    return;
  }

  try {
    const products = getProducts();
    const product = products.find(p => p.id === order.productId);
    const productName = product ? product.name : order.productId;
    const productPrice = product ? product.price.toLocaleString() : 'N/A';

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_EMAIL, // Send to the admin's own email
      subject: `🎉 New Order Received! (${order.id})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #a00000; text-align: center;">New Order Received!</h2>
          <p style="text-align: center; font-size: 16px;">You have received a new order on Rudraksha Lanka.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Order ID</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${order.id}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Customer Name</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${order.name}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Product</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${productName} (Rs. ${productPrice})</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${order.phone1} ${order.phone2 ? `/ ${order.phone2}` : ''}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Address</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${order.address}, ${order.district}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Payment Method</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</td>
            </tr>
          </table>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:3000/dashboard" style="background-color: #a00000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Dashboard</a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order notification email sent successfully!');
  } catch (error) {
    console.error('Error sending order notification email:', error);
  }
};
