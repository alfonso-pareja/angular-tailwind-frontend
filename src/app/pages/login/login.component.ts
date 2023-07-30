import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IRegister } from "src/app/interfaces/register.interface";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  isLoading: boolean = false;
  isLoadingForm: boolean = false;
  registerForm: IRegister = {
    name: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    repeatPassword: ""
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}


  /**
   * Iniciar sesion
   */
  async onLoginSubmit() {
    this.isLoading = true;
    await this.authService
      .login(this.email, this.password)
      .then((response) => {
        if (response.status === "OK") this.router.navigate(["/home"]);
        if (response.status === "error") {
          this.toastr.error("Usuario o Contraseña Invalido.", "Login");
        }
      })
      .catch(() => {});
    this.isLoading = false;
  }

  /**
   * Registrar un nuevo usuario
   * @param form
   * @returns
   */
  onRegisterSubmit() {
    if (!this.isFormValid()) {
      this.toastr.warning(
        "Por favor complete todos los campos y asegúrese de que las contraseñas coincidan.",
        "Advertencia"
      );
      return;
    }

    this.isLoadingForm = true;

    const newUser = {
      name: this.registerForm.name,
      email: this.registerForm.email,
      address: this.registerForm.address,
      phone: this.registerForm.phone,
      password: this.registerForm.password,
      repeat_password: this.registerForm.repeatPassword
    };

    this.authService.register(newUser).then((response) => {
      if (response.status === "OK") {
        this.toastr.success("Usuario creado exitosamente.", "Registro");
        this.resetForm();
      } else {
        this.toastr.error(response.message, "Registro");
      }
      this.isLoadingForm = false;
    });
  }

  /**
   * Validar formulario
   * @returns 
   */
  public isFormValid(): boolean {
    return (
      this.registerForm.name.trim() !== "" &&
      this.registerForm.email.trim() !== "" &&
      this.registerForm.address.trim() !== "" &&
      this.registerForm.phone.trim() !== "" &&
      this.registerForm.password.trim() !== "" &&
      this.registerForm.password === this.registerForm.repeatPassword
    );
  }

  public resetForm() {
    this.registerForm = {
      name: "",
      email: "",
      address: "",
      phone: "",
      password: "",
      repeatPassword: ""
    };
  }
}
