<div align="center">

# 🐾 Programa Arca

**Adoção responsável, castração e cuidado com os bichos da cidade.**

*Todo bicho merece um lar. Toda cidade, cuidado.*

<sub>Projeto acadêmico em HTML, CSS e JavaScript puros. Sem framework, sem build, sem complicação.</sub>

</div>

---

## 🎓 Sobre este projeto

A Arca nasceu como **projeto universitário**, desenvolvido em parceria com a **Prefeitura da Serra** na **Universidade Vila Velha**. A ideia do programa é real, mas **esse sistema não foi colocado em uso**. Por isso, ele **não é um canal oficial de comunicação com a prefeitura nem um serviço em funcionamento**, e todos os dados que aparecem aqui (pessoas, animais, organizações, CNPJs e campanhas) são **fictícios**, criados só para demonstração.

Este repositório guarda a **v2**. Ela foi redesenhada e reescrita **à parte, por hobby**, depois do projeto da universidade, então não tem a colaboração das outras pessoas que participaram da versão original da época.

---

## 🌿 O que é isso?

A **Arca** é a plataforma do programa municipal de castração e adoção responsável da *Prefeitura da Serra*, que junta três coisas que costumam andar separadas:

- quem **quer adotar** um cachorro ou gato,
- as **organizações de proteção animal** que cuidam deles,
- e as **campanhas de castração e vacinação** que ajudam a cidade inteira.

O nome vem da ideia de arca mesmo: um abrigo. Por isso o arco (aquele formato de porta arredondada) aparece em tudo: nas fotos, no logo, na faixa colorida lá embaixo.

---

## 👀 O que dá pra fazer

<table>
<tr>
<td width="33%" valign="top">

### 🙋 Visitante
- Conhecer o programa
- Ver alguns animais e as próximas campanhas
- Criar conta de cidadão ou cadastrar uma organização

</td>
<td width="33%" valign="top">

### 🐶 Cidadão
- Navegar pelos animais, um de cada vez
- Filtrar por custo, porte e sexo
- Favoritar e demonstrar interesse em adotar
- Acompanhar o histórico e as campanhas

</td>
<td width="33%" valign="top">

### 🏠 Representante
- Cadastrar, editar e excluir animais
- Criar e gerenciar campanhas
- Ver quem tem interesse nos seus animais, com o contato da pessoa
- Marcar interessados como lidos

</td>
</tr>
</table>

---

## 🔑 Contas para testar

Todas usam a senha **`123`**.

| Quem | E-mail | O que vê |
|---|---|---|
| Cidadão | `cidadao@arca.br` | Já vem com favoritos e histórico |
| Cidadã | `ana@arca.br` | Conta vazia, para começar do zero |
| Cidadão | `carlos@arca.br` | Conta vazia |
| Representante | `admin@arca.br` | ONG Teste: 4 animais, 4 campanhas, interessados novos |
| Representante | `patinhas@arca.br` | Patinhas da Serra: 2 animais, 1 campanha |

> 💡 A conta `admin@arca.br` está ligada a uma organização, então o login pergunta se você quer entrar como **representante** ou como **cidadão**.

Dá para criar contas novas pelas telas de cadastro. Para os campos com validação, estes valores de exemplo são válidos:

- **CPF:** `529.982.247-25`
- **CNPJ:** `11.222.333/0001-81`

---

## 🗂️ Como o projeto está organizado

```
programa-arca/
├── index.html                  Página inicial (pública)
├── login.html                  Entrar
├── cadastro.html               Cadastro de cidadão
├── cadastro_representante.html Cadastro de representante (etapa 1 de 2)
├── cadastro_instituicao.html   Cadastro da organização (etapa 2 de 2)
│
├── adocao.html                 Cidadão: conhecer os animais
├── favoritados.html            Cidadão: animais favoritados
├── historico.html              Cidadão: linha do tempo de ações
├── campanhas.html              Cidadão: agenda de campanhas
│
├── listagem_animais.html       Representante: animais da organização
├── campanhas_interno.html      Representante: gerenciar campanhas
├── notificacoes.html           Representante: interessados em adotar
│
└── assets/
    ├── css/
    │   ├── style.css           Base: cores, fontes, botões, campos, avisos
    │   ├── publico.css         Página inicial, login e cadastros
    │   └── interno.css         Telas de dentro do sistema
    ├── js/
    │   ├── funcoes.js          Utilidades: máscaras, validações, avisos, MD5
    │   ├── conexao_bd.js       O "banco de dados" (localStorage)
    │   ├── sistema.js          Menu lateral, sessão e proteção de rotas
    │   ├── selecao.js          O select bonitinho
    │   ├── bd_fake.json        Dados de exemplo
    │   └── (um .js por página)
    └── imgs/                   Logo, fotos, ilustrações e ícones
```

Cada página tem o **seu próprio `.js`**, com o mesmo nome. Se algo está estranho na tela de adoção, o lugar para olhar é `adocao.js`.

---

## 🧠 Como funciona por baixo

