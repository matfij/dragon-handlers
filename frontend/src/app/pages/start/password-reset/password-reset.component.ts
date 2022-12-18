import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthController, PasswordResetDto } from 'src/app/client/api';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from 'src/app/client/config/frontend.config';
import { ToastService } from 'src/app/common/services/toast.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetComponent implements OnInit {

  actionCode: string = '';
  newPassword = new FormControl(null, [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH), Validators.maxLength(PASSWORD_MAX_LENGTH)]);
  newPasswordConfirm = new FormControl(null, [Validators.required]);
  resetPasswordLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authController: AuthController,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.actionCode = params['token'];
    })
  }

  resetPassword() {
    if (!this.newPassword.valid || !this.newPasswordConfirm.valid) return;
    if (this.newPassword.value !== this.newPasswordConfirm.value) { this.toastService.showError('errors.error', 'start.passwordsMismatch'); return; }

    const params: PasswordResetDto = {
      actionToken: this.actionCode,
      newPassword: this.newPassword.value,
    };
    this.resetPasswordLoading$.next(true);
    this.authController.resetPassword(params).subscribe(() => {
      this.toastService.showSuccess('common.success', 'start.passwordResetSuccess');
      this.router.navigate(['login']);
    }, () => this.resetPasswordLoading$.next(false));
  }


}
