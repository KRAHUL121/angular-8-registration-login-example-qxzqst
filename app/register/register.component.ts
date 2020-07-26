import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { AlertService, UserService, AuthenticationService } from "../_services";

@Component({ templateUrl: "register.component.html" })
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        username: ["", Validators.required],
        email: ["", [Validators.required,Validators.pattern('^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
        confirmpassword: ["", [Validators.required, Validators.minLength(6)]],
        password: ["", [Validators.required, Validators.minLength(6)]]
      },
      {
        validators: this.password.bind(this)
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  isConfirmPassword: boolean = false;
  changePassword() {
    this.isConfirmPassword = false;
    console.log( this.registerForm.get("password").value !=
      this.registerForm.get("confirmpassword").value)
    if (
      this.registerForm.get("password").value !=
      this.registerForm.get("confirmpassword").value
    ) {
      this.isConfirmPassword = true;
    }
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService
      .register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Registration successful", true);
          this.router.navigate(["/login"]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get("password");
    const { value: confirmPassword } = formGroup.get("confirmpassword");
    console.log(password, "", confirmPassword);
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
}
