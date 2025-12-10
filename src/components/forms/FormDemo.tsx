import React, { useState } from 'react';

const FormDemo = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    categoria: '',
    descricao: '',
    ativo: false,
    plataforma: 'PC'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="heading-gamer heading-xl mb-8 text-center text-glow-primary">
            Formulários Gaming
          </h1>

          <div className="card-gaming p-8">
            <form className="space-y-6">
              {/* Input Text */}
              <div>
                <label className="label-gaming block mb-2">Nome do Jogo</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="input-gaming w-full"
                  placeholder="Digite o nome do jogo"
                />
              </div>

              {/* Select */}
              <div>
                <label className="label-gaming block mb-2">Categoria</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="select-gaming w-full"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="acao">Ação</option>
                  <option value="aventura">Aventura</option>
                  <option value="rpg">RPG</option>
                  <option value="estrategia">Estratégia</option>
                </select>
              </div>

              {/* Textarea */}
              <div>
                <label className="label-gaming block mb-2">Descrição</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="textarea-gaming w-full"
                  placeholder="Descreva o jogo..."
                  rows={4}
                />
              </div>

              {/* Checkbox */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="ativo"
                    checked={formData.ativo}
                    onChange={handleChange}
                    className="checkbox-gaming"
                  />
                  <span className="body-base text-neutral-300">Jogo ativo</span>
                </label>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  <span className="cta-gaming">Salvar</span>
                </button>
                <button type="button" className="btn-outline flex-1">
                  <span className="cta-gaming">Cancelar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormDemo;