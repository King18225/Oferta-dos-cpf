// 1. COLE AQUI O CONTEÚDO COMPLETO DO SEU SCRIPT TYPEBOT.
//    (O script que você obteve, por exemplo, de https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3.59/dist/web.js)

// 2. IMPORTANTE: MODIFICAÇÃO NECESSÁRIA APÓS COLAR:
//    Se o script que você colou é um módulo ES6 (geralmente, se ele usa palavras-chave como `export`),
//    ele NÃO irá automaticamente adicionar o objeto `Typebot` à janela global (`window`).
//    Para que a página de chat funcione, você PRECISA adicionar uma linha no FINAL DESTE ARQUIVO
//    para atribuir o objeto principal do Typebot (que pode se chamar `Typebot`, `TypebotClass`, etc.,
//    dependendo do script) ao `window.Typebot`.
//
//    Por exemplo, se o seu script exporta um objeto chamado `Typebot`:
//    (Verifique o final do script colado para ver como ele exporta, pode ser algo como `export { TypebotClass as Typebot }` ou similar)
//
//    Adicione esta linha no final do arquivo:
//
//    window.Typebot = Typebot; // Substitua `Typebot` pelo nome real do objeto/classe exportado, se for diferente.
//
//    Sem esta linha (ou uma equivalente), a inicialização na página de chat falhará com um erro
//    indicando que `window.Typebot` não está definido.
