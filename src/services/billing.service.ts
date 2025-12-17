import api from './api';

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

export interface PaymentStatus {
  pedidoId: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  valorTotal: number;
}

class BillingService {
  /**
   * Cria uma sessão de checkout no Stripe para um pedido existente
   * @param pedidoId ID do pedido a ser pago
   * @returns URL do checkout Stripe e sessionId
   */
  async createCheckout(pedidoId: number): Promise<CheckoutResponse> {
    const response = await api.post<CheckoutResponse>('/api/billing/checkout', { pedidoId });
    return response.data;
  }

  /**
   * Verifica o status do pagamento de uma sessão
   * @param sessionId ID da sessão Stripe
   * @returns Status atual do pagamento
   */
  async getPaymentStatus(sessionId: string): Promise<PaymentStatus> {
    const response = await api.get<PaymentStatus>(`/api/billing/status/${sessionId}`);
    return response.data;
  }

  /**
   * Redireciona para o checkout Stripe
   * @param checkoutUrl URL do checkout
   */
  redirectToCheckout(checkoutUrl: string): void {
    window.location.href = checkoutUrl;
  }
}

export default new BillingService();