Este projeto **não tem servidor**. Em vez disso:

- Os dados moram no **`localStorage`** do navegador (chave `bd_arca`) e começam a partir do `bd_fake.json`.
- A sessão de quem está logado fica em `sessao_arca`.
- Todas as funções de dados (`listarAnimais`, `criarCampanha` e companhia) ficam em `conexao_bd.js` e devolvem *Promises*. Se um dia existir uma API verdadeira, entrará ali. 
- Cada tela interna começa com `protegerRota([...])`, que manda para o login quem não tem permissão (um cidadão não abre as telas de representante).

### ♻️ Recomeçar do zero

Fez bagunça nos testes? No navegador, aperte **F12 → Console** e rode:

```js
localStorage.clear(); location.reload();
```

### 📦 Mudou os dados de exemplo?

O navegador só lê o `bd_fake.json` na primeira visita. Se você editar o arquivo, aumente o número `"versao"` dele **e** a variável `VERSAO_BD` no começo do `conexao_bd.js`. Na próxima abertura, os dados são recarregados automaticamente.

> ⚠️ Isso apaga contas e cadastros feitos durante os testes.

---

## 🎨 A identidade visual

A ideia foi fugir do "painel de prefeitura" e fazer algo com personalidade.

**Cores**

| | Cor | Uso |
|---|---|---|
| 🟢 | Verde-floresta `#193C35` | Cor principal, menu, botões |
| 🟤 | Marfim `#F4F0E6` | Fundo das páginas |
| 🟡 | Dourado `#E7A94B` | Ações e destaques |
| 🟠 | Coral `#E77962` | Emoção: interesse, avisos novos |
| 🌱 | Sálvia `#A9B9A1` | Áreas calmas, fundos suaves |

**Fontes** (carregadas do Google Fonts)

- **Fraunces** nos títulos, com aquele itálico expressivo nas palavras-chave.
- **Manrope** no resto: menus, formulários, tabelas.

**O arco** é a assinatura: fotos de animais em formato de porta, o logo (uma pata dentro de um arco) e a faixa de arcos coloridos que separa as seções.

---

## ✨ Os detalhes de carinho

- **Máscaras** em CPF, CNPJ, CEP, telefone e datas, que formatam enquanto você digita (ou cola).
- **Validação com mensagem clara**: o e-mail sem `@` avisa que falta o `@`; CPF e CNPJ conferem os dígitos verificadores; datas impossíveis como `31/02` são recusadas.
- **Select próprio**, no lugar da lista feia do navegador, com teclado completo (setas, Enter, Esc, busca por letra).
- **Acessibilidade**: foco visível, rótulos em todos os campos, links de "pular para o conteúdo", `aria-*` onde precisa e respeito a `prefers-reduced-motion` (quem desativa animações no sistema não vê nenhuma).
- **Responsivo**: no celular o menu lateral vira uma gaveta, e as tabelas viram listas legíveis.
- **Leve**: as imagens foram otimizadas (todo o `assets/` tem cerca de 2,4 MB) e não há nenhuma biblioteca externa de JavaScript, só as fontes do Google.

---

## 🧰 Para quem for mexer no código

Alguns atalhos que ajudam:

| Quero... | Faço assim |
|---|---|
| Uma máscara num campo | `<input data-mascara="cpf">` (aceita `cpf`, `cnpj`, `cep`, `telefone`, `data`, `numero`) |
| Um select no estilo do navegador | `<select class="sem-selecao">` |
| Uma tela nova para quem está logado | Copie uma página interna e chame `protegerRota([...])` e `montarMenu('id-da-pagina')` no `.js` dela |
| Um ícone | Está em `assets/imgs/icons/sprite.svg`; use `icone('nome')` |
| Um aviso na tela | `toast('Salvo!', 'sucesso')` |
| Uma confirmação | `confirmar({ titulo, mensagem, perigo: true }).then(...)` |

---

## 🌱 Limites

- **Não tem backend.** Tudo é salvo só no navegador de quem está usando, então os dados não são compartilhados entre pessoas.
- **A senha usa MD5**, que não é seguro de verdade. Serve para a demonstração, somente.
- **Algumas imagens são provisórias.** Os animais Bolinha, Nina, Pipoca, Mingau, Tigre e Pantera usam ilustrações. Não sou proprietária de nenhuma das outras imagens, por sinal. Todas elas são retiradas de cantos da internet.
- **O armazenamento do navegador é pequeno** (uns 5 MB). Fotos enviadas são reduzidas automaticamente, mas cadastrar centenas de fotos vai encher.

---

## 🔭 Ideias para o futuro

- [ ] Um servidor de verdade (e banco de dados) no lugar do `localStorage`
- [ ] Preencher rua e bairro automaticamente a partir do CEP
- [ ] Mapa com os locais das campanhas
- [ ] Notificações por e-mail para as organizações
- [ ] Ficha médica e histórico de vacinas de cada animal

---

<div align="center">

Feito com carinho, café e muita vontade de ver todo animalzinho em um lar. 🐱

</div>
