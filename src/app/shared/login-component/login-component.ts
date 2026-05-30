import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-login-component',
    imports: [],
    templateUrl: './login-component.html',
    styleUrl: './login-component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
    readonly isOpen = input(false);
    readonly closed = output<void>();

    private authService = inject(AuthService);
    private router = inject(Router);

    protected readonly email = signal('');
    protected readonly password = signal('');
    protected readonly errorMessage = signal('');
    protected readonly isSubmitting = signal(false);

    protected close(): void {
        this.errorMessage.set('');
        this.password.set('');
        this.closed.emit();
    }

    protected onEmailInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.email.set(value.trim());
    }

    protected onPasswordInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.password.set(value);
    }

    protected async login(): Promise<void> {
        console.log('log in' )
        if (this.isSubmitting()) {
            return;
        }

        if (!this.email() || !this.password()) {
            this.errorMessage.set('Please enter email and password.');
            return;
        }

        this.errorMessage.set('');
        this.isSubmitting.set(true);

        try {
            const credential = await this.authService.login(this.email(), this.password());

            const uid = credential.user.uid;
            const profile = await firstValueFrom(this.authService.getUserProfile(uid));

            if (this.isAdminProfile(profile)) {


                await this.router.navigate(['/admin-dashboard']);
            }
            else {

                await this.router.navigate(['/teacher-dashboard']);
            }
        }
        catch (error) {
            this.errorMessage.set(this.getLoginErrorMessage(error));
        } finally {
            this.isSubmitting.set(false);
        }
    }

    private isAdminProfile(profile: unknown): boolean {
        if (!profile || typeof profile !== 'object') {
            return false;
        }

        const roles = (profile as Record<string, unknown>)['role'];
        if (!roles || typeof roles !== 'object') {
            return false;
        }

        return Boolean((roles as Record<string, unknown>)['admin']);
    }

    private getLoginErrorMessage(error: unknown): string {
        if (this.isFirebaseAuthError(error)) {
            switch (error.code) {
                case 'auth/invalid-credential':
                    return 'Invalid email or password.';
                case 'auth/user-disabled':
                    return 'This account has been disabled.';
                case 'auth/too-many-requests':
                    return 'Too many attempts. Please try again later.';
                case 'auth/network-request-failed':
                    return 'Network error. Check your internet and try again.';
                default:
                    return 'Unable to sign in right now. Please try again.';
            }
        }

        return 'Unable to sign in right now. Please try again.';
    }

    private isFirebaseAuthError(error: unknown): error is { code: string } {
        return typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code: unknown }).code === 'string';
    }
}
