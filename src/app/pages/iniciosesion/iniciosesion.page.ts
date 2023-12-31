import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './iniciosesion.page.html',
  styleUrls: ['./iniciosesion.page.scss'],
})
export class IniciosesionPage implements OnInit {

  userdata: any;

  usuario = {
    id: 0,
    username: "",
    password: "",
    role: "",
    isactive: true
  }

  loginForm: FormGroup;

  constructor(private authservice: AuthService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private builder: FormBuilder) {
    this.loginForm = this.builder.group({
      'username': new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      'password': new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(10)])
    });
  }

  ngOnInit() {
  }

  Iniciosesion() {
    if (this.loginForm.valid) {
      this.authservice.GetUserById(this.loginForm.value.username).subscribe(resp => {
        this.userdata = resp;
        console.log(this.userdata)
        if (this.userdata.length > 0) {
          this.usuario = {
            id: this.userdata[0].id,
            username: this.userdata[0].username,
            password: this.userdata[0].password,
            role: this.userdata[0].role,
            isactive: this.userdata[0].isactive
          }
          console.log(resp);
          console.log(this.usuario.password);
          if (this.usuario.password === this.loginForm.value.password) {
            if (this.usuario.isactive) {
              sessionStorage.setItem('username', this.usuario.username);
              sessionStorage.setItem('userrole', this.usuario.role);
              sessionStorage.setItem('ingresado', 'true');
              this.showToast('Sesión Iniciada');
              this.router.navigate(['/inicio']);
            } else {
              this.UserInactivo();
              console.log("Usuario inactivo, contacte a admin@app.cl");
            }
          } else {
            this.Error();
            console.log("error en credenciales");
          }
        } else {
          this.loginForm.reset();
          this.NoExiste();
        }
      })
    }
  }

  async showToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  async UserInactivo() {
    const alerta = await this.alertController.create({
      header: 'Usuario Inactivo',
      message: 'Debe contactarse con admin@admin.cl',
      buttons: ['Ok']
    })
    await alerta.present();
  }

  async Error() {
    const alerta = await this.alertController.create({
      header: 'Error..',
      message: 'Revise sus credenciales',
      buttons: ['Ok']
    })
    await alerta.present();
  }

  async NoExiste() {
    const alerta = await this.alertController.create({
      header: 'Error..',
      message: 'Usuario no existe, debe registrarse',
      buttons: ['Ok']
    })
    await alerta.present();
  }
}
