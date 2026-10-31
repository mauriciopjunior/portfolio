# Portfólio

Site pessoal estático (HTML, CSS e JavaScript puros — sem etapa de build).

## Estrutura

```
.
├── index.html          # Página única com todas as seções
└── assets/
    ├── css/style.css   # Estilos (variáveis de tema no topo do arquivo)
    ├── js/main.js      # Tema claro/escuro, menu mobile, link ativo
    └── img/            # Imagens e favicon
```

## Seções

Início (hero) · Sobre · Projetos · Habilidades · Contato

## Rodando localmente

Abra o `index.html` no navegador, ou sirva a pasta:

```bash
python3 -m http.server 8000
```

## Publicação

Compatível com GitHub Pages: em *Settings → Pages*, selecione a branch e a pasta raiz (`/`).

## Personalização

- **Textos**: edite diretamente o `index.html` (todos os textos atuais são placeholders).
- **Cores e fontes**: ajuste as variáveis CSS no topo de `assets/css/style.css`.
- **Foto**: substitua o `.avatar-placeholder` por uma `<img>` em `assets/img/`.
