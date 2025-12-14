import React, { useState } from 'react';
import { 
    X, 
    CurrencyDollar, 
    Cube, 
    Tag, 
    Power,
    FloppyDisk,
    GameController
} from '@phosphor-icons/react';
import { Produto } from '../../services/produto.service';
import { FormInput, FormSwitch, FormButton, FormLabel } from '../forms';

interface ProdutoComercialModalProps {
    produto: Produto;
    onClose: () => void;
    onSave: (dados: {
        preco: number;
        estoque: number;
        desconto: number;
        ativo: boolean;
    }) => void;
    loading?: boolean;
}

export function ProdutoComercialModal({ produto, onClose, onSave, loading }: ProdutoComercialModalProps) {
    const [preco, setPreco] = useState<string>(produto.preco?.toString() || '59.99');
    const [estoque, setEstoque] = useState<number>(produto.estoque || 0);
    const [desconto, setDesconto] = useState<number>(produto.desconto || 0);
    const [ativo, setAtivo] = useState<boolean>(produto.ativo || false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const precoNumerico = parseFloat(preco.replace(',', '.'));
        if (isNaN(precoNumerico) || precoNumerico <= 0) {
            alert('Por favor, insira um preço válido maior que zero.');
            return;
        }

        onSave({
            preco: precoNumerico,
            estoque,
            desconto,
            ativo
        });
    };

    const calcularPrecoFinal = (): string => {
        const precoNumerico = parseFloat(preco.replace(',', '.'));
        if (isNaN(precoNumerico)) return 'R$ 0,00';
        
        const precoFinal = precoNumerico * (1 - desconto / 100);
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(precoFinal);
    };

    return (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card-gaming w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-gaming p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-20 rounded-gaming overflow-hidden shadow-glow-sm bg-neutral-800">
                                {produto.imagens && produto.imagens.length > 0 ? (
                                    <img 
                                        src={produto.imagens[0]} 
                                        alt={produto.nome}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <GameController size={24} className="text-neutral-600" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-0 font-accent">
                                    Dados Comerciais
                                </h2>
                                <p className="text-primary-100 font-gaming text-lg">
                                    {produto.nome}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-gaming transition-all text-neutral-0"
                        >
                            <X size={24} weight="bold" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Preço */}
                    <FormInput
                        label="Preço (R$)"
                        labelIcon={<CurrencyDollar className="text-accent-400" size={18} />}
                        value={preco}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreco(e.target.value)}
                        placeholder="59.99"
                        required
                    />

                    {/* Estoque */}
                    <FormInput
                        type="number"
                        label="Estoque (unidades)"
                        labelIcon={<Cube className="text-primary-400" size={18} />}
                        value={estoque.toString()}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEstoque(Math.max(0, parseInt(e.target.value) || 0))}
                        min={0}
                        required
                    />

                    {/* Desconto - Slider customizado */}
                    <div>
                        <FormLabel icon={<Tag className="text-warning-500" size={18} />}>
                            Desconto (%)
                        </FormLabel>
                        <input
                            type="range"
                            value={desconto}
                            onChange={(e) => setDesconto(parseInt(e.target.value))}
                            min="0"
                            max="90"
                            className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer
                                       [&::-webkit-slider-thumb]:appearance-none
                                       [&::-webkit-slider-thumb]:w-5
                                       [&::-webkit-slider-thumb]:h-5
                                       [&::-webkit-slider-thumb]:rounded-full
                                       [&::-webkit-slider-thumb]:bg-warning-500
                                       [&::-webkit-slider-thumb]:shadow-glow-sm
                                       [&::-webkit-slider-thumb]:cursor-pointer
                                       [&::-moz-range-thumb]:w-5
                                       [&::-moz-range-thumb]:h-5
                                       [&::-moz-range-thumb]:rounded-full
                                       [&::-moz-range-thumb]:bg-warning-500
                                       [&::-moz-range-thumb]:border-0
                                       [&::-moz-range-thumb]:cursor-pointer"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-neutral-500 body-sm">0%</span>
                            <span className="text-warning-500 font-bold font-gaming">{desconto}%</span>
                            <span className="text-neutral-500 body-sm">90%</span>
                        </div>
                        {desconto > 0 && (
                            <p className="text-center mt-3 text-accent-400 font-gaming">
                                Preço final: <span className="font-bold text-lg price-gaming">{calcularPrecoFinal()}</span>
                            </p>
                        )}
                    </div>

                    {/* Ativo */}
                    <div className="p-4 bg-neutral-900 rounded-gaming border border-neutral-800">
                        <FormSwitch
                            checked={ativo}
                            onChange={setAtivo}
                            label={`Produto ${ativo ? 'Ativo' : 'Inativo'}`}
                            description={ativo 
                                ? 'Visível para clientes e disponível para compra' 
                                : 'Oculto na loja e indisponível para compra'
                            }
                            icon={<Power size={24} />}
                            activeColor="success"
                            size="md"
                        />
                    </div>

                    {/* Aviso para produtos inativos */}
                    {!ativo && estoque > 0 && parseFloat(preco.replace(',', '.')) > 0 && (
                        <div className="p-4 bg-warning-500/10 border border-warning-500/30 rounded-gaming">
                            <p className="text-warning-500 text-sm font-gaming">
                                ⚠️ Este produto tem preço e estoque definidos mas está <strong>INATIVO</strong>. 
                                Ative-o para que os clientes possam comprá-lo.
                            </p>
                        </div>
                    )}

                    {/* Botões */}
                    <div className="flex gap-4 pt-4">
                        <FormButton
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            variant="ghost"
                            fullWidth
                        >
                            Cancelar
                        </FormButton>
                        <FormButton
                            type="submit"
                            loading={loading}
                            loadingText="Salvando..."
                            icon={<FloppyDisk weight="bold" size={20} />}
                            variant="primary"
                            fullWidth
                        >
                            SALVAR
                        </FormButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
