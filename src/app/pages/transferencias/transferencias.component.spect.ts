import { TransferenciasComponent } from './transferencias.component';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs'; // Importa 'of' para simular observables

describe('TransferenciasComponent', () => {
  let component: TransferenciasComponent;
  let http: HttpClient;
  let modalService: NgbModal;
  let router: Router;
  let toastr: ToastrService;
  let route: ActivatedRoute;

  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['get', 'delete', 'post']);
    modalService = jasmine.createSpyObj('NgbModal', ['open']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    toastr = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);
    route = {
      snapshot: {
        paramMap: jasmine.createSpyObj('ParamMap', ['get']),
      },
    } as any;

    component = new TransferenciasComponent(modalService, router, toastr, route, {} as any, {} as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set user and fetch recipients on initialization', async () => {
      const userId = 1;
      (component as any).getRecipients = jasmine.createSpy().and.returnValue(Promise.resolve());
      (component as any).authService = {
        getUserId: jasmine.createSpy().and.returnValue(userId),
      } as any;

      await component.ngOnInit();

      expect((component as any).authService.getUserId).toHaveBeenCalled();
      expect((component as any).getRecipients).toHaveBeenCalled();
    });
  });

  describe('getRecipients', () => {
    it('should fetch recipients and set the recipients property', async () => {
      const userId = 1;
      const recipients = [{ id: 1, name: 'John Doe' }];
      (http.get as jasmine.Spy).and.returnValue(Promise.resolve({ status: 'OK', data: recipients }));
      (component as any).authService = {
        getUserId: jasmine.createSpy().and.returnValue(userId),
      } as any;

      await (component as any).getRecipients();

      expect(http.get).toHaveBeenCalledWith(`recipients/${userId}`);
      expect(toastr.error).not.toHaveBeenCalled();
      expect((component as any).recipients).toEqual(recipients);
      expect((component as any).isLoadingRecipients).toBe(false);
    });

    it('should show an error toastr message on error', async () => {
      const userId = 1;
      (http.get as jasmine.Spy).and.returnValue(Promise.reject());
      (component as any).authService = {
        getUserId: jasmine.createSpy().and.returnValue(userId),
      } as any;

      await (component as any).getRecipients();

      expect(http.get).toHaveBeenCalledWith(`recipients/${userId}`);
      expect(toastr.error).toHaveBeenCalledWith('Error message', 'Error.');
      expect((component as any).recipients).toEqual([]);
      expect((component as any).isLoadingRecipients).toBe(false);
    });
  });

  describe('deleteRecipient', () => {
    it('should delete the recipient and show a success toastr message', async () => {
      const recipientId = 1;
      (http.delete as jasmine.Spy).and.returnValue(Promise.resolve({ status: 'OK', message: 'Recipient deleted.' }));

      await component.deleteRecipient(recipientId);

      expect(http.delete).toHaveBeenCalledWith(`recipients/${recipientId}`);
      expect(toastr.success).toHaveBeenCalledWith('Recipient deleted.', 'Destinatario.');
      expect((component as any).isLoadingRecipientsModal).toBe(false);
      expect((component as any).getRecipients).toHaveBeenCalled();
    });

    it('should show an error toastr message on error', async () => {
      const recipientId = 1;
      (http.delete as jasmine.Spy).and.returnValue(Promise.resolve({ status: 'error', message: 'Error deleting recipient.' }));

      await component.deleteRecipient(recipientId);

      expect(http.delete).toHaveBeenCalledWith(`recipients/${recipientId}`);
      expect(toastr.error).toHaveBeenCalledWith('Error deleting recipient.', 'Error');
      expect((component as any).isLoadingRecipientsModal).toBe(false);
      expect((component as any).getRecipients).not.toHaveBeenCalled();
    });
  });

  describe('sendTransaction', () => {
    it('should send the transaction and show a success toastr message', async () => {
      (component as any).isFormValid = jasmine.createSpy().and.returnValue(true);
      (component as any).resetTransactions = jasmine.createSpy();
      (component as any).authService = {
        getAccountNumber: jasmine.createSpy().and.returnValue(123),
      } as any;
      (component as any).selectedDestinatario = { recipientAccountNumber: 456 };
      (component as any).amountValue = 100;
      (http.post as jasmine.Spy).and.returnValue(Promise.resolve({ status: 'OK', message: 'Transaction successful.' }));

      await (component as any).sendTransaction();

      expect((component as any).isFormValid).toHaveBeenCalled();
      expect((component as any).resetTransactions).toHaveBeenCalled();
      expect(http.post).toHaveBeenCalledWith('transactions', {
        senderAccountNumber: 123,
        receiverAccountNumber: 456,
        amount: 100,
      });
      expect(toastr.success).toHaveBeenCalledWith('Transaction successful.', 'Transaccion.');
      expect((component as any).isLoadingTransactions).toBe(false);
    });

    it('should show an error toastr message on error', async () => {
      (component as any).isFormValid = jasmine.createSpy().and.returnValue(true);
      (component as any).authService = {
        getAccountNumber: jasmine.createSpy().and.returnValue(123),
      } as any;
      (component as any).selectedDestinatario = { recipientAccountNumber: 456 };
      (component as any).amountValue = 100;
      (http.post as jasmine.Spy).and.returnValue(Promise.resolve({ status: 'error', message: 'Error processing transaction.' }));

      await (component as any).sendTransaction();

      expect((component as any).isFormValid).toHaveBeenCalled();
      expect(http.post).toHaveBeenCalledWith('transactions', {
        senderAccountNumber: 123,
        receiverAccountNumber: 456,
        amount: 100,
      });
      expect(toastr.error).toHaveBeenCalledWith('Error processing transaction.', 'Error');
      expect((component as any).isLoadingTransactions).toBe(false);
    });

    it('should show a warning toastr message if form is invalid', async () => {
      (component as any).isFormValid = jasmine.createSpy().and.returnValue(false);

      await (component as any).sendTransaction();

      expect((component as any).isFormValid).toHaveBeenCalled();
      expect(http.post).not.toHaveBeenCalled();
      expect(toastr.warning).toHaveBeenCalledWith('Por favor complete todos los campos.', 'Advertencia');
      expect((component as any).isLoadingTransactions).toBe(false);
    });
  });

  describe('isFormValid', () => {
    it('should return true if selectedDestinatario, recipientAccountNumber, and amountValue are valid', () => {
      (component as any).selectedDestinatario = { recipientAccountNumber: 12345 };
      (component as any).amountValue = 100;

      const result = (component as any).isFormValid();

      expect(result).toBe(true);
    });

    it('should return false if selectedDestinatario or recipientAccountNumber are not valid', () => {
      (component as any).selectedDestinatario = null;
      (component as any).amountValue = 100;

      const result = (component as any).isFormValid();

      expect(result).toBe(false);
    });

    it('should return false if amountValue is not valid', () => {
      (component as any).selectedDestinatario = { recipientAccountNumber: 12345 };
      (component as any).amountValue = 0;

      const result = (component as any).isFormValid();

      expect(result).toBe(false);
    });
  });

  describe('goToRecipients', () => {
    it('should navigate to the "destinatarios" URL', () => {
      component.goToRecipients();

      expect(router.navigateByUrl).toHaveBeenCalledWith('destinatarios');
    });
  });

});
