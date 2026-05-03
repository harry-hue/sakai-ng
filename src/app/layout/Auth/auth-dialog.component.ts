import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '@/AuthService/AuthService';

@Component({
    selector: 'app-auth-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule, PasswordModule, ButtonModule],
    templateUrl: './auth-dialog.component.html',
    styleUrl: './auth-dialog.component.scss'
})
export class AuthDialogComponent {
    private readonly formBuilder = inject(FormBuilder);

    readonly passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;

        if (!password || !confirmPassword) {
            return null;
        }

        return password === confirmPassword ? null : { passwordMismatch: true };
    };

    showAuthDialog = true;
    showRegisterForm = false;
    submittedLogin = false;
    submittedRegister = false;
    loadingSignup = false;
    loadingLogin = false;
    fieldBlurred: Record<string, boolean> = {};

    readonly registerForm = this.formBuilder.group(
        {
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        },
        { validators: this.passwordMatchValidator }
    );

    readonly loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    constructor(
        private readonly router: Router,
        public _AuthService: AuthService
    ) {}

    RegisterSubmit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.reset();
            return;
        }

        const model = {
            userName: this.registerForm.value.username,
            password: this.registerForm.value.password
        };

        this.loadingSignup = true;
        this._AuthService.Register(model).subscribe({
            next: (res: any) => {
                console.log('Signup API response:', res);
                this.showRegisterForm = false;
                  this.submittedLogin = true;
              
            },
               error: (err) => {
      alert(err.error.message); // ❌ error message show
    }
        });
    }

    goToSignup(): void {
        this.showRegisterForm = true;
        this.submittedLogin = false;
    }
    goToLogin():void {
           this.showRegisterForm = false;
        this.submittedLogin = true;
    }

    markFieldBlurred(fieldName: string): void {
        this.fieldBlurred[fieldName] = true;
    }

    submitLogin(): void {
        if (this.loginForm.invalid) {
            return;
        }

        const model = {
            userName: this.loginForm.value.username,
            password: this.loginForm.value.password
        };
        this._AuthService.login(model).subscribe({
            next: (res: any) => {
                console.log('Login API response:', res);
                this.submittedLogin = false;
                    // 1️⃣ Store token (IMPORTANT)
    localStorage.setItem('token', res.data.token);

    // 2️⃣ Show message first
    alert(res.message);
                this.router.navigate(['/dashboard']);
                alert(res.message)
            },
            error: (err) => {
                alert(err?.error?.message ?? 'Login failed');
            }
        });
    }

    
}
