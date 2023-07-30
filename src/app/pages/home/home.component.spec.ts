import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { of } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { Transactions } from 'src/app/interfaces/transactions.interface';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let requestService: jasmine.SpyObj<RequestService>;

  const mockUser: User = {
    "userId": 8,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "address": "123 Main St",
    "phone": "1234567890",
    "created": "2023-07-26T21:09:16.000Z",
    "updated": "2023-07-26T21:09:16.000Z",
    "accountNumber": "3807783189",
    "accountType": "Cuenta Corriente",
    "bank": "Banco Ripley",
    "balance": 251,
    "accountId": 7,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTY5MDY5NDc2MCwiZXhwIjoxNjkwNjk4MzYwfQ.ahkm1zSjOZpgQ0hP36OzQbnSGwQx77qyAxMJ6K5RWFc'
  };
  
  const mockTransactions: Transactions[] = [
    { 
      transactionId: 1, 
      senderAccountId: 123, 
      receiverAccountName: 'Recipient 1', 
      receiverAccountId: 9, 
      amount: 1,
      transactionNumber: 12345,
      transactionDate: '2023-07-27',
      transactionType: 'transfer',
      status: 'completed',
      updated: '2023-07-27'
    },
    { 
      transactionId: 2, 
      senderAccountId: 456, 
      receiverAccountName: 'Recipient 2', 
      receiverAccountId: 9, 
      amount: 1,
      transactionNumber: 67890,
      transactionDate: '2023-07-28',
      transactionType: 'transfer',
      status: 'completed',
      updated: '2023-07-28'
    },
  ];

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser', 'setUser']);
    const requestServiceSpy = jasmine.createSpyObj('RequestService', ['get']);

    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: RequestService, useValue: requestServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    requestService = TestBed.inject(RequestService) as jasmine.SpyObj<RequestService>;

    authService.getUser.and.returnValue(mockUser);
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should set user info on ngOnInit', fakeAsync(() => {
    // requestService.get.withArgs(`user/${mockUser.userId}`).and.returnValue(of({ data: mockUser }).toPromise());

    component.ngOnInit();
    tick();

    expect(authService.setUser).toHaveBeenCalledWith(mockUser);
    expect(component.user).toEqual(mockUser);
  }));

  fit('should get last transactions on ngOnInit', fakeAsync(() => {
    // requestService.get.withArgs(`transactions/${mockUser.accountId}?limit=5`).and.returnValue(of({ data: mockTransactions }).toPromise());

    component.ngOnInit();
    tick();

    expect(component.transactions).toEqual(mockTransactions);
  }));

  fit('should set isLoading to true while loading data', fakeAsync(() => {
    // requestService.get.and.returnValue(new Promise(() => {})); // Simulate a pending promise

    component.ngOnInit();

    expect(component.isLoading).toBeTrue();
    tick();
  }));

  fit('should set isLoading to false after loading data', fakeAsync(() => {
    // requestService.get.and.returnValue(Promise.resolve({ data: [] })); // Simulate a resolved promise

    component.ngOnInit();
    tick();

    expect(component.isLoading).toBeFalse();
  }));
});
