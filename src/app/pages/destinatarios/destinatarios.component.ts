import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Recipient } from "src/app/interfaces/recipients.interface";
import { RequestService } from "src/app/services/request.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: "app-destinatarios",
  templateUrl: "./destinatarios.component.html",
  styleUrls: ["./destinatarios.component.scss"]
})
export class DestinatariosComponent implements OnInit {
  public recipients!: Recipient[];
  public isLoading: boolean = false;
  public isLoadingAddRecipient = false;
  public form = {
    name: "",
    accountNumber: 0
  };

  constructor(
    private requestService: RequestService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getRecipients();
  }

  /**
   * Obtiene los destinarios guardados por el usuario.
   */
  async getRecipients() {
    this.isLoading = true;
    const user = this.authService.getUser();
    try {
      const recipients = await this.requestService.get(`recipients/${user.userId}`);
      this.recipients = recipients.data as Recipient[];
    } catch (error) {
      this.recipients = [];
    }
    this.isLoading = false;
  }

  /**
   * Agrega un nuevo destinatario.
   */
  async addRecipients() {
    if (!this.isFormValid()) {
      this.toastr.warning("Por favor complete todos los campos.", "Advertencia");
      return;
    }
    this.isLoadingAddRecipient = true;
    const user = this.authService.getUser();
    const recipientForm = {
      userId: user.userId,
      recipientName: this.form.name,
      recipientAccountNumber: this.form.accountNumber
    };

    try {
      const response = await this.requestService.post("recipients", recipientForm);
      if (response.status === "error") {
        this.toastr.error(response.message, "Error");
      } else {
        this.toastr.success(response.message, "Nuevo destinatario.");
        this.getRecipients();
      }
    } catch (error) { }

    this.resetForm();
    this.isLoadingAddRecipient = false;
  }

  /**
   * Elimina un destinatario.
   * @param id Id del destinatario a eliminar.
   */
  async deleteRecipient(id: number) {
    this.isLoading = true;
    try {
      const response = await this.requestService.delete(`recipients/${id}`);
      if (response.status === "error") {
        this.toastr.error(response.message, "Error");
      } else {
        this.toastr.success(response.message, "Destinatario eliminado.");
        this.getRecipients();
      }
    } catch (error) { }
    this.isLoading = false;
  }

  /**
   * Redirecciona a la pagina de transferencias.
   * @param accountNumber Numero de cuenta del destinatario.
   */
  toTransaction(accountNumber: number) {
    this.router.navigateByUrl('/transferencias/' + accountNumber);
  }

  /**
   * Verifica si el formulario es valido.
   */
  isFormValid() {
    const isAccountNumberNumeric = !isNaN(Number(this.form.accountNumber));
    const isFormFilled =
      this.form.name.trim() !== "" &&
      isAccountNumberNumeric;

    return isFormFilled;
  }

  /**
   * Reinicia el formulario.
   */
  resetForm() {
    this.form.name = "";
    this.form.accountNumber = 0;
  }
}
