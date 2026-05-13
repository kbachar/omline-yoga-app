
import { Routes } from '@angular/router';
import { ClassesPageComponent } from './classes-page-component/classes-page.component';
import { HomePageComponent } from './home-page-component/home-page-component';

export const routes: Routes = [
	{
		path: '',
		component: HomePageComponent
	},
	{
		path: 'classes',
		component: ClassesPageComponent
	}
];
