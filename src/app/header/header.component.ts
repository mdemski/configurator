import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NavbarComponent} from 'ng-uikit-pro-standard';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements AfterViewInit, OnInit, OnDestroy {
  userSub: Subscription;
  isAuthenticated = false;
  userEmail: string;

  @ViewChild('nav', {static: true}) nav: NavbarComponent;

  constructor(private renderer: Renderer2,
              private el: ElementRef,
              public translate: TranslateService,
              private authService: AuthService) {
    translate.addLangs(['pl', 'en', 'fr', 'de']);
    translate.setDefaultLang('pl');
  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user) {
        this.userEmail = user.email;
      }
    });
    // TODO znaleźć użytkownika z bazy używając email żeby zwrócić ID do routingu www.moja-aplikacja.pl/moje-konto/id
  }

  transformDropdowns() {
    const dropdownMenu = Array.from(this.el.nativeElement.querySelectorAll('.dropdown-menu'));
    const navHeight = this.nav.navbar.nativeElement.clientHeight + 'px';

    dropdownMenu.forEach((dropdown) => {
      this.renderer.setStyle(dropdown, 'transform', `translateY(${navHeight})`);
    });
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    const toggler = this.el.nativeElement.querySelector('.navbar-toggler');
    const togglerIcon = this.el.nativeElement.querySelector('.navbar-toggler-icon');
    if (event.target === toggler || event.target === togglerIcon) {
      console.log('test');
      setTimeout(() => {
        this.transformDropdowns();
      }, 351);
    }
  }

  @HostListener('document:scroll', ['$event'])
  onScroll() {
    this.transformDropdowns();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.transformDropdowns();
  }

  ngAfterViewInit() {
    this.transformDropdowns();
  }

  // TODO przygotować proces wyszukiwania
  onSubmit() {

  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
