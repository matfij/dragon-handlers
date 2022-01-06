import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserDto } from 'src/app/client/api';
import { EngineService } from 'src/app/core/services/engine.service';
import { NavigationItem } from '../../definitions/navigaion';
import { RepositoryService } from '../../services/repository.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

  @Input() currentLocation!: string;

  navigationItems: NavigationItem[] = [
    { label: 'game.home', path: 'home', icon: '', isActive: false },
    { label: 'game.adoptDragon', path: 'adopt-dragon', icon: '', isActive: false },
    { label: 'game.myDragons', path: 'my-dragons', icon: '', isActive: false },
    { label: 'game.inventory', path: 'inventory', icon: '', isActive: false },
    { label: 'game.expeditions', path: 'expeditions', icon: '', isActive: false },
    { label: 'game.arena', path: 'arena', icon: '', isActive: false },
  ];
  isCollapsed: boolean = true;
  user?: UserDto;

  constructor(
    private router: Router,
    private repositoryService: RepositoryService,
    private engineService: EngineService,
  ) {}

  ngOnInit(): void {
    this.navigationItems.forEach(x => x.isActive = this.currentLocation === x.path);

    this.user = this.repositoryService.getUserData();
  }

  navigate(path: string) {
    this.engineService.getExpeditionReports().subscribe();

    this.router.navigate(['game', path]);
  }

  logout() {
    this.repositoryService.logout();
  }

}
