
import { Routes } from '@angular/router';
import { ClassesPageComponent } from './classes-page-component/classes-page.component';
import { HomePageComponent } from './home-page-component/home-page-component';
import { TeacherSubscribePage } from './teacher-subscribe-page-component/teacher-subscribe-page/teacher-subscribe-page';
import { Teacher } from './teacher-component/teacher/teacher';
import { AdminDashboard } from './admin-dashboard-component/admin-dashboard/admin-dashboard';
import { TeachersComponent } from './teachers-component/teachers/teachers';
import { TeacherDashboard } from './teacher-dashboard-component/teacher-dashboard/teacher-dashboard';
import { authGuard } from './guards/auth-guard';

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
	},
	{
		path: 'teacher-dashboard',
		canActivate: [authGuard],
		component: TeacherDashboard
	},
	{
		path: 'admin-dashboard',
		canActivate: [authGuard],
		component: AdminDashboard,
		children: [
			{ path: '', redirectTo: 'teachers', pathMatch: 'full' },
			{ path: 'teachers', component: TeachersComponent }
		]
	}
];
