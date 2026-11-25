
const formulario = document.querySelector("#formulario");
const mensagem = document.querySelector("#mensagem");
const lista = document.querySelector("#lista");
const registro = document.querySelector("#registro");

// Recebe os dados do formulário
function lerFormulario(){
    return {
        doce: document.querySelector("#doce").value,
        massa: document.querySelector("#massa").value,
        recheio: document.querySelector("#recheio").value,
        cobertura: document.querySelector("#cobertura").value,
        decoracao: document.querySelector("#decoracao").value,
        quantidade: document.querySelector("#quantidade").value,
        observacao: document.querySelector("#observacao").value
    };
}

// Converte o valor recebido em número
function paraNumero(texto){
    if(texto.trim() === ""){
        return NaN;
    }

    return Number(texto);
}

// Trata os dados recebidos
function tratar(dados){
    dados.quantidade = paraNumero(dados.quantidade);
    dados.observacao = dados.observacao.trim();

    return dados;
}

// Valida os dados do formulário
function validar(dados){
    if(dados.doce === ""){
        throw new Error("Selecione um tipo de doce.");
    }

    if(dados.massa === ""){
        throw new Error("Selecione uma massa.");
    }

    if(dados.recheio === ""){
        throw new Error("Selecione um recheio.");
    }

    if(dados.cobertura === ""){
        throw new Error("Selecione uma cobertura.");
    }

    if(dados.decoracao === ""){
        throw new Error("Selecione uma decoração.");
    }

    if(isNaN(dados.quantidade)){
        throw new Error("Informe a quantidade de doces.");
    }

    if(!Number.isInteger(dados.quantidade)){
        throw new Error("A quantidade deve ser um número inteiro.");
    }

    if(dados.quantidade < 1 || dados.quantidade > 100){
        throw new Error("A quantidade deve estar entre 1 e 100.");
    }
}

// Calcula os valores de cada personalização
function calcular(dados){
    dados.base = 0;
    dados.valorMassa = 0;
    dados.valorRecheio = 0;
    dados.valorCobertura = 0;
    dados.valorDecoracao = 0;

    if(dados.doce === "Donut"){
        dados.base = 10;
    }else if(dados.doce === "Cupcake"){
        dados.base = 8;
    }else if(dados.doce === "Cookie"){
        dados.base = 6;
    }

    if(dados.massa === "Red Velvet"){
        dados.valorMassa = 2;
    }

    if(dados.recheio === "Nutella"){
        dados.valorRecheio = 4;
    }else if(dados.recheio !== "" && dados.recheio !== "Sem recheio"){
        dados.valorRecheio = 2;
    }

    if(dados.cobertura !== "" && dados.cobertura !== "Sem cobertura"){
        dados.valorCobertura = 2;
    }

    if(dados.decoracao !== "" && dados.decoracao !== "Sem decoração"){
        dados.valorDecoracao = 3;
    }

    dados.unitario = dados.base + dados.valorMassa +
        dados.valorRecheio + dados.valorCobertura +
        dados.valorDecoracao;

    dados.total = dados.unitario * dados.quantidade;

    return dados;
}

