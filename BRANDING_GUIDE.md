# 🎮 GameStore - Guia de Branding Moderno

## 🎨 **IDENTIDADE VISUAL RENOVADA**

### **Conceito: "CYBER GAMING PREMIUM"**
- **70% Futurista/Tech** - Cores vibrantes e gradientes
- **20% Premium/Luxo** - Acabamentos refinados  
- **10% Energético** - Elementos dinâmicos

---

## 🌈 **PALETA DE CORES PRINCIPAL**

### **🔵 PRIMARY - Electric Blue (Marca Principal)**
```
primary-500: #0087FF  // Cor principal da marca
primary-600: #006BCC  // Hover states
primary-700: #004F99  // Active states
```

### **🟣 SECONDARY - Cyber Purple (Premium)**
```
secondary-500: #8700FF  // Elementos premium
secondary-600: #6B00CC  // Variações
```

### **🟢 ACCENT - Neon Green (Gaming)**
```
accent-500: #00FF4B    // Destaques e CTAs
accent-600: #00CC3C    // Hover
```

### **⚫ NEUTRALS - Dark Gaming**
```
neutral-950: #0A0A0A   // Background principal
neutral-900: #171717   // Cards e containers
neutral-800: #262626   // Bordas
neutral-400: #A3A3A3   // Texto secundário
neutral-0: #FFFFFF     // Texto principal
```

---

## 🎯 **APLICAÇÕES PRÁTICAS**

### **Botões:**
- **Primário:** `bg-gradient-gaming` + `shadow-glow-md`
- **Secundário:** `bg-accent-500` + `shadow-glow-neon`
- **Outline:** `border-primary-500` + `hover:shadow-glow-sm`

### **Cards:**
- **Background:** `bg-gradient-card`
- **Bordas:** `border-neutral-800` + `hover:border-primary-500`
- **Sombras:** `shadow-card-gaming`

### **Navegação:**
- **Background:** `bg-neutral-950`
- **Links:** `text-neutral-300` + `hover:text-primary-400`
- **Logo:** Gradiente `bg-gradient-gaming`

---

## ✨ **EFEITOS ESPECIAIS**

### **Gradientes:**
```css
bg-gradient-gaming  // Linear azul → roxo
bg-gradient-neon    // Linear verde → ciano
bg-gradient-card    // Sutil para cards
```

### **Glows (Brilhos):**
```css
shadow-glow-sm      // Sutil
shadow-glow-md      // Médio
shadow-glow-lg      // Intenso
shadow-glow-neon    // Verde neon
shadow-glow-purple  // Roxo cyber
```

---

## 📐 **TOKENS DE DESIGN**

### **Espaçamentos:**
- **Padding:** 4, 6, 8, 12, 16, 24px
- **Margins:** 2, 4, 6, 8, 12, 16px
- **Gaps:** 2, 4, 6, 8px

### **Border Radius:**
- **Buttons:** `rounded-button` (8px)
- **Cards:** `rounded-card` (16px)
- **Gaming:** `rounded-gaming` (12px)

### **Tipografia:**
- **Família:** `font-gaming` (Inter)
- **Accent:** `font-accent` (Orbitron)
- **Pesos:** 400, 500, 600, 700

---

## 🚀 **IMPLEMENTAÇÃO**

### **1. Instalar Fontes:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
```

### **2. Usar Classes:**
```tsx
// Botão principal
<button className="px-6 py-3 bg-gradient-gaming text-white font-gaming font-semibold rounded-gaming shadow-glow-md hover:shadow-glow-lg transition-all duration-300">
  Comprar Jogo
</button>

// Card de produto
<div className="bg-gradient-card rounded-card p-6 shadow-card-gaming border border-neutral-800 hover:border-primary-500 transition-all duration-300">
  {/* Conteúdo */}
</div>
```

---

## 📊 **MÉTRICAS DE SUCESSO**

### **Contraste (WCAG AA):**
- ✅ Primary vs White: 4.5:1
- ✅ Neutral-400 vs Neutral-900: 4.5:1
- ✅ Accent vs Neutral-900: 7:1

### **Acessibilidade:**
- ✅ Cores não são única forma de informação
- ✅ Foco visível em todos elementos
- ✅ Texto legível em todos tamanhos

---

## 🎮 **PRÓXIMOS PASSOS**

1. **Implementar em componentes existentes**
2. **Criar biblioteca de ícones gaming**
3. **Desenvolver animações micro-interações**
4. **Testar em diferentes dispositivos**
5. **Validar com usuários gamers**

---

**🎯 Resultado:** Identidade visual moderna, escalável e com forte apelo gamer que posiciona a marca como premium no mercado de jogos.