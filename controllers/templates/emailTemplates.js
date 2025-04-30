exports.generateUserOrderEmail = (userEmail, amount, transactionId, paymentMethod, products) => {
    const productRows = products.map((item) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${(item.priceAtPurchase || 0).toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${((item.priceAtPurchase || 0) * item.quantity).toFixed(2)}</td>
      </tr>
    `).join("");
  
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #4CAF50;">🧾 Order Confirmation - Kitchen Planner</h2>
        <p>Hi ${userEmail},</p>
        <p>Thank you for your order! Your payment of <strong>$${amount.toFixed(2)}</strong> was successful.</p>
  
        <h3>Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>
  
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>
        <p><strong>Status:</strong> ✅ Payment Successful</p>
  
        <p>If you have any questions, feel free to contact us at support@kitchenplanner.com.</p>
        <p style="font-size: 12px; color: #888;">This is an automated confirmation email for your records.</p>
      </div>
    `;
  };
  
  exports.generateAdminOrderEmail = (userEmail, amount, transactionId, paymentMethod, products) => {
    const productRows = products.map((item) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${(item.priceAtPurchase || 0).toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${((item.priceAtPurchase || 0) * item.quantity).toFixed(2)}</td>
      </tr>
    `).join("");
  
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #FF5722;">📦 New Order Received</h2>
        <p><strong>User Email:</strong> ${userEmail}</p>
        <p><strong>Amount Paid:</strong> $${amount.toFixed(2)}</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>
        <p><strong>Status:</strong> ✅ Payment Confirmed</p>
  
        <h3>Product Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>
  
        <p style="font-size: 12px; color: #888;">This order was auto-generated after payment confirmation.</p>
      </div>
    `;
  };
  