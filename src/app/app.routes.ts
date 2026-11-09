
import { Routes } from '@angular/router';
import { ClassesPageComponent } from './classes-page-component/classes-page.component';
import { HomePageComponent } from './home-page-component/home-page-component';
import { TeacherSubscribePage } from './teacher-subscribe-page-component/teacher-subscribe-page/teacher-subscribe-page';
import { authGuard } from './guards/auth-guard';
import { SelectedClasses } from './selected-classes-component/selected-classes/selected-classes';
import { BeyondPracticePage } from './beyond-practice-page-component/beyond-practice-page/beyond-practice-page';
import { OurVisionPage } from './our-vision-page-component/our-vision-page/our-vision-page';
import { OurTeachersPage } from './our-teachers-page-component/our-teachers-page/our-teachers-page';
import { TeacherPage } from './teacher-page-component/teacher-page/teacher-page';
import { ContactUs } from './shared/contact-us-component/contact-us/contact-us';

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
		path: 'selected-classes',
		component: SelectedClasses
	},
	{
		path: 'teacher-subscribe-page',
		component: TeacherSubscribePage
	},
	{
		path: 'beyond-practice-page',
		component: BeyondPracticePage
	},
	{
		path: 'our-teachers-page',
		component: OurTeachersPage
	},
	{
		path: 'events-board-page',
		loadComponent: () =>
			import('./events-board-page-component/events-board-page-component/events-board-page-component')
				.then(m => m.EventsBoardPageComponent)
	},
	{
		path: 'teacher-page/:id',
		component: TeacherPage
	},
	{
		path: 'our-vision-page',
		component: OurVisionPage
	},
	{
		path: 'contact-us',
		component: ContactUs
	},
	{
		path: 'teacher-dashboard',
		canActivate: [authGuard],
		loadComponent: () => import('./teacher-dashboard-component/teacher-dashboard/teacher-dashboard').then(m => m.TeacherDashboard),
		children: [
			{ path: '', pathMatch: 'full', loadComponent: () => import('./teacher-home-page-component/teacher-home-page/teacher-home-page').then(m => m.TeacherHomePage) },
			{ path: 'teacher-profile/:teacherId', loadComponent: () => import('./teacher-profile-component/teacher-profile/teacher-profile').then(m => m.TeacherProfile) },
			{ path: 'teacher-classes/:teacherId', loadComponent: () => import('./teacher-classes-component/teacher-classes/teacher-classes').then(m => m.TeacherClasses) },
			{ path: 'yoga-class-details/:classID', loadComponent: () => import('./shared/yoga-class-details-component/yoga-class-details/yoga-class-details').then(m => m.YogaClassDetails) },
			{ path: 'yoga-class-details', loadComponent: () => import('./shared/yoga-class-details-component/yoga-class-details/yoga-class-details').then(m => m.YogaClassDetails) },
			{ path: 'teacher-home-page/:teacherId', loadComponent: () => import('./teacher-home-page-component/teacher-home-page/teacher-home-page').then(m => m.TeacherHomePage) },
			{ path: 'event-component', loadComponent: () => import('./shared/event-component/event-component/event-component').then(m => m.EventComponent) }
		]
	},
	{
		path: 'admin-dashboard',
		canActivate: [authGuard],
		loadComponent: () => import('./admin-dashboard-component/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
		children: [
			{ path: '', pathMatch: 'full', loadComponent: () => import('./admin-home-page-component/admin-home-page/admin-home-page').then(m => m.AdminHomePage) },
			{ path: 'teachers', loadComponent: () => import('./teachers-component/teachers/teachers').then(m => m.TeachersComponent) },
			{ path: 'teacher-profile/:teacherId', loadComponent: () => import('./teacher-profile-component/teacher-profile/teacher-profile').then(m => m.TeacherProfile) },
			{ path: 'teacher-profile', loadComponent: () => import('./teacher-profile-component/teacher-profile/teacher-profile').then(m => m.TeacherProfile) },
			{ path: 'videos', loadComponent: () => import('./videos-component/videos/videos').then(m => m.Videos) },
			{ path: 'yoga-class-details/:classID', loadComponent: () => import('./shared/yoga-class-details-component/yoga-class-details/yoga-class-details').then(m => m.YogaClassDetails) },
			{ path: 'letters', loadComponent: () => import('./Letters-component/letters/letters').then(m => m.Letters) },
			{ path: 'emails', loadComponent: () => import('./Emails-component/emails/emails').then(m => m.Emails) },
			{ path: 'letter', loadComponent: () => import('./Letter-component/letter/letter').then(m => m.Letter) },
			{ path: 'letter/:letterID', loadComponent: () => import('./Letter-component/letter/letter').then(m => m.Letter) },
			{ path: 'email', loadComponent: () => import('./Email-component/email/email').then(m => m.Email) },
			{ path: 'email/:emailID', loadComponent: () => import('./Email-component/email/email').then(m => m.Email) },
		]
	}
];
