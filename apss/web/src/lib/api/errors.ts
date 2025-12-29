import axios from "axios";

export function getApiErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 401) return "Correo o contraseña incorrectos.";
        if (status === 409) return "Ese correo ya está registrado.";
        if (status === 400) return "Revisa los datos ingresados.";
        if (status === 403) return "No tienes permisos para esta acción.";
        if (status && status >= 500) return "Error del servidor. Intenta nuevamente.";

        return "No se pudo completar la solicitud. Verifica tu conexión.";
    }

    return "Ocurrió un error inesperado.";
}
