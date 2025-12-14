import { Link } from "react-router-dom";
import { Gamepad2, Swords, Target, Puzzle, Users, Zap, Crown, Skull, Heart, Star, Sparkles, Flame, Ghost, Rocket, TreePine, Mountain, Wand2, Shield, Music, Camera, Edit3, Trash2 } from "lucide-react";
import Categoria from "../../../models/categorias/Categoria";

interface CardCategoriaProps {
  categoria: Categoria;
}

// Mapeamento de ícones baseado no slug/tipo da categoria
const getIconForCategory = (tipo: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'action': <Swords className="w-6 h-6" />,
    'adventure': <Mountain className="w-6 h-6" />,
    'rpg': <Crown className="w-6 h-6" />,
    'role-playing': <Crown className="w-6 h-6" />,
    'shooter': <Target className="w-6 h-6" />,
    'puzzle': <Puzzle className="w-6 h-6" />,
    'strategy': <Shield className="w-6 h-6" />,
    'racing': <Zap className="w-6 h-6" />,
    'sports': <Users className="w-6 h-6" />,
    'fighting': <Flame className="w-6 h-6" />,
    'horror': <Skull className="w-6 h-6" />,
    'survival': <Ghost className="w-6 h-6" />,
    'simulation': <Rocket className="w-6 h-6" />,
    'platformer': <Star className="w-6 h-6" />,
    'indie': <Sparkles className="w-6 h-6" />,
    'arcade': <Gamepad2 className="w-6 h-6" />,
    'music': <Music className="w-6 h-6" />,
    'visual novel': <Camera className="w-6 h-6" />,
    'moba': <Users className="w-6 h-6" />,
    'sandbox': <TreePine className="w-6 h-6" />,
    'fantasy': <Wand2 className="w-6 h-6" />,
    'romance': <Heart className="w-6 h-6" />,
  };
  
  const key = tipo.toLowerCase();
  for (const [pattern, icon] of Object.entries(iconMap)) {
    if (key.includes(pattern)) return icon;
  }
  return <Gamepad2 className="w-6 h-6" />;
};

// Cores de gradiente para cada categoria
const getGradientForCategory = (tipo: string): string => {
  const gradients: Record<string, string> = {
    'action': 'from-red-500/20 to-orange-500/20',
    'adventure': 'from-emerald-500/20 to-teal-500/20',
    'rpg': 'from-purple-500/20 to-pink-500/20',
    'role-playing': 'from-purple-500/20 to-pink-500/20',
    'shooter': 'from-gray-500/20 to-slate-500/20',
    'puzzle': 'from-blue-500/20 to-cyan-500/20',
    'strategy': 'from-amber-500/20 to-yellow-500/20',
    'racing': 'from-orange-500/20 to-red-500/20',
    'sports': 'from-green-500/20 to-lime-500/20',
    'fighting': 'from-rose-500/20 to-red-500/20',
    'horror': 'from-violet-500/20 to-purple-500/20',
    'simulation': 'from-sky-500/20 to-blue-500/20',
    'indie': 'from-pink-500/20 to-fuchsia-500/20',
  };
  
  const key = tipo.toLowerCase();
  for (const [pattern, gradient] of Object.entries(gradients)) {
    if (key.includes(pattern)) return gradient;
  }
  return 'from-primary-500/20 to-accent-500/20';
};

function CardCategorias({ categoria }: CardCategoriaProps) {
  const icon = getIconForCategory(categoria.tipo);
  const gradient = getGradientForCategory(categoria.tipo);

  return (
    <div className={`
      group relative overflow-hidden
      bg-gradient-to-br ${gradient}
      border border-neutral-700/50 rounded-xl
      p-5 transition-all duration-300
      hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10
      hover:scale-[1.02] hover:-translate-y-1
    `}>
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-accent-500/0 
                      group-hover:from-primary-500/5 group-hover:to-accent-500/5 
                      transition-all duration-300 pointer-events-none" />
      
      <div className="relative flex items-start gap-4">
        {/* Ícone da categoria */}
        <div className={`
          flex-shrink-0 w-14 h-14 rounded-xl
          bg-gradient-to-br from-neutral-800 to-neutral-900
          border border-neutral-600/50 
          flex items-center justify-center
          text-primary-400 group-hover:text-primary-300
          group-hover:border-primary-500/50 group-hover:shadow-lg group-hover:shadow-primary-500/20
          transition-all duration-300
        `}>
          {icon}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors truncate">
              {categoria.tipo}
            </h3>
            <span className={`
              flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium
              ${categoria.ativo 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }
            `}>
              {categoria.ativo ? '● Ativo' : '○ Inativo'}
            </span>
          </div>
          
          <p className="text-neutral-400 text-sm line-clamp-2 mb-3">
            {categoria.descricao || "Categoria de jogos para sua loja"}
          </p>

          {/* Data de criação */}
          {categoria.dataCriacao && (
            <p className="text-neutral-500 text-xs mb-3">
              Criado em: {new Date(categoria.dataCriacao).toLocaleDateString('pt-BR')}
            </p>
          )}

          {/* Ações */}
          <div className="flex items-center gap-2">
            <Link
              to={`/editarCategoria/${categoria.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 
                         bg-neutral-800/80 hover:bg-primary-500/20 
                         border border-neutral-600/50 hover:border-primary-500/50
                         rounded-lg text-sm text-neutral-300 hover:text-primary-300
                         transition-all duration-200"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar
            </Link>
            <Link
              to={`/deletarCategoria/${categoria.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 
                         bg-neutral-800/80 hover:bg-red-500/20 
                         border border-neutral-600/50 hover:border-red-500/50
                         rounded-lg text-sm text-neutral-300 hover:text-red-400
                         transition-all duration-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Deletar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardCategorias;
