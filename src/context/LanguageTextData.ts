export type TextData = {
    loginForm: {
        form: {
            title: string,
            usernameLabel: string,
            passwordLabel: string,
            submitBtnText: string
        },
        feedback: {
            onSuccess: string,
            onFail: string,
            onServerFail: string,
        }
    },

    registrationForm: {
        form: {
            title: string,
            usernameLabel: string,
            emailLabel: string,
            passwordLabel: string,
            submitBtnText: string
        },
        feedback: {
            onSuccess: string,
            onFail: string,
            onServerFail: string,
            bodyNotFound: string
            infoFetchingRequirements: string,
            infoRequirementsFetchFail: string
        }
    }

}

export const englishTextData: TextData = {
    loginForm: {
        form: {
            title: "Login",
            usernameLabel: "Username",
            passwordLabel: "Password",
            submitBtnText: "Login"
        },
        feedback: {
            onSuccess: "Login Successfully",
            onFail: "Error",
            onServerFail: "Error during login, check logs for more info",
        }
    },
    registrationForm: {
        form: {
            title: "Registration",
            usernameLabel: "Username",
            emailLabel: "Email",
            passwordLabel: "Password",
            submitBtnText: "Registration"
        },
        feedback: {
            onSuccess: "User registered successfully with token:",
            onFail: "",
            onServerFail: "Error during registration, check logs for more info",
            bodyNotFound: "No post body found",
            infoFetchingRequirements: "Loading registration requirements for new users",
            infoRequirementsFetchFail: "Failed to fetch registration requirements for new users"
        }
    }
}

export const portugueseTextData: TextData = {
    loginForm: {
        form: {
            title: "Iniciar Sessão",
            usernameLabel: "Nome de utilizador",
            passwordLabel: "Palavre-passe",
            submitBtnText: "Iniciar Sessão"
        },
        feedback: {
            onSuccess: "Sessão iniciada",
            onFail: "Erro",
            onServerFail: "Erro ao iniciar sessão, veja os logs para mais informação",
        }

    },
    registrationForm: {
        form: {
            title: "Inscreve-te",
            usernameLabel: "Nome de utilizador",
            emailLabel: "Email",
            passwordLabel: "Palavre-passe",
            submitBtnText: "Inscrever"
        },
        feedback: {
            onSuccess: "Inscrição bem sucedida com o token:",
            onFail: "",
            onServerFail: "Erro no processo de inscricao, veja os logs para mais informação",
            bodyNotFound: "Corpo do pedido de inscrição não encontrado",
            infoFetchingRequirements: "Buscando requerimentos para registro de novos usuarios",
            infoRequirementsFetchFail: "Erro na busca dos requerimentos para registro de novos usuarios"
        }
    }
}