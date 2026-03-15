import crypto from 'crypto';

const API_KEY = 'ZPWQACE-J8KMGVZ-P4BT565-BENNE9G';
const API_URL = 'https://api.nowpayments.io/v1';

export interface CreatePaymentRequest {
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  ipn_callback_url: string;
  order_id: string;
  order_description: string;
}

export const nowPaymentsService = {
  /**
   * Check API status
   */
  async getStatus() {
    const res = await fetch(`${API_URL}/status`, {
      headers: { 'x-api-key': API_KEY }
    });
    return res.json();
  },

  /**
   * Create a payment
   */
  async createPayment(data: CreatePaymentRequest) {
    const res = await fetch(`${API_URL}/payment`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string) {
    const res = await fetch(`${API_URL}/payment/${paymentId}`, {
      headers: { 'x-api-key': API_KEY }
    });
    return res.json();
  },

  /**
   * Verify IPN signature
   * Note: You need the IPN secret from NOWPayments dashboard
   */
  verifySignature(payload: any, signature: string, ipnSecret: string) {
    if (!signature || !ipnSecret) return false;
    
    const sortedPayload = Object.keys(payload)
      .sort()
      .reduce((obj: any, key) => {
        obj[key] = payload[key];
        return obj;
      }, {});

    const hmac = crypto.createHmac('sha512', ipnSecret);
    const calculatedSignature = hmac.update(JSON.stringify(sortedPayload)).digest('hex');
    
    return calculatedSignature === signature;
  }
};
