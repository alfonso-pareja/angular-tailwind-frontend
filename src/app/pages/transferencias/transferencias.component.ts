import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../services/auth.service";
import { CLPCurrencyPipe } from "src/app/pipes/currency.pipe";
import { RequestService } from "src/app/services/request.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Recipient } from "src/app/interfaces/recipients.interface";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-transferencias",
  templateUrl: "./transferencias.component.html",
  styleUrls: ["./transferencias.component.scss"]
})
export class TransferenciasComponent implements OnInit {
  @ViewChild('modalToggle') modalToggle: any;
  recipients!: Recipient[];
  selectedDestinatario: any;
  isLoadingRecipients: boolean = false;
  isLoadingRecipientsModal: boolean = false;
  isLoadingTransactions: boolean = false;
  amountValue: number = 0;
  formattedValue: string = "";

  constructor(
    private http: HttpClient,
    public modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private request: RequestService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.getRecipients();

    // Obtener el accountNumber de la URL y seleccionar automáticamente el destinatario si corresponde
    const accountNumberFromURL =
      this.route.snapshot.paramMap.get("accountNumber") || 0;

    if (Number(accountNumberFromURL) !== 0) {
      this.selectedDestinatario = this.recipients.find(
        (destinatario) =>
          destinatario.recipientAccountNumber === accountNumberFromURL
      );

      console.log(this.selectedDestinatario);
    }
  }

  formatValue() {
    this.formattedValue = new CLPCurrencyPipe().transform(this.amountValue);
  }

  async getRecipients() {
    this.isLoadingRecipients = true;
    const userId = this.authService.getUserId();
    this.recipients = await this.request
      .get(`recipients/${userId}`)
      .then((response) => {
        if (response.status === "error")
          this.toastr.error(response.message, "Error.");

        return response;
      })
      .then((response) => response.data as Recipient[])
      .catch(() => {
        return [] as Recipient[];
      });
    this.isLoadingRecipients = false;
  }

  openModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  async deleteRecipient(id: number) {
    this.isLoadingRecipientsModal = true;
    await this.request
      .delete(`recipients/${id}`)
      .then((response) => {
      if (response.status === "error") {
        return this.toastr.error(response.message, "Error");
      }
      return this.toastr.success(response.message, "Destinatario.");
    });
    this.isLoadingRecipientsModal = false;
    this.getRecipients();
  }

  toSelectRecipient(accounNumber: number) {
    console.log(accounNumber)
    this.selectedDestinatario = this.recipients.find(
      (destinatario) => Number(destinatario.recipientAccountNumber) == accounNumber
    );
    console.log(this.selectedDestinatario);
    this.cerrarModal();

  }


  async sendTransaction(){
    if (!this.isFormValid()) {
      this.toastr.warning(
        "Por favor complete todos los campos.",
        "Advertencia"
      );
      return;
    }

    const transferencia = {
      senderAccountNumber: this.authService.getAccountNumber(),
      receiverAccountNumber: this.selectedDestinatario.recipientAccountNumber,
      amount: this.amountValue
    };
    this.isLoadingTransactions = true;
    await this.request
      .post('transactions', transferencia)
      .then((response) => {
        if (response.status === "error") {
          return this.toastr.error(response.message, "Error");
        }
        return this.toastr.success(response.message, "Transaccion.");
      })
    this.isLoadingTransactions = false;
    this.resetTransactions();
  }

  resetTransactions() {
    this.selectedDestinatario = null;
    this.amountValue = 0
  }

  isFormValid(){
    return (
      this.selectedDestinatario &&
      this.selectedDestinatario.recipientAccountNumber &&
      !isNaN(Number(this.amountValue)) &&
      this.amountValue > 0
    )
  }



  goToRecipients(){
    this.router.navigateByUrl('destinatarios')
  }

  cerrarModal() {
    this.modalToggle.nativeElement.checked = false;
  }
}
