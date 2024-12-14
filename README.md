# React Gamestore Front-End

## Projeto

Este repositório contém o front-end da aplicação **React Gamestore**, uma loja de jogos desenvolvida com **React**, **TypeScript**, e **TailwindCSS**.

### Principais Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para criação de interfaces de usuário.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.
- **Vite**: Ferramenta para construção de aplicações modernas, focada em velocidade.
- **TailwindCSS**: Framework CSS utilitário para estilização moderna e responsiva.
- **React Router Dom**: Gerenciamento de rotas no React.
- **Axios**: Biblioteca para requisições HTTP.
- **React Loader Spinner**: Exibição de spinners de carregamento interativos.

## Estrutura de Pastas

A organização do projeto segue boas práticas para modularização e escalabilidade:

```
.
├── public                # Arquivos públicos (ex.: favicon, imagens estáticas)
├── src
│   ├── assets            # Recursos estáticos (ex.: imagens)
│   ├── components        # Componentes reutilizáveis
│   │   ├── footer        # Componente de rodapé
│   │   ├── navbar        # Componente de navegação
│   │   ├── categorias    # Componentes para gerenciamento de categorias
│   ├── models            # Modelos de dados (ex.: Produto, Categoria)
│   ├── pages             # Páginas principais da aplicação
│   ├── services          # Serviços (ex.: integração com API)
│   ├── App.tsx           # Componente raiz da aplicação
│   └── main.tsx          # Entrada principal do React
├── package.json          # Configuração do projeto e dependências
├── tailwind.config.js    # Configuração do TailwindCSS
├── tsconfig.json         # Configuração do TypeScript
└── vite.config.ts        # Configuração do Vite
```

## Scripts Disponíveis

No diretório do projeto, você pode executar:

### `yarn dev`

Inicia o ambiente de desenvolvimento. 
Abra [http://localhost:5173](http://localhost:5173) para ver o projeto no navegador.

### `yarn build`

Cria uma versão de produção da aplicação na pasta `dist`.

### `yarn preview`

Inicia um servidor para visualizar a versão de produção criada com `build`.

### `yarn lint`

Executa o **ESLint** para análise de código e aplicação de padrões de qualidade.

## Funcionalidades Principais

1. **Home**
   - Página inicial com destaques e navegação geral.

2. **Categorias**
   - Listagem de categorias de produtos.
   - Funcionalidades:
     - **Criar**: Adiciona uma nova categoria.
     - **Editar**: Atualiza os dados de uma categoria existente.
     - **Deletar**: Remove categorias.

3. **Footer e Navbar**
   - Rodapé e barra de navegação responsivos e estilizados.

## Dependências

As principais dependências e suas funções:

- `@phosphor-icons/react`: Ícones modernos e customizáveis.
- `axios`: Requisições HTTP para consumir APIs.
- `react-loader-spinner`: Spinners para indicar carregamento de conteúdo.
- `react-router-dom`: Gerenciamento de rotas.
- `tailwindcss`: Estilização responsiva baseada em utilitários.

## Contribuindo

Siga as diretrizes no arquivo [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

1. Faça um fork do projeto.
2. Crie uma branch para a sua feature/bugfix: `git checkout -b minha-branch`.
3. Faça commit das alterações: `git commit -m "Minha feature"`.
4. Envie as alterações: `git push origin minha-branch`.
5. Abra um Pull Request.

## Segurança

Veja [SECURITY.md](./SECURITY.md) para detalhes sobre política de segurança.

## Autor

Desenvolvido como parte do repositório [Growthfolio](https://github.com/growthfolio/react-gamestore-front).

## Licença

Este projeto está licenciado sob os termos da licença MIT. Veja o arquivo [`LICENSE`](./LICENSE) para mais detalhes.
