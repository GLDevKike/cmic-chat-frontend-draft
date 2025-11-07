import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  providers: [provideHttpClient()],
  imports: [],
})
export class CoreModule {}
