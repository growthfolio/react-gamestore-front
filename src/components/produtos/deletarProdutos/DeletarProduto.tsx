import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import Produto from '../../../models/produtos/Produto'
import { buscar, deletar } from '../../../services/Services'
import { RotatingLines } from 'react-loader-spinner'

function DeletarProduto() {

    const [produto, setProduto] = useState<Produto>({} as Produto)

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate()

    const { id } = useParams<{ id: string }>()

    async function buscarPorId(id: string) {
        try {
            await buscar(`/produtos/${id}`, setProduto)
        } catch (error: any) {

            alert('Erro ao buscar Produto')
        }
    }

    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id)
        }
    }, [id])

    function retornar() {
        navigate("/produtos")
    }

    async function deletarProduto() {

        setIsLoading(true)

        try {
            await deletar(`/produtos/${id}`)

            alert('Produto apagado com sucesso')

        } catch (error) {
            alert('Erro ao apagar o Produto')
        }

        setIsLoading(false)
        retornar()
    }

    return (
        <div className='container w-1/3 mx-auto'>
            <h1 className='text-4xl text-center my-4'>Deletar Produto</h1>

            <p className='text-center font-semibold mb-4'>Você tem certeza de que deseja apagar a Produto a seguir?</p>

            <div className='border flex flex-col rounded-2xl overflow-hidden justify-between'>
                <header className='py-2 px-6 bg-indigo-600 text-white font-bold text-2xl'>Produto</header>
                <p className='p-8 text-3xl bg-slate-200 h-full'>{produto.nome}</p>
                <div className="flex">
                    <button className='text-slate-100 bg-red-400 hover:bg-red-600 w-full py-2' onClick={retornar}>Não</button>
                    <button className='w-full text-slate-100 bg-indigo-400 hover:bg-indigo-600 flex items-center justify-center' onClick={deletarProduto}>
                    {isLoading ? <RotatingLines
                        strokeColor="white"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="24"
                        visible={true} /> : <span>Sim</span>}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeletarProduto