import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RefPhysModel } from '../_models/RefPhysModel';
import { RefPhysService } from '../_services/ref-phys.service';

@Injectable()

export class RefPyhsResolver implements Resolve<RefPhysModel> {
    constructor(private refservice: RefPhysService,
        private router: Router,
        private alertify: AlertifyService) {
    }
    resolve(route: ActivatedRouteSnapshot): Observable<RefPhysModel> {
        return this.refservice.getSpecificRefPhys(route.params['id']).pipe(catchError(error => {
            this.alertify.error('Problem retrieving data');
            this.router.navigate(['/home']);
            return of(null);
        }));
    }
}
