import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { Transactions } from 'src/app/interfaces/transactions.interface';
import { User } from 'src/app/interfaces/user.interface';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})
export class MovimientosComponent implements OnInit {
  public user!: User;
  public transactions!: Transactions[];
  isLoading: boolean = false;
  constructor(
    private authService: AuthService,
    private requestService: RequestService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.getLastTransactions();
  }


  async getLastTransactions() {
    this.isLoading = true;
    this.transactions = await this.requestService
      .get(`transactions/${this.user.accountId}`)
      .then((response) => {
        return response.data as Transactions[];
      })
      .catch(() => {
        return [] as Transactions[];
      });
    this.isLoading = false;
  }

}
