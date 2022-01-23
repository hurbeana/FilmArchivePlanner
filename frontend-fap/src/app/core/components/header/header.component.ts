import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

@Component({
  selector: 'core-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  currentRoute: string;

  constructor(private router: Router) {}

  navigation = [
    {
      routerLink: '/',
      text: 'Home',
      icon: 'home',
    },
    {
      routerLink: '/movies',
      text: 'Movies',
      icon: 'movie',
    },
    {
      routerLink: '/festivals',
      text: 'Festivals',
      icon: 'event_note',
    },
    {
      routerLink: '/directors',
      text: 'Directors',
      icon: 'people',
    },
    {
      routerLink: '/contacts',
      text: 'Contacts',
      icon: 'person',
    },
    {
      routerLink: '/tags',
      text: 'Tag Manager',
      icon: 'label',
    },
    {
      routerLink: '/import',
      text: 'Import',
      icon: 'backup',
    },
  ];

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        //do something on start activity
      }

      if (event instanceof NavigationError) {
        // Handle error
        console.error(event.error);
      }

      if (event instanceof NavigationEnd) {
        //do something on end activity
        console.log('routeChange');
        const currentRoute = this.router.routerState.snapshot.url
          .split('/')[1]
          .replace('/', '');
        this.currentRoute =
          currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1);
      }
    });
  }
}
