import {Merchant} from "./merchant";
import {sendApiRequest} from "./utils";
import {
    BalanceResponse,
    CreatePayoffResponse,
    IpsResponse,
    PayoffInfoResponse,
    PayoffMethodsResponse,
    PayoffRatesResponse
} from "./responses";

/**
 * Fetch aaio IPS
 */
export async function getIps(): Promise<IpsResponse> {
    const request = await fetch('https://aaio.so/api/public/ips');
    return await request.json();
}

export class Client {
    private readonly apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Creates merchant with Client API key
     * @param merchantId Merchant ID from AAIO
     * @param secretKey 1st secret key from AAIO.
     */
    createMerchant(merchantId: string, secretKey: string) {
        return new Merchant(merchantId, secretKey, this.apiKey);
    }

    /**
     * Fetch user balance
     */
    async getBalance(): Promise<BalanceResponse> {
        return await sendApiRequest('/balance', { apiKey: this.apiKey });
    }

    /**
     * Request for a user payoff
     * @param method Payoff method
     * @param amount Payoff amount
     * @param wallet Payoff wallet
     * @param commissionType Commission type (0 – from an amount (default), 1 – from balance)
     * @param payoff_id Your Payoff ID.
     */
    async createPayoff(method: string, amount: number, wallet: string, commissionType: 0 | 1, payoff_id: string): Promise<CreatePayoffResponse> {
        return await sendApiRequest('/create-payoff', {
          data: {
            my_id: payoff_id,
            method,
            amount,
            wallet,
            commission_type: commissionType,
          },
          apiKey: this.apiKey
        });
    }

    /**
     * Fetch payoff rates
     */
    async getPayoffRates(): Promise<PayoffRatesResponse> {
        return await sendApiRequest('/rates-payoff', { apiKey: this.apiKey });
    }

    /**
     * Fetch payoff info
     * @param payoffId Your Payoff ID
     */
    async getPayoffInfo(payoffId: string): Promise<PayoffInfoResponse> {
        return await sendApiRequest('/info-payoff', {
          data: {
            my_id: payoffId
          },
          apiKey: this.apiKey
        });
    }

    /**
     * Fetch payoff methods
     */
    async getPayoffMethods(): Promise<PayoffMethodsResponse> {
        return await sendApiRequest('/methods-payoff', { apiKey: this.apiKey });
    }
}
