import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { User } from "../interfaces/user.interface";
import { RequestService } from "./request.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private requestService: RequestService, private router: Router) {}

  /**
   * Realizar login y setear parametros posterior al login
   * @param email
   * @param password
   * @returns
   */
  login(email: string, password: string) {
    return this.requestService
      .postWithoutToken("login", { email, password })
      .then((response) => {
        if (response.status === "OK"){
          this.setStorageParams({
            user: JSON.stringify(response.data),
            token: response.data.token
          });
        }

        return response
      });
  }

  /**
   * Registrar nuevo usuario
   * @param newUser 
   * @returns 
   */
  register(newUser: any): Promise<any> {
    return this.requestService
      .postWithoutToken('register', newUser)
      .then((response) => { return response })
      .catch((error) => {
        throw error;
      });
  }

  /**
   * Cerrar sesion
   */
  logout() {
    AuthService.removeStorageParams();
    this.router.createUrlTree(["/login"]);
    window.location.reload();
  }


  /**
   * Guardar parametros en storage
   * @param args
   */
  setStorageParams(args: { user: string; token: string }) {
    localStorage.setItem("user", args.user);
    localStorage.setItem("token", args.token);
  }

  /**
   * Eliminar parametros del storage
   */
  static removeStorageParams() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  /**
   * Método para obtener el token almacenado
   * @returns
   */
  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Método para verificar si el usuario está autenticado
   * @returns
   */
  isAuthenticated(): boolean {
    return !!AuthService.getToken();
  }

  /**
   * Método para obtener el ID del usuario
   * @returns
   */
  getUserId(): number {
    return this.isAuthenticated() ? this.getUser().userId : 0;
  }

  /**
   * Método para obtener el número de cuenta del usuario
   * @returns
   */
  getAccountNumber(): string {
    return this.isAuthenticated() ? this.getUser().accountNumber : "";
  }

  /**
   * Metodo para obtener el numero de cuenta del usuario
   * @returns
   */
  getAccountId(): number {
    return this.isAuthenticated() ? this.getUser().accountId : 0;
  }

  /**
   * Metodo para obtener usuario desde localstorage
   * @returns
   */
  getUser(): User {
    try {
      return JSON.parse(localStorage.getItem("user") || "");
    } catch (error) {
      return {} as User;
    }
  }

  /**
   * Metodo actualiza la informacion del usuario
   * @param userInfo 
   */
  setUser(userInfo: User){
    const thisUser = this.getUser();
    localStorage.setItem("user", JSON.stringify({ ...userInfo, token: thisUser.token }));
  }
}
