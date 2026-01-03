# Guia Completo de Deploy - Joint Count Lambda

Este guia detalha todos os passos necessários para fazer o deploy das funções Lambda na AWS e integrá-las com a aplicação Nuxt.

## 📋 Pré-requisitos

1. **Conta AWS** ativa
2. **Node.js** 20.x ou superior instalado
3. **AWS CLI** instalado e configurado
4. **Serverless Framework** instalado globalmente

### Instalação dos Pré-requisitos

#### 1. Instalar AWS CLI

**macOS (Homebrew):**
```bash
brew install awscli
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Windows:**
Baixe o instalador MSI em: https://aws.amazon.com/cli/

#### 2. Configurar AWS CLI

```bash
aws configure
```

Você precisará fornecer:
- **AWS Access Key ID**: Sua chave de acesso AWS
- **AWS Secret Access Key**: Sua chave secreta
- **Default region**: Ex: `us-east-1`
- **Default output format**: `json`

**Como obter as credenciais:**
1. Acesse o AWS Console
2. Vá em **IAM** → **Users** → Seu usuário
3. Aba **Security credentials**
4. Clique em **Create access key**
5. Escolha **Application running outside AWS**
6. Copie as credenciais (salve em local seguro!)

#### 3. Instalar Serverless Framework

```bash
npm install -g serverless
```

Verifique a instalação:
```bash
serverless --version
```

## 🚀 Passo a Passo do Deploy

### Passo 1: Navegar até a pasta Lambda

```bash
cd lambda
```

### Passo 2: Instalar Dependências

```bash
# Instalar dependências do Serverless
npm install

# Instalar dependências das funções Lambda
npm run install:all

# Compilar TypeScript
npm run build:all
```

### Passo 3: Verificar Configuração

Abra o arquivo `serverless.yml` e verifique:
- **region**: Região AWS desejada (padrão: `us-east-1`)
- **stage**: Ambiente (padrão: `dev`)

### Passo 4: Fazer o Deploy

```bash
# Deploy em desenvolvimento
npm run deploy:dev

# OU deploy manual
serverless deploy --stage dev
```

**O que acontece durante o deploy:**
1. Serverless cria a tabela DynamoDB `joint-count-dev`
2. Cria as duas funções Lambda (`getJointCount` e `updateJointCount`)
3. Cria o API Gateway com os endpoints
4. Configura permissões IAM necessárias
5. Retorna as URLs dos endpoints

### Passo 5: Anotar as URLs dos Endpoints

Após o deploy bem-sucedido, você verá uma saída similar a:

```
Service Information
service: joint-count-api
stage: dev
region: us-east-1
stack: joint-count-api-dev
resources: 15
api keys:
  None
endpoints:
  GET - https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/joint-count
  PUT - https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/joint-count
  POST - https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/joint-count
functions:
  getJointCount: joint-count-api-dev-getJointCount
  updateJointCount: joint-count-api-dev-updateJointCount
```

**Copie a URL base da API** (ex: `https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev`)

### Passo 6: Configurar a Aplicação Nuxt

#### Opção 1: Variável de Ambiente (Recomendado)

Crie um arquivo `.env` na raiz do projeto Nuxt:

```bash
# .env
JOINT_COUNT_API_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev
```

**Importante:** Adicione `.env` ao `.gitignore` para não commitar credenciais!

#### Opção 2: Atualizar nuxt.config.ts diretamente

Se preferir, você pode atualizar o `nuxt.config.ts`:

```typescript
runtimeConfig: {
  public: {
    jointCountApiUrl: 'https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev'
  }
}
```

### Passo 7: Testar a API

#### Teste GET (Buscar contagem)

```bash
curl "https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/joint-count?userId=default"
```

Resposta esperada:
```json
{
  "userId": "default",
  "totalJoints": 0,
  "startDate": "2026-01-01",
  "createdAt": "2026-01-01T12:00:00.000Z",
  "updatedAt": "2026-01-01T12:00:00.000Z"
}
```

#### Teste PUT (Incrementar)

```bash
curl -X PUT "https://zx8085f2yg.execute-api.us-east-1.amazonaws.com/dev/joint-count" \
  -H "Content-Type: application/json" \
  -d '{"userId": "default", "increment": true}'
