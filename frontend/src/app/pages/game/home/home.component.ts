import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActionController, DragonController, GetUserDto, UserController, UserDto } from 'src/app/client/api';
import { DateService } from 'src/app/common/services/date.service';
import { RepositoryService } from 'src/app/common/services/repository.service';
import { EXPEDITION_REPORTS, StoreService } from 'src/app/common/services/store.service';
import { DisplayExpeditionReport } from 'src/app/core/definitions/expeditions';
import { EngineService } from 'src/app/core/services/engine.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  users: UserDto[] = [];

  reports!: DisplayExpeditionReport[];
  reportsLoading!: boolean;

  constructor(
    private translateService: TranslateService,
    private userController: UserController,
    private engineService: EngineService,
    private storeService: StoreService,
  ) {}

  ngOnInit(): void {
    this.reportsLoading = false;
    this.reports = [];

    this.checkExpeditionsFinished();
    this.getActiveUsers();
  }

  getActiveUsers() {
    const dto: GetUserDto = {};
    this.userController.getAll(dto).subscribe(x => {
      this.users = x.data;
    });
  }

  checkExpeditionsFinished() {
    this.reportsLoading = true;
    this.engineService.getExpeditionReports().subscribe(() => {
      this.reportsLoading = false;
      const savedReports = this.storeService.getComplexItem<DisplayExpeditionReport[]>(EXPEDITION_REPORTS);
      if (savedReports && savedReports.length > 0) {
        this.reports = savedReports.map(r => {
          return {
            ...r,
            expeditionName: this.translateService.instant(`expeditions.${r.expeditionName!}`),
          };
        });
      }
    }, () => this.reportsLoading = false);
  }

}
