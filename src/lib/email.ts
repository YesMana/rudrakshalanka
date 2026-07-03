import nodemailer from 'nodemailer';
import { Order } from '@/types/order';
import { getProducts } from '@/lib/products-db';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // true for 465, false for other ports
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
    const productPrice = product ? product.price : 0;
    const deliveryCharge = 350;
    const total = productPrice + deliveryCharge;
    const needsAdvance = productPrice > 2500;
    const advanceAmount = 500;
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
              <td style="padding: 10px; border: 1px solid #ddd;">${productName} (Rs. ${productPrice.toLocaleString()})</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Delivery Charge</td>
              <td style="padding: 10px; border: 1px solid #ddd;">Rs. ${deliveryCharge.toLocaleString()}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Total</td>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Rs. ${total.toLocaleString()}</td>
            </tr>
            ${needsAdvance ? `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #e65100;">Advance Required</td>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #e65100;">Rs. ${advanceAmount.toLocaleString()}</td>
            </tr>
            ` : ''}
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
            <a href="https://rudrakshalanka.com/dashboard" style="background-color: #a00000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Dashboard</a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order notification email sent successfully!');

    // Send email to customer if they opted in
    if (order.wantsEmailUpdate && order.customerEmail) {
      const customerMailOptions = {
        from: process.env.SMTP_EMAIL,
        to: order.customerEmail,
        subject: `Thank you for your order! (#${order.id}) - Rudraksha Lanka`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0b04c; border-radius: 10px; background-color: #faf8f5;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #a00000; margin: 0;">Rudraksha Lanka</h1>
              <p style="color: #666; font-style: italic;">Authentic Healing Beads</p>
            </div>
            
            <h2 style="color: #333;">Hello ${order.name},</h2>
            <p style="font-size: 16px; color: #444; line-height: 1.6;">
              Thank you for shopping with us! We have successfully received your order <strong>#${order.id}</strong>. 
              We are currently processing it and will contact you shortly to confirm delivery details.
            </p>
            
            <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0;">
              <h3 style="color: #a00000; margin-top: 0;">Order Summary</h3>
              <p><strong>Item:</strong> ${productName} (Rs. ${productPrice.toLocaleString()})</p>
              <p><strong>Delivery Charge:</strong> Rs. ${deliveryCharge.toLocaleString()}</p>
              <p style="font-size: 1.1em; margin-top: 10px;"><strong>Total:</strong> Rs. ${total.toLocaleString()}</p>
              ${needsAdvance ? `<p style="color: #e65100; font-weight: bold; margin-top: 10px;">Advance Payment Required: Rs. ${advanceAmount.toLocaleString()}</p>` : ''}
              <p style="margin-top: 15px;"><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Bank Transfer'}</p>
              ${order.paymentMethod === 'bank' || needsAdvance ? '<p style="color: #e65100; font-size: 14px;"><em>* Please remember to send us your transfer receipt via WhatsApp to confirm your order.</em></p>' : ''}
            </div>
            
            <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0;">
              <h3 style="color: #a00000; margin-top: 0;">Delivery Details</h3>
              <p><strong>Name:</strong> ${order.name}</p>
              <p><strong>Address:</strong> ${order.address}, ${order.district}</p>
              <p><strong>Phone:</strong> ${order.phone1} ${order.phone2 ? `/ ${order.phone2}` : ''}</p>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If you have any questions, feel free to reply to this email or contact us via WhatsApp.
            </p>
            <p style="font-size: 14px; color: #666; font-weight: bold;">
              May the blessings of Lord Shiva be with you!<br/>
              - The Rudraksha Lanka Team
            </p>
          </div>
        `,
      };
      await transporter.sendMail(customerMailOptions);
      console.log('Order notification email sent to customer successfully!');
    }
  } catch (error) {
    console.error('Error sending order notification email:', error);
  }
};

export const sendStatusUpdateEmail = async (order: Order) => {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) return;

  try {
    const products = getProducts();
    const product = products.find(p => p.id === order.productId);
    const productName = product ? product.name : order.productId;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0b04c; border-radius: 10px; background-color: #faf8f5;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #a00000; margin: 0;">Rudraksha Lanka</h1>
          <p style="color: #666; font-style: italic;">Order Status Update</p>
        </div>
        
        <h2 style="color: #333;">Hello ${order.name},</h2>
        <p style="font-size: 16px; color: #444; line-height: 1.6;">
          The status of your order <strong>#${order.id}</strong> has been updated to:
        </p>
        
        <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #a00000; color: white; border-radius: 8px; font-size: 20px; font-weight: bold;">
          ${order.status}
        </div>
        
        <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0;">
          <p><strong>Item:</strong> ${productName}</p>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          If you have any questions, feel free to reply to this email or contact us via WhatsApp.
        </p>
        <p style="font-size: 14px; color: #666; font-weight: bold;">
          - The Rudraksha Lanka Team
        </p>
      </div>
    `;

    // 1. Send to Customer
    if (order.customerEmail) {
      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: order.customerEmail,
        subject: `Order Status Updated: ${order.status} (#${order.id}) - Rudraksha Lanka`,
        html: emailHtml,
      });
      console.log('Status update email sent to customer');
    }

    // 2. Send to Admin
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_EMAIL,
      subject: `Admin Alert: Order #${order.id} marked as ${order.status}`,
      html: `
        <h3>Order Status Changed</h3>
        <p>Order ID: ${order.id}</p>
        <p>Customer: ${order.name}</p>
        <p>New Status: <strong>${order.status}</strong></p>
      `,
    });
    console.log('Status update email sent to admin');

  } catch (error) {
    console.error('Error sending status update email:', error);
  }
};
