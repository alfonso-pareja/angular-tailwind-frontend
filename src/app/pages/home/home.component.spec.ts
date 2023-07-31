import { HomeComponent } from './home.component';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { Transactions } from 'src/app/interfaces/transactions.interface';
import { User } from 'src/app/interfaces/user.interface';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let authService: AuthService;
  let requestService: RequestService;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getUser', 'setUser']);
    requestService = jasmine.createSpyObj('RequestService', ['get']);

    component = new HomeComponent(authService, requestService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set user and fetch data on initialization', async () => {
      const user = { userId: 1, accountId: 2 };
      (authService.getUser as jasmine.Spy).and.returnValue(user);
      spyOn(component, 'getUserInfo').and.returnValue(Promise.resolve());
      spyOn(component, 'getLastTransactions').and.returnValue(Promise.resolve());

      await component.ngOnInit();

      expect(authService.getUser).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
      expect(component.getUserInfo).toHaveBeenCalled();
      expect(component.getLastTransactions).toHaveBeenCalled();
    });
  });

  describe('getLastTransactions', () => {
    it('should fetch last transactions for the user and set the transactions property', async () => {
      const transactions: Transactions[] = [
        { transactionId: 1, amount: 100 },
        { transactionId: 2, amount: -50 }
      ];
  
      // Simular la llamada a requestService.get para que devuelva un resultado válido
      (requestService.get as jasmine.Spy).and.returnValue(Promise.resolve({ data: transactions }));
  
      // Asignar un valor válido a component.user
      component.user = { userId: 1, accountId: 2 } as User;
  
      await component.getLastTransactions();
  
      expect(requestService.get).toHaveBeenCalledWith('transactions/2?limit=5');
      expect(component.transactions).toEqual(transactions);
    });
  });
  
  

  describe('getUserInfo', () => {
    it('should set the user information', async () => {
      const userInfo: User = { userId: 1, name: 'John Doe', email: 'john@example.com' };
      (authService.getUser as jasmine.Spy).and.returnValue({ userId: 1 }); // Simular authService.getUser()
      
      // Simular correctamente la llamada a requestService.get con una respuesta válida
      (requestService.get as jasmine.Spy).withArgs('user/1').and.returnValue(Promise.resolve({ data: userInfo }));
  
      component.user = { userId: 1, accountId: 2 }; // Inicializar component.user
  
      await component.getUserInfo();
  
      expect(requestService.get).toHaveBeenCalledWith('user/1');
      expect(authService.setUser).toHaveBeenCalledWith(userInfo);
      expect(authService.getUser).toHaveBeenCalled();
    });
    
  
  });
  

  
});
