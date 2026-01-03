# PWA Setup - Ícones Necessários

Para que o PWA funcione corretamente, você precisa criar os seguintes ícones na pasta `public/`:

## Ícones Necessários

1. **pwa-192x192.png** - Ícone 192x192 pixels
2. **pwa-512x512.png** - Ícone 512x512 pixels

## Como Criar os Ícones

### Opção 1: Usando sips (macOS)
```bash
cd public
sips -z 192 192 favicon.ico --out pwa-192x192.png
sips -z 512 512 favicon.ico --out pwa-512x512.png
```

### Opção 2: Usando ImageMagick
```bash
cd public
convert favicon.ico -resize 192x192 pwa-192x192.png
convert favicon.ico -resize 512x512 pwa-512x512.png
```

### Opção 3: Usando Ferramentas Online
1. Acesse https://realfavicongenerator.net/
2. Faça upload do seu favicon.ico
3. Gere os ícones PWA
4. Baixe e coloque na pasta `public/`

### Opção 4: Criar Manualmente
Use qualquer editor de imagens para criar:
- `pwa-192x192.png` - 192x192 pixels, PNG
- `pwa-512x512.png` - 512x512 pixels, PNG

## Verificação

Após criar os ícones, execute:
```bash
npm run build
npm run preview
```

Abra o DevTools do navegador e verifique:
- Application → Manifest (deve mostrar os ícones)
- Application → Service Workers (deve estar registrado)
- No mobile, deve aparecer a opção "Adicionar à tela inicial"

