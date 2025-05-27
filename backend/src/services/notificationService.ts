
import { db } from '../config/database';
import { users, orders, newsletterSubscriptions } from '../models/schema';
import { eq } from 'drizzle-orm';

export interface NotificationTemplate {
  subject: string;
  html: string;
  text: string;
}

export class NotificationService {
  async sendOrderConfirmation(orderId: string) {
    const order = await db.select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (order.length === 0) return;

    const orderData = order[0];
    let userEmail = orderData.guestEmail;

    if (orderData.userId) {
      const user = await db.select()
        .from(users)
        .where(eq(users.id, orderData.userId))
        .limit(1);
      
      if (user.length > 0) {
        userEmail = user[0].email;
      }
    }

    if (!userEmail) return;

    const template = this.getOrderConfirmationTemplate(orderData);
    
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`Sending order confirmation to ${userEmail}:`, template.subject);
    
    return this.sendEmail(userEmail, template);
  }

  async sendShippingNotification(orderId: string, trackingNumber: string) {
    const order = await db.select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (order.length === 0) return;

    const orderData = order[0];
    let userEmail = orderData.guestEmail;

    if (orderData.userId) {
      const user = await db.select()
        .from(users)
        .where(eq(users.id, orderData.userId))
        .limit(1);
      
      if (user.length > 0) {
        userEmail = user[0].email;
      }
    }

    if (!userEmail) return;

    const template = this.getShippingTemplate(orderData, trackingNumber);
    
    console.log(`Sending shipping notification to ${userEmail}:`, template.subject);
    
    return this.sendEmail(userEmail, template);
  }

  async sendAbandonedCartReminder(orderId: string) {
    const order = await db.select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (order.length === 0) return;

    const orderData = order[0];
    let userEmail = orderData.guestEmail;

    if (orderData.userId) {
      const user = await db.select()
        .from(users)
        .where(eq(users.id, orderData.userId))
        .limit(1);
      
      if (user.length > 0) {
        userEmail = user[0].email;
      }
    }

    if (!userEmail) return;

    const template = this.getAbandonedCartTemplate(orderData);
    
    console.log(`Sending abandoned cart reminder to ${userEmail}:`, template.subject);
    
    return this.sendEmail(userEmail, template);
  }

  async sendNewsletterCampaign(subject: string, content: string, segment?: string) {
    let query = db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.isActive, true));
    
    const subscribers = await query;
    
    const template: NotificationTemplate = {
      subject,
      html: this.getNewsletterTemplate(content),
      text: content.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    // Send to all subscribers
    const sendPromises = subscribers.map(subscriber => 
      this.sendEmail(subscriber.email, template)
    );

    await Promise.all(sendPromises);
    
    console.log(`Newsletter sent to ${subscribers.length} subscribers`);
  }

  private async sendEmail(email: string, template: NotificationTemplate) {
    // Simulate email sending - integrate with actual email service
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Email sent to ${email}: ${template.subject}`);
        resolve(true);
      }, 100);
    });
  }

  private getOrderConfirmationTemplate(order: any): NotificationTemplate {
    return {
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
        <p>Total: $${order.totalAmount}</p>
        <p>We'll send you another email when your order ships.</p>
      `,
      text: `Thank you for your order! Your order ${order.orderNumber} has been confirmed. Total: $${order.totalAmount}. We'll send you another email when your order ships.`
    };
  }

  private getShippingTemplate(order: any, trackingNumber: string): NotificationTemplate {
    return {
      subject: `Your order is on the way! - ${order.orderNumber}`,
      html: `
        <h1>Your order has shipped!</h1>
        <p>Your order <strong>${order.orderNumber}</strong> is on its way to you.</p>
        <p>Tracking Number: <strong>${trackingNumber}</strong></p>
        <p>You can track your package using the tracking number above.</p>
      `,
      text: `Your order ${order.orderNumber} has shipped! Tracking Number: ${trackingNumber}. You can track your package using this tracking number.`
    };
  }

  private getAbandonedCartTemplate(order: any): NotificationTemplate {
    return {
      subject: "Don't forget your items!",
      html: `
        <h1>You left something behind!</h1>
        <p>You have items waiting in your cart worth $${order.subtotal}.</p>
        <p>Complete your purchase now and get free shipping on orders over $100!</p>
        <a href="${process.env.FRONTEND_URL}/cart" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Complete Your Order</a>
      `,
      text: `You left something behind! You have items waiting in your cart worth $${order.subtotal}. Complete your purchase now and get free shipping on orders over $100!`
    };
  }

  private getNewsletterTemplate(content: string): string {
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <header style="background: #000; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Luxuria</h1>
        </header>
        <main style="padding: 20px;">
          ${content}
        </main>
        <footer style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© 2024 Luxuria. All rights reserved.</p>
          <p><a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a></p>
        </footer>
      </div>
    `;
  }
}

export const notificationService = new NotificationService();