```

Resposta esperada:
```json
{
  "success": true,
  "data": {
    "userId": "default",
    "totalJoints": 1,
    "startDate": "2026-01-01",
    "createdAt": "2026-01-01T12:00:00.000Z",
    "updatedAt": "2026-01-01T12:01:00.000Z"
  }
}
```

### Passo 8: Testar na Aplicação

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:3000/joint-count`

3. Clique na imagem do joint para incrementar

4. Verifique se os dados estão sendo salvos no DynamoDB:
   - Acesse o AWS Console
   - Vá em **DynamoDB** → **Tables** → `joint-count-dev`
   - Clique em **Explore table items**
   - Verifique se há um item com `userId: default`

## 🔍 Verificação e Monitoramento

### Ver Logs das Funções Lambda

```bash
# Logs em tempo real da função GET
npm run logs:get

# Logs em tempo real da função UPDATE
npm run logs:update

# Ou via AWS CLI
aws logs tail /aws/lambda/joint-count-api-dev-getJointCount --follow
```

### Verificar DynamoDB

1. Acesse AWS Console → DynamoDB
2. Selecione a tabela `joint-count-dev`
3. Clique em **Explore table items**
4. Verifique os dados salvos

### Verificar API Gateway

1. Acesse AWS Console → API Gateway
2. Encontre a API `joint-count-api-dev`
3. Veja os endpoints criados
4. Teste diretamente no console

## 🛠️ Troubleshooting

### Erro: "Access Denied" ou "Unauthorized"

**Causa:** Credenciais AWS não configuradas ou sem permissões.

**Solução:**
1. Verifique `aws configure`
2. Certifique-se de que o usuário IAM tem permissões para:
   - Criar/atualizar Lambda functions
   - Criar/gerenciar DynamoDB tables
   - Criar/gerenciar API Gateway

### Erro: "Table already exists"

**Causa:** Tabela DynamoDB já existe de um deploy anterior.

**Solução:**
- Remova a tabela manualmente no AWS Console, OU
- Use `serverless remove` e faça deploy novamente

### Erro: CORS no navegador

**Causa:** Headers CORS não configurados corretamente.

**Solução:**
- Os headers CORS já estão configurados nas funções Lambda
- Verifique se a URL da API está correta no `.env`

### Erro: "Cannot find module" no Lambda

**Causa:** Dependências não foram instaladas corretamente.

**Solução:**
```bash
cd lambda/get-joint-count && npm install
cd ../update-joint-count && npm install
npm run build:all
serverless deploy
```

### API retorna erro 500

**Causa:** Problema na função Lambda ou DynamoDB.

**Solução:**
1. Verifique os logs: `npm run logs:get` ou `npm run logs:update`
2. Verifique se a tabela DynamoDB existe
3. Verifique se as variáveis de ambiente estão configuradas

## 📊 Estrutura de Custos

### DynamoDB
- **Billing Mode**: Pay Per Request (sem provisionamento)
- **Custo**: ~$0.25 por milhão de requisições de escrita
- **Custo**: ~$0.25 por milhão de requisições de leitura
- **Armazenamento**: Primeiros 25GB gratuitos

### Lambda
- **Free Tier**: 1 milhão de requisições gratuitas/mês
- **Custo**: ~$0.20 por milhão de requisições após o free tier
- **Memória**: 256MB (suficiente para este caso)

### API Gateway
- **Free Tier**: Primeiro milhão de requisições/mês gratuitas
- **Custo**: ~$3.50 por milhão de requisições após o free tier

**Estimativa mensal para uso pessoal:** Praticamente gratuito (dentro do free tier)

## 🔄 Atualizações e Redeploy

Para atualizar as funções após mudanças no código:

```bash
cd lambda
npm run build:all
serverless deploy --stage dev
```

## 🗑️ Remover Recursos

Para remover todos os recursos criados (tabela DynamoDB, Lambdas, API Gateway):

```bash
cd lambda
npm run remove
# ou
serverless remove --stage dev
```

**Atenção:** Isso deletará TODOS os dados na tabela DynamoDB!

## 📝 Próximos Passos

1. ✅ Deploy concluído
2. ✅ API funcionando
3. ✅ Integração com Nuxt funcionando
4. 🔄 Considerar adicionar autenticação (opcional)
5. 🔄 Considerar adicionar múltiplos usuários (opcional)
6. 🔄 Configurar domínio customizado no API Gateway (opcional)

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs das funções Lambda
2. Verifique o CloudWatch Logs no AWS Console
3. Teste os endpoints diretamente com `curl`
4. Verifique as permissões IAM do usuário AWS

