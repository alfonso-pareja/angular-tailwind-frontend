import { DestinatariosComponent } from './destinatarios.component';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

describe('DestinatariosComponent', () => {
  let component: DestinatariosComponent;
  let authService: AuthService;
  let requestService: RequestService;
  let toastr: ToastrService;
  let router: Router;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getUser']);
    requestService = jasmine.createSpyObj('RequestService', ['get', 'post', 'delete']);
    toastr = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    component = new DestinatariosComponent(requestService, authService, router, toastr);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch recipients on initialization', async () => {
      const userId = 1;
      const user = { userId: userId };
      (authService.getUser as jasmine.Spy).and.returnValue(user);
      (requestService.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: [] }));

      await component.ngOnInit();

      expect(authService.getUser).toHaveBeenCalled();
      expect(requestService.get).toHaveBeenCalledWith(`recipients/${userId}`);
      expect((component as any).recipients).toEqual([]);
      expect((component as any).isLoading).toBe(false);
    });

    it('should show an error toastr message on error', async () => {
      (authService.getUser as jasmine.Spy).and.returnValue({ userId: 1 });
      (requestService.get as jasmine.Spy).and.returnValue(Promise.reject());

      await component.ngOnInit();

      expect(toastr.error).toHaveBeenCalledWith('Error message', 'Error.');
      expect((component as any).recipients).toEqual([]);
      expect((component as any).isLoading).toBe(false);
    });
  });

  describe('getRecipients', () => {
    it('should fetch recipients and set the recipients property', async () => {
      const userId = 1;
      (authService.getUser as jasmine.Spy).and.returnValue({ userId: userId });
      const recipients = [{ id: 1, recipientName: 'John Doe', recipientAccountNumber: 12345 }];
      (requestService.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: recipients }));

      await component.getRecipients();

      expect(authService.getUser).toHaveBeenCalled();
      expect(requestService.get).toHaveBeenCalledWith(`recipients/${userId}`);
      expect(toastr.error).not.toHaveBeenCalled();
      expect((component as any).recipients).toEqual(recipients);
      expect((component as any).isLoading).toBe(false);
    });

    it('should show an error toastr message on error', async () => {
      (authService.getUser as jasmine.Spy).and.returnValue({ userId: 1 });
      (requestService.get as jasmine.Spy).and.returnValue(Promise.reject());

      await component.getRecipients();

      expect(authService.getUser).toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalledWith('Error message', 'Error.');
      expect((component as any).recipients).toEqual([]);
      expect((component as any).isLoading).toBe(false);
    });
  });

  describe('addRecipients', () => {
    it('should add a new recipient and show a success toastr message', async () => {
      (component as any).form = { name: 'John Doe', accountNumber: 12345 };
      (authService.getUser as jasmine.Spy).and.returnValue({ userId: 1 });
      (requestService.post as jasmine.Spy).and.returnValue(Promise.resolve({ status: 'OK', message: 'Recipient added.' }));

      await (component as any).addRecipients();

      expect((component as any).isFormValid).toHaveBeenCalled();
      expect(authService.getUser).toHaveBeenCalled();
      expect(requestService.post).toHaveBeenCalledWith('recipients', {
        userId: 1,
        recipientName: 'John Doe',
        recipientAccountNumber: 12345,
      });
      expect(toastr.success).toHaveBeenCalledWith('Recipient added.', 'Nuevo destinatario.');
      expect((component as any).getRecipients).toHaveBeenCalled();
      expect((component as any).resetForm).toHaveBeenCalled();
      expect((component as any).isLoadingAddRecipient).toBe(false);
    });

    it('should show an error toastr message on error', async () => {
      (component as any).form = { name: 'John Doe', accountNumber: 12345 };
      (authService.getUser as jasmine.Spy).and.returnValue({ userId: 1 });
      (requestService.post as jasmine.Spy).and.returnValue(Promise.resolve({ status: 'error', message: 'Error adding recipient.' }));

      await (component as any).addRecipients();

      expect((component as any).isFormValid).toHaveBeenCalled();
      expect(requestService.post).toHaveBeenCalledWith('recipients', {
        userId: 1,
        recipientName: 'John Doe',
        recipientAccountNumber: 12345,
      });
      expect(toastr.error).toHaveBeenCalledWith('Error adding recipient.', 'Error');
      expect((component as any).getRecipients).not.toHaveBeenCalled();
      expect((component as any).resetForm).not.toHaveBeenCalled();
      expect((component as any).isLoadingAddRecipient).toBe(false);
    });

    it('should show a warning toastr message if form is invalid', async () => {
      (component as any).isFormValid = jasmine.createSpy().and.returnValue(false);

      await (component as any).addRecipients();

      expect((component as any).isFormValid).toHaveBeenCalled();
      expect(requestService.post).not.toHaveBeenCalled();
      expect(toastr.warning).toHaveBeenCalledWith('Por favor complete todos los campos.', 'Advertencia');
      expect((component as any).getRecipients).not.toHaveBeenCalled();
      expect((component as any).resetForm).not.toHaveBeenCalled();
      expect((component as any).isLoadingAddRecipient).toBe(false);
    });
  });

  describe('deleteRecipient', () => {
    it('should delete the recipient and show a success toastr message', async () => {
      const recipientId = 1;
      (requestService.delete as jasmine.Spy).and.returnValue(Promise.resolve({ status: 'OK', message: 'Recipient deleted.' }));

      await component.deleteRecipient(recipientId);

      expect(requestService.delete).toHaveBeenCalledWith(`recipients/${recipientId}`);
      expect(toastr.success).toHaveBeenCalledWith('Recipient deleted.', 'Destinatario eliminado.');
      expect((component as any).getRecipients).toHaveBeenCalled();
      expect((component as any).isLoading).toBe(false);
    });

    it('should show an error toastr message on error', async () => {
      const recipientId = 1;
      (requestService.delete as jasmine.Spy).and.returnValue(Promise.resolve({ status: 'error', message: 'Error deleting recipient.' }));

      await component.deleteRecipient(recipientId);

      expect(requestService.delete).toHaveBeenCalledWith(`recipients/${recipientId}`);
      expect(toastr.error).toHaveBeenCalledWith('Error deleting recipient.', 'Error');
      expect((component as any).getRecipients).not.toHaveBeenCalled();
      expect((component as any).isLoading).toBe(false);
    });
  });

  describe('toTransaction', () => {
    it('should navigate to the "transferencias" URL with the recipient account number', () => {
      const accountNumber = 12345;

      component.toTransaction(accountNumber);

      expect(router.navigateByUrl).toHaveBeenCalledWith('/transferencias/' + accountNumber);
    });
  });

  describe('isFormValid', () => {
    it('should return true if form fields are valid', () => {
      (component as any).form = { name: 'John Doe', accountNumber: 12345 };

      const result = (component as any).isFormValid();

      expect(result).toBe(true);
    });

    it('should return false if form fields are not valid', () => {
      (component as any).form = { name: '', accountNumber: 0 };

      const result = (component as any).isFormValid();

      expect(result).toBe(false);
    });
  });

});
