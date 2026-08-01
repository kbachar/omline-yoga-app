
import { Routes } from '@angular/router';
import { ClassesPageComponent } from './classes-page-component/classes-page.component';
import { HomePageComponent } from './home-page-component/home-page-component';
import { TeacherSubscribePage } from './teacher-subscribe-page-component/teacher-subscribe-page/teacher-subscribe-page';
import { Teacher } from './shared/teacher-component/teacher/teacher';
import { AdminDashboard } from './admin-dashboard-component/admin-dashboard/admin-dashboard';
import { TeachersComponent } from './teachers-component/teachers/teachers';
import { TeacherDashboard } from './teacher-dashboard-component/teacher-dashboard/teacher-dashboard';
import { authGuard } from './guards/auth-guard';
import { TeacherCompleteRegister } from './teacher-complete-register-component/teacher-complete-register/teacher-complete-register';
import { TeacherProfile } from './teacher-profile-component/teacher-profile/teacher-profile';
import { TeacherClasses } from './teacher-classes-component/teacher-classes/teacher-classes';
import { YogaClassDetails } from './shared/yoga-class-details-component/yoga-class-details/yoga-class-details';
import { Videos } from './videos-component/videos/videos';
import { Letters } from './Letters-component/letters/letters';
import { Letter } from './Letter-component/letter/letter';

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
		path: 'teacher-dashboard',
		canActivate: [authGuard],
		component: TeacherDashboard,
		children: [
			{ path: 'teacher-profile/:teacherId', component: TeacherProfile },
			{ path: 'teacher-classes/:teacherId', component: TeacherClasses },
			{ path: 'yoga-class-details/:classID', component: YogaClassDetails },
			{ path: 'yoga-class-details', component: YogaClassDetails }
		]
	},
	{
		path: 'admin-dashboard',
		canActivate: [authGuard],
		component: AdminDashboard,
		children: [
			{ path: 'teachers', component: TeachersComponent },
			{ path: 'teacher-profile/:teacherId', component: TeacherProfile },
			{ path: 'teacher-profile', component: TeacherProfile },
			{ path: 'videos', component: Videos },
			{ path: 'yoga-class-details/:classID', component: YogaClassDetails },
			{ path: 'letters', component: Letters },
			{ path: 'letter', component: Letter },
			{ path: 'letter/:letterID', component: Letter }
		]
	}
];
