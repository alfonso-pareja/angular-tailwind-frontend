import { Component, OnInit } from "@angular/core";
import { Transactions } from "src/app/interfaces/transactions.interface";
import { User } from "src/app/interfaces/user.interface";
import { AuthService } from "src/app/services/auth.service";
import { RequestService } from "src/app/services/request.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  public user!: User;
  public transactions!: Transactions[];
  isLoading: boolean = false;
  constructor(
    private authService: AuthService,
    private requestService: RequestService
  ) {}

  async ngOnInit() {
    this.user = this.authService.getUser();
    this.isLoading = true;
    await Promise.all([
      this.getUserInfo(),
      this.getLastTransactions()
    ])
    this.isLoading = false;
  }

  async getLastTransactions() {
    this.transactions = await this.requestService
      .get(`transactions/${this.user.accountId}?limit=5`)
      .then((response) =>  response.data as Transactions[])
      .catch(() => { return [] as Transactions[] });
  }

  async getUserInfo(){
    const userInfo: User = await this.requestService
      .get(`user/${this.user.userId}`)
      .then((response) => response.data as User)
      .catch(() => { return {} as User });
    
    this.authService.setUser(userInfo);
    this.user = this.authService.getUser()
  }
}
