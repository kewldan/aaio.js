import {sendApiRequest, sendMerchantRequest} from "./utils";
import {Currency, Language} from "./types";
import {createPaymentSign} from "./security";
import {GetPayUrlResponse, PaymentInfoResponse, PaymentMethodsResponse} from "./responses";


export class Merchant {
    /**
     * Create an instance for merchant
     * @param id Merchant ID
     * @param secret Merchant secret key NO. 2
     * @param apiKey API-Key for some methods.
     */
    constructor(
      private readonly id: string,
      private readonly secret: string,
      private readonly apiKey: string
    ) {}

    /**
     * Creates a payment URL for customer by request
     * @param amount Payment amount
     * @param order_id Order ID in your system
     * @param currency Payment currency
     * @param options Additional options to payment
     * @return Payment URL for a customer.
     */
    public async createPaymentByRequest(amount: number, order_id: string, currency: Currency, options?: {
        method?: string,
        desc?: string,
        email?: string,
        lang?: Language,
        referral?: string,
        us_key?: string
    }): Promise<string> {
      const sign = createPaymentSign(this.id, amount, currency, this.secret, order_id);

      const paymentData: Record<string, any> = {
          merchant_id: this.id,
          amount: String(amount),
          order_id,
          sign,
          currency,
          ...options
      }

      for (const key in paymentData) {
          if (paymentData[key] === undefined) {
              delete paymentData[key];
          }
      }

      const response = await sendMerchantRequest<GetPayUrlResponse>('/get_pay_url', { data: paymentData })

      return response.url
    }

    /**
     * Creates a payment URL for customer
     * @deprecated Use createPaymentByRequest method instead
     * @param amount Payment amount
     * @param order_id Order ID in your system
     * @param currency Payment currency
     * @param options Additional options to payment
     * @return Payment URL for a customer.
     */
    public createPayment(amount: number, order_id: string, currency: Currency, options?: {
        method?: string,
        desc?: string,
        email?: string,
        lang?: Language,
        referral?: string,
        us_key?: string
    }): string {
        const sign = createPaymentSign(this.id, amount, currency, this.secret, order_id);

        const paymentData: Record<string, any> = {
            merchant_id: this.id,
            amount: String(amount),
            order_id,
            sign,
            currency,
            ...options
        }

        for (const key in paymentData) {
            if (paymentData[key] === undefined) {
                delete paymentData[key];
            }
        }

        return 'https://aaio.so/merchant/pay?' + new URLSearchParams(paymentData);
    }

    /**
     * Fetch payment info
     * @param orderId Your Order ID
     */
    public async getPaymentInfo(orderId: string): Promise<PaymentInfoResponse> {
        return await sendApiRequest('/info-pay', {
          data: {
            order_id: orderId,
            merchant_id: this.id,
          },
          apiKey: this.apiKey
        })
    }

    /**
     * Fetch available payment methods (Enabled for merchant)
     */
    public async getPaymentMethods(): Promise<PaymentMethodsResponse> {
        return await sendApiRequest('/methods-pay', {
          data: {
            merchant_id: this.id
          },
          apiKey: this.apiKey
        });
    }
}
