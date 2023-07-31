import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: AuthService;
  let router: Router;
  let toastr: ToastrService;

  beforeEach(() => {
    // Crea instancias mock de los servicios necesarios
    authService = jasmine.createSpyObj('AuthService', ['login', 'register']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    toastr = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);

    component = new LoginComponent(authService, router, toastr);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onLoginSubmit', () => {
    it('should navigate to home when login is successful', async () => {
      // Configura el comportamiento esperado del AuthService
      (authService.login as jasmine.Spy).and.returnValue(Promise.resolve({ status: 'OK' }));

      component.email = 'test@example.com';
      component.password = 'password123';

      await component.onLoginSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(component.isLoading).toBe(false);
    });

    it('should show an error toastr message when login fails', async () => {
      // Configura el comportamiento esperado del AuthService
      (authService.login as jasmine.Spy).and.returnValue(Promise.resolve({ status: 'error' }));

      component.email = 'test@example.com';
      component.password = 'incorrectPassword';

      await component.onLoginSubmit();

      expect(toastr.error).toHaveBeenCalledWith('Usuario o Contraseña Invalido.', 'Login');
      expect(component.isLoading).toBe(false);
    });
  });


  describe('isFormValid', () => {
    it('should return false when any required field is empty', () => {
      component.registerForm = {
        name: 'John Doe',
        email: 'john@example.com',
        address: '',
        phone: '123-456-7890',
        password: 'securePassword',
        repeatPassword: 'securePassword'
      };

      expect(component.isFormValid()).toBe(false);
    });

    it('should return false when passwords do not match', () => {
      component.registerForm = {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        phone: '123-456-7890',
        password: 'securePassword',
        repeatPassword: 'differentPassword' // Contraseña repetida diferente
      };

      expect(component.isFormValid()).toBe(false);
    });

    it('should return true when all required fields are filled and passwords match', () => {
      component.registerForm = {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        phone: '123-456-7890',
        password: 'securePassword',
        repeatPassword: 'securePassword'
      };

      expect(component.isFormValid()).toBe(true);
    });
  });

  describe('resetForm', () => {
    it('should reset the registerForm object', () => {
      component.registerForm = {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        phone: '123-456-7890',
        password: 'securePassword',
        repeatPassword: 'securePassword'
      };

      component.resetForm();

      expect(component.registerForm).toEqual({
        name: '',
        email: '',
        address: '',
        phone: '',
        password: '',
        repeatPassword: ''
      });
    });
  });

  
});
