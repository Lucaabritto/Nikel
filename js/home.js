const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

let data = {
    transactions: []
};

document.getElementById("button-logout").addEventListener("click", logout);
document.getElementById("transactions-button").addEventListener("click", function() {
    window.location.href = "transactions.html";
});

// Adicionar lançamento
document.getElementById("transaction-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="type-input"]:checked').value;

    // Verificar se o saldo será negativo após adicionar a transação
    const futureTotal = calculateFutureTotal(value, type);
    if (futureTotal < 0) {
        const confirmAction = confirm("Atenção! Seu saldo após cadastrar essa despesa será negativo, deseja continuar?");
        if (!confirmAction) {
            return;
        }
    }

    data.transactions.unshift({
        value: value, type: type, description: description, date: date
    });

    saveData(data);
    e.target.reset();
    myModal.hide();
    
    getCashIn();
    getCashOut();
    getTotal();

    alert("Lançamento adicionado com sucesso!");
});

checkLogged();

function checkLogged() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if (!logged) {
        window.location.href = "index.html";
        return;
    }

    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        data = JSON.parse(dataUser);
    }

    getCashIn();
    getCashOut();
    getTotal();  // Aqui não chamamos verificarSaldoENotificar para evitar o alerta ao recarregar a página
}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html";
}

function getCashIn() {
    const transactions = data.transactions;

    const cashIn = transactions.filter((item) => item.type === "1");

    if (cashIn.length) {
        let cashInHtml = ``;
        let limit = Math.min(cashIn.length, 5);

        for (let index = 0; index < limit; index++) {
            cashInHtml += `
                <div class="row mb-4">
                    <div class="col-12">
                        <h3 class="fs-2">R$ ${cashIn[index].value.toFixed(2)}</h3>
                        <div class="container p-0">
                            <div class="row">
                                <div class="col-12 col-md-8">
                                    <p>${cashIn[index].description}</p>
                                </div>
                                <div class="col-12 col-md-3 d-flex justify-content-end">
                                    ${cashIn[index].date}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        document.getElementById("cash-in-list").innerHTML = cashInHtml;
    }   
}

function getCashOut() {
    const transactions = data.transactions;

    const cashOut = transactions.filter((item) => item.type === "2");

    if (cashOut.length) {
        let cashOutHtml = ``;
        let limit = Math.min(cashOut.length, 5);

        for (let index = 0; index < limit; index++) {
            cashOutHtml += `
                <div class="row mb-4">
                    <div class="col-12">
                        <h3 class="fs-2">R$ ${cashOut[index].value.toFixed(2)}</h3>
                        <div class="container p-0">
                            <div class="row">
                                <div class="col-12 col-md-8">
                                    <p>${cashOut[index].description}</p>
                                </div>
                                <div class="col-12 col-md-3 d-flex justify-content-end">
                                    ${cashOut[index].date}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        document.getElementById("cash-out-list").innerHTML = cashOutHtml;
    }   
}

function getTotal() {
    const transactions = data.transactions;
    let total = 0;

    transactions.forEach((item) => {
        if (item.type === "1") {
            total += item.value;
        } else {
            total -= item.value;
        }
    });

    document.getElementById("total").innerHTML = `R$ ${total.toFixed(2)}`;
    return total; // Retorna o total para uso na verificação de saldo
}

function calculateFutureTotal(value, type) {
    let futureTotal = getTotal();
    if (type === "1") {
        futureTotal += value;
    } else {
        futureTotal -= value;
    }
    return futureTotal;
}

function saveData(data) {
    localStorage.setItem(logged, JSON.stringify(data));
}
