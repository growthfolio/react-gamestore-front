import api from './api';
import { Pedido } from '../models/pedidos/Pedido';

class PedidoService {
  async criar(): Promise<Pedido> {
    const response = await api.post<Pedido>('/pedidos');
    return response.data;
  }

  async listarMeusPedidos(): Promise<Pedido[]> {
    const response = await api.get<Pedido[]>('/pedidos');
    return response.data;
  }

  async obterPorId(id: number): Promise<Pedido> {
    const response = await api.get<Pedido>(`/pedidos/${id}`);
    return response.data;
  }
}

export default new PedidoService();
