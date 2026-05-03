import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { AuthDialogComponent } from './app/layout/Auth/auth-dialog.component';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { BirthdayComponent } from './app/layout/birthday/birthday.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'Noor', pathMatch: 'full' },
    { path: 'Noor', component: BirthdayComponent },
    
    // { path: '', redirectTo: 'login', pathMatch: 'full' },
    // { path: 'login', component: AuthDialogComponent },
    // {
    //     path: '',
    //     component: AppLayout,
    //     children: [
    //         { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    //         { path: 'dashboard', component: Dashboard },
    //         { path: 'layout-auth', component: AuthDialogComponent },
    //         { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
    //         { path: 'documentation', component: Documentation },
    //         { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
    //     ]
    // },
    // { path: 'landing', component: Landing },
    // { path: 'notfound', component: Notfound },
    // { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    // { path: '**', redirectTo: '/notfound' }
];
