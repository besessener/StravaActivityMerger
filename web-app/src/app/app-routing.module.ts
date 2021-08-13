import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {ActivityTableComponent} from "./components/activity-table/activity-table.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '**', component: ActivityTableComponent},
  {path: 'activities', component: ActivityTableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
