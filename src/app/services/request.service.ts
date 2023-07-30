import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environments/environment";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class RequestService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  private getHeaders(): HttpHeaders {
    const token = AuthService.getToken();
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `${token}`
    });
  }

  public postWithoutToken(endpoint: string, body: any) {
    const url = `${this.apiBaseUrl}/${endpoint}`;
    return this.http
      .post<any>(url, body)
      .toPromise()
      .catch((error) => {
        throw error;
      });
  }

  public get(endpoint: string): Promise<any> {
    const url = `${this.apiBaseUrl}/${endpoint}`;
    const headers = this.getHeaders();

    return this.http
      .get(url, { headers })
      .toPromise()
      .catch((error) => {
        this.handleErrorResponse(error);
        throw error;
      });
  }

  public post(endpoint: string, data: any): Promise<any> {
    const url = `${this.apiBaseUrl}/${endpoint}`;
    const headers = this.getHeaders();

    return this.http
      .post(url, data, { headers })
      .toPromise()
      .catch((error) => {
        this.handleErrorResponse(error);
        throw error;
      });
  }

  public delete(endpoint: string): Promise<any> {
    const url = `${this.apiBaseUrl}/${endpoint}`;
    const headers = this.getHeaders();

    return this.http
      .delete(url, { headers })
      .toPromise()
      .catch((error) => {
        this.handleErrorResponse(error);
        throw error;
      });
  }

  private handleErrorResponse(error: any) {
    if (error.status === 403) {
      // Token inválido o expirado
      AuthService.removeStorageParams();
      this.toastr.error(
        "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
        "Token expirado"
      );
      this.router.createUrlTree(["/login"]);
      window.location.reload();
    }
  }
}
