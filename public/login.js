function logar() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    // LOGIN FIXO AQUI:
    const USER_CORRETO = "admin";
    const SENHA_CORRETA = "12345";

    if (usuario === USER_CORRETO && senha === SENHA_CORRETA) {
        localStorage.setItem("logado", "true");
        window.location.href = "/dashboard.html";
    } else {
        document.getElementById("erro").innerText = "Usuário ou senha incorretos!";
    }
}
