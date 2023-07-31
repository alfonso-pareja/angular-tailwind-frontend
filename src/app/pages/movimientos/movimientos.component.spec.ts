import { MovimientosComponent } from './movimientos.component';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { Transactions } from 'src/app/interfaces/transactions.interface';

describe('MovimientosComponent', () => {
  let component: MovimientosComponent;
  let authService: AuthService;
  let requestService: RequestService;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getUser']);
    requestService = jasmine.createSpyObj('RequestService', ['get']);

    component = new MovimientosComponent(authService, requestService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('getLastTransactions', () => {
    it('should fetch last transactions for the user and set the transactions property', async () => {
      const transactions: Transactions[] = [
        { transactionId: 1, amount: 100 },
        { transactionId: 2, amount: -50 }
      ];
      (requestService.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: transactions }));
      component.user = { userId: 1, accountId: 2 };

      await component.getLastTransactions();

      expect(requestService.get).toHaveBeenCalledWith('transactions/2');
      expect(component.transactions).toEqual(transactions);
      expect(component.isLoading).toBe(false);
    });

    it('should set transactions to an empty array on error', async () => {
      (requestService.get as jasmine.Spy).and.returnValue(Promise.reject());
      component.user = { userId: 1, accountId: 2 };

      await component.getLastTransactions();

      expect(requestService.get).toHaveBeenCalledWith('transactions/2');
      expect(component.transactions).toEqual([]);
      expect(component.isLoading).toBe(false);
    });
  });
});
