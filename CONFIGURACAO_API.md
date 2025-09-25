# 🎬 Configuração da API Key do TMDB

## ❌ Problema Identificado
Os filmes não estão aparecendo porque a API key do The Movie Database (TMDB) não está configurada.

## ✅ Solução

### 1. Obter uma API Key Gratuita
1. Acesse: https://www.themoviedb.org/settings/api
2. Crie uma conta gratuita no TMDB
3. Gere uma API key (v3 auth)

### 2. Configurar a API Key
1. Abra o arquivo: `src/environments/environment.ts`
2. Substitua `your_tmdb_api_key_here` pela sua API key real
3. Salve o arquivo

### 3. Reiniciar o Servidor
```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm start
# ou
ng serve
```

## 🔧 Exemplo de Configuração

**Antes:**
```typescript
apiKey: (globalThis as any).NG_APP_API_KEY || 'your_tmdb_api_key_here'
```

**Depois:**
```typescript
apiKey: (globalThis as any).NG_APP_API_KEY || 'sua_api_key_aqui_123456789'
```

## 🚀 Alternativa com Variável de Ambiente

Você também pode criar um arquivo `.env` na raiz do projeto:

```env
NG_APP_API_KEY=sua_api_key_aqui_123456789
```

## ✅ Verificação
Após configurar, você deve ver:
- Filmes carregando na página inicial
- Console sem erros de API key
- Funcionalidade de busca funcionando

## 🆘 Ainda com Problemas?
1. Verifique se a API key está correta
2. Confirme que não há espaços extras na configuração
3. Reinicie o servidor de desenvolvimento
4. Verifique o console do navegador para erros
