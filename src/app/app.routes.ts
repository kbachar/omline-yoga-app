
import { Routes } from '@angular/router';
import { ClassesPageComponent } from './classes-page-component/classes-page.component';
import { HomePageComponent } from './home-page-component/home-page-component';
import { TeacherSubscribePage } from './teacher-subscribe-page-component/teacher-subscribe-page/teacher-subscribe-page';
import { Teacher } from './teacher-component/teacher/teacher';

export const routes: Routes = [
	{
		path: '',
		component: HomePageComponent
	},
	{
		path: 'classes/:id',
		component: ClassesPageComponent
	},
	{
		path: 'teacher-subscribe-page',
		component: TeacherSubscribePage
	},
	{
		path: 'teacher',
		component: Teacher
	}
];
