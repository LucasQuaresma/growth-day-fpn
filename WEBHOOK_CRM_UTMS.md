# Contrato do Webhook — Lead Growth Day FPN (UTMs para o CRM)

Documento para a equipe que mantém o fluxo do n8n. A landing page já envia as UTMs;
falta o fluxo do n8n **mapear esses campos para o CRM**.

## Endpoint

- **Método:** `POST`
- **URL:** `https://projeto01-n8n.gmxuno.easypanel.host/webhook/e29fee45-b589-4d23-be68-4700f78aca74`
- **Content-Type:** `application/json`
- **Quando dispara:** ao enviar o formulário do modal "Reserve sua vaga", imediatamente antes do redirect para o checkout do Hubla.

## Payload (JSON)

Todas as chaves são **sempre enviadas**. As UTMs vêm como **string vazia** quando o
visitante não chegou com aquele parâmetro na URL (não use isso para decidir "existe ou não" —
trate string vazia como ausência).

| Campo            | Tipo   | Origem                                   | Exemplo                              |
|------------------|--------|------------------------------------------|--------------------------------------|
| `name`           | string | Formulário                               | `"João Silva"`                       |
| `email`          | string | Formulário                               | `"joao@clinica.com"`                 |
| `phone`          | string | Formulário                               | `"+55 11 99999-0000"`                |
| `source`         | string | Fixo                                     | `"growth-day-landing"`               |
| `event`          | string | Fixo                                     | `"Growth Day FPN Health"`            |
| `fb_access_token`| string | Fixo (Conversions API)                   | `"EAAL..."`                          |
| `submitted_at`   | string | ISO 8601 (UTC)                           | `"2026-05-22T14:03:21.000Z"`         |
| `utm_source`     | string | URL `?utm_source=`                       | `"facebook"`                         |
| `utm_medium`     | string | URL `?utm_medium=`                       | `"cpc"`                              |
| `utm_campaign`   | string | URL `?utm_campaign=`                     | `"growth-day-jun"`                   |
| `utm_term`       | string | URL `?utm_term=`                         | `"gestao-clinica"`                   |
| `utm_content`    | string | URL `?utm_content=`                      | `"criativo-a"`                       |
| `fbclid`         | string | URL `?fbclid=` (click ID do Facebook)    | `"IwAR1..."`                         |
| `gclid`          | string | URL `?gclid=` (click ID do Google Ads)   | `"Cj0KCQ..."`                        |
| `landing_url`    | string | URL completa em que o lead converteu     | `"https://.../?utm_source=facebook"` |

### Exemplo de body recebido

```json
{
  "name": "João Silva",
  "email": "joao@clinica.com",
  "phone": "+55 11 99999-0000",
  "source": "growth-day-landing",
  "event": "Growth Day FPN Health",
  "fb_access_token": "EAAL...",
  "submitted_at": "2026-05-22T14:03:21.000Z",
  "utm_source": "facebook",
  "utm_medium": "cpc",
  "utm_campaign": "growth-day-jun",
  "utm_term": "",
  "utm_content": "criativo-a",
  "fbclid": "IwAR1...",
  "gclid": "",
  "landing_url": "https://.../?utm_source=facebook&utm_medium=cpc"
}
```

## O que falta no n8n

No nó que cria/atualiza o contato no CRM, mapear os campos acima para os campos
correspondentes do CRM. Em expressões n8n, referenciar como:

```
{{ $json.body.utm_source }}
{{ $json.body.utm_campaign }}
{{ $json.body.fbclid }}
```

> Atenção ao caminho: dependendo da configuração do nó Webhook, o corpo pode chegar em
> `$json.body.<campo>` (com a opção padrão) ou direto em `$json.<campo>`. Verifiquem no
> primeiro item da execução.

## Observações

- **Atribuição de primeiro toque:** a UTM é capturada e fixada na sessão do navegador no
  primeiro acesso com parâmetros; recarregar a página sem os parâmetros não apaga o valor.
- **Captura de URL:** parâmetros lidos de `window.location.search` no carregamento e no envio.
