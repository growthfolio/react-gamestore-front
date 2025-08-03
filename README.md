# 🎮 React GameStore Frontend - Loja de Jogos

## 🎯 Objetivo de Aprendizado
Frontend desenvolvido para estudar **e-commerce em React** e **TypeScript**. Implementa interface completa de loja de jogos com **gerenciamento de estado**, **roteamento avançado** e **integração com API**, aplicando padrões modernos de desenvolvimento frontend.

## 🛠️ Tecnologias Utilizadas
- **Framework:** React 18, TypeScript
- **Build Tool:** Vite
- **Estilização:** TailwindCSS
- **Roteamento:** React Router DOM
- **HTTP Client:** Axios
- **Ícones:** Phosphor Icons
- **Loading:** React Loader Spinner
- **Linting:** ESLint

## 🚀 Demonstração
```tsx
// Interface de Produto
interface Game {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  plataforma: string;
  categoria: Category;
  disponivel: boolean;
}

// Componente GameCard
const GameCard: React.FC<{ game: Game }> = ({ game }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {game.nome}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {game.descricao}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            R$ {game.preco.toFixed(2)}
          </span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};
```

## 📁 Estrutura do Projeto
```
react-gamestore-front/
├── src/
│   ├── components/               # Componentes reutilizáveis
│   │   ├── navbar/              # Barra de navegação
│   │   ├── footer/              # Rodapé
│   │   └── categorias/          # Componentes de categoria
│   ├── models/                  # Interfaces TypeScript
│   │   ├── Game.ts              # Interface do jogo
│   │   ├── Category.ts          # Interface da categoria
│   │   └── User.ts              # Interface do usuário
│   ├── pages/                   # Páginas da aplicação
│   │   ├── Home/                # Página inicial
│   │   ├── Games/               # Listagem de jogos
│   │   ├── Categories/          # Gerenciamento de categorias
│   │   └── Profile/             # Perfil do usuário
│   ├── services/                # Serviços de API
│   │   └── api.ts               # Configuração do Axios
│   ├── assets/                  # Recursos estáticos
│   ├── App.tsx                  # Componente raiz
│   └── main.tsx                 # Entry point
├── public/                      # Arquivos públicos
├── tailwind.config.js           # Configuração Tailwind
├── tsconfig.json                # Configuração TypeScript
└── vite.config.ts               # Configuração Vite
```

## 💡 Principais Aprendizados

### 📝 TypeScript Integration
- **Type safety:** Tipagem estática para maior segurança
- **Interfaces:** Definição de contratos de dados
- **Generic types:** Tipos genéricos para reutilização
- **Type inference:** Inferência automática de tipos
- **Error prevention:** Prevenção de erros em tempo de compilação

### 🛍️ E-commerce Features
- **Product catalog:** Catálogo de produtos organizado
- **Category management:** Gerenciamento de categorias
- **Search functionality:** Busca e filtros
- **Shopping cart:** Carrinho de compras (planejado)
- **User authentication:** Autenticação de usuários

### ⚡ Performance Optimization
- **Vite bundling:** Build otimizado com Vite
- **Code splitting:** Divisão de código por rotas
- **Lazy loading:** Carregamento sob demanda
- **Image optimization:** Otimização de imagens
- **Bundle analysis:** Análise de tamanho do bundle

## 🧠 Conceitos Técnicos Estudados

### 1. **TypeScript Models**
```tsx
// models/Game.ts
export interface Game {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  plataforma: string;
  categoria: Category;
  disponivel: boolean;
  dataLancamento?: Date;
  imagem?: string;
}

// models/Category.ts
export interface Category {
  id: number;
  nome: string;
  descricao?: string;
  games?: Game[];
}

// models/ApiResponse.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}
```

### 2. **Custom Hooks com TypeScript**
```tsx
// hooks/useGames.ts
import { useState, useEffect } from 'react';
import { Game } from '../models/Game';
import { api } from '../services/api';

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<Game[]>('/api/games');
      setGames(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar jogos');
      console.error('Fetch games error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return { games, loading, error, refetch: fetchGames };
};
```

### 3. **API Service Layer**
```tsx
// services/api.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url);
  }

  public async post<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data);
  }
}

export const api = new ApiService();
```

## 🚧 Desafios Enfrentados
1. **TypeScript learning curve:** Adaptação à tipagem estática
2. **State management:** Gerenciamento de estado complexo
3. **API integration:** Sincronização com backend Spring
4. **Responsive design:** Adaptação para múltiplos dispositivos
5. **Performance optimization:** Otimização de carregamento

## 📚 Recursos Utilizados
- [React TypeScript Documentation](https://react-typescript-cheatsheet.netlify.app/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Phosphor Icons](https://phosphoricons.com/)
- [Generation Brasil Bootcamp](https://brazil.generation.org/) - Bootcamp onde o projeto foi desenvolvido

## 📈 Próximos Passos
- [ ] Implementar carrinho de compras completo
- [ ] Adicionar sistema de pagamento
- [ ] Criar sistema de avaliações
- [ ] Implementar wishlist
- [ ] Adicionar sistema de recomendações
- [ ] Criar dashboard de usuário

## 🔗 Projetos Relacionados
- [Spring GameStore](../spring-gamestore/) - Backend da aplicação
- [React E-commerce TT](../react-ecommerce-tt/) - E-commerce similar
- [React Pharmacy Front](../react-pharmacy-front/) - Frontend farmácia

---

**Desenvolvido por:** Felipe Macedo  
**Contato:** contato.dev.macedo@gmail.com  
**GitHub:** [FelipeMacedo](https://github.com/felipemacedo1)  
**LinkedIn:** [felipemacedo1](https://linkedin.com/in/felipemacedo1)

> 💡 **Reflexão:** Este projeto foi fundamental para dominar TypeScript em React e padrões de e-commerce. A experiência com Vite e TailwindCSS proporcionou conhecimento em ferramentas modernas de desenvolvimento frontend.