// Formata os valores em reais
function formatarValor(valor){
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Mostra a escolha e o preço do adicional
function mostrarAdicional(nome, valor){
    if(nome === ""){
        return "-";
    }

    return nome + " (" + formatarValor(valor) + ")";
}

// Altera a imagem conforme o doce escolhido
function atualizarImagem(doce){
    if(doce === "Donut"){
        imagem.src = "img/donut.jpg";
        imagem.alt = "Exemplo de donut decorado";
        imagem.hidden = false;

    }else if(doce === "Cupcake"){
        imagem.src = "img/cupcake.jpg";
        imagem.alt = "Exemplo de cupcake decorado";
        imagem.hidden = false;

    }else if(doce === "Cookie"){
        imagem.src = "img/cookie.jpg";
        imagem.alt = "Exemplo de cookie Red Velvet";
        imagem.hidden = false;

    }else{
        imagem.hidden = true;
        imagem.removeAttribute("src");
        imagem.alt = "";
    }
}

// Atualiza o resumo do pedido
function atualizarResumo(dados){
    atualizarImagem(dados.doce);

    document.querySelector("#doce-resumo").textContent =
        dados.doce || "Seu doce personalizado";

    document.querySelector("#base-resumo").textContent =
        formatarValor(dados.base);

    document.querySelector("#massa-resumo").textContent =
        mostrarAdicional(dados.massa, dados.valorMassa);

    document.querySelector("#recheio-resumo").textContent =
        mostrarAdicional(dados.recheio, dados.valorRecheio);

    document.querySelector("#cobertura-resumo").textContent =
        mostrarAdicional(dados.cobertura, dados.valorCobertura);

    document.querySelector("#decoracao-resumo").textContent =
        mostrarAdicional(dados.decoracao, dados.valorDecoracao);

    const quantidadeValida = Number.isInteger(dados.quantidade) &&
        dados.quantidade >= 1 && dados.quantidade <= 100;

    document.querySelector("#quantidade-resumo").textContent =
        quantidadeValida ? dados.quantidade : "-";

    if(dados.doce === ""){
        document.querySelector("#unitario").textContent = "-";
        document.querySelector("#total").textContent = "-";

    }else{
        document.querySelector("#unitario").textContent =
            formatarValor(dados.unitario);

        document.querySelector("#total").textContent =
            quantidadeValida ? formatarValor(dados.total) : "-";
    }

    if(dados.doce === ""){
        document.querySelector("#aviso-resumo").textContent =
            "Escolha um doce para começar.";

    }else if(dados.massa === "" || dados.recheio === "" ||
        dados.cobertura === "" || dados.decoracao === "" ||
        !quantidadeValida){

        document.querySelector("#aviso-resumo").textContent =
            "Preço parcial. Complete as escolhas e informe uma quantidade válida.";

    }else{
        document.querySelector("#aviso-resumo").textContent =
            "Confira os valores antes de finalizar.";
    }
}

// Atualiza os preços enquanto o usuário personaliza
function atualizarPrevia(){
    const dados = tratar(lerFormulario());

    calcular(dados);
    atualizarResumo(dados);
}

// Cria um parágrafo dentro do cartão
function adicionarTexto(item, texto){
    const paragrafo = document.createElement("p");
    paragrafo.textContent = texto;

    item.appendChild(paragrafo);
}

// Adiciona o doce personalizado à lista
function adicionarCriacao(dados){
    const item = document.createElement("li");
    item.className = "cartao";

    const titulo = document.createElement("h3");
    titulo.textContent = dados.doce + " personalizado";

    item.appendChild(titulo);

    adicionarTexto(item, "Massa: " + dados.massa);
    adicionarTexto(item, "Recheio: " + dados.recheio);
    adicionarTexto(item, "Cobertura: " + dados.cobertura);
    adicionarTexto(item, "Decoração: " + dados.decoracao);
    adicionarTexto(item, "Quantidade: " + dados.quantidade);

    adicionarTexto(item, "Valor unitário: " +
        formatarValor(dados.unitario));

    adicionarTexto(item, "Observações: " +
        (dados.observacao || "Nenhuma"));

    const total = document.createElement("p");
    total.className = "preco";
    total.textContent = "Total: " + formatarValor(dados.total);

    item.appendChild(total);
    lista.appendChild(item);

    document.querySelector("#vazio").hidden = true;
}

// Registra os envios do formulário
function registrar(texto, tipo){
    const item = document.createElement("li");

    item.textContent = texto;
    item.className = tipo;

    registro.appendChild(item);
}

// Atualiza a prévia quando o usuário altera os campos
formulario.addEventListener("input", function(){
    mensagem.textContent = "";
    mensagem.className = "mensagem";

    atualizarPrevia();
});

// Limpa o formulário e o resumo
formulario.addEventListener("reset", function(){
    mensagem.textContent = "";
    mensagem.className = "mensagem";

    setTimeout(atualizarPrevia, 0);
});

// Controla o envio e trata possíveis erros
formulario.addEventListener("submit", function(evento){
    evento.preventDefault();

    try{
        const dados = tratar(lerFormulario());

        validar(dados);
        calcular(dados);
        atualizarResumo(dados);
        adicionarCriacao(dados);

        mensagem.textContent = "Doce personalizado com sucesso!";
        mensagem.className = "mensagem sucesso";

        registrar(
            "Pedido realizado: " + dados.quantidade + " x " +
            dados.doce + " - " + formatarValor(dados.total),
            "sucesso"
        );

    }catch(erro){
        mensagem.textContent = erro.message;
        mensagem.className = "mensagem erro";

        registrar("Pedido recusado: " + erro.message, "erro");
    }
});

// Inicia o resumo da página
atualizarPrevia();
