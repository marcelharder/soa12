import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from '../../_models/User';
import { Router } from '@angular/router';
import { DropdownService } from '../../_services/dropdown.service';
import { dropItem } from '../../_models/dropItem';
import { AuthService } from 'src/app/_services/auth.service';
import { HospitalService } from 'src/app/_services/hospital.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import * as _ from 'underscore';
import { OviUpdate } from 'src/app/_models/OviUpdate';

@Component({
    selector: 'app-worked-in',
    templateUrl: './worked-in.component.html',
    styleUrls: ['./worked-in.component.scss']
})

export class WorkedInComponent implements OnInit {
    @Input() user: User;
    @Output() updateUserToParent = new EventEmitter<User>();
    selectedHospital = 0;

    selectedCountry = 0;
    currentUserId = 0;
    currentHospital = 0;
    OptionActiveHospitals: Array<dropItem> = [];
    OptionCountries: Array<dropItem> = [];
    OptionHospitals: Array<dropItem> = [];
    OviUpdate: OviUpdate = { name: '', role: '', gender: '', email: '' }

    constructor(
        private drop: DropdownService,
        private alertify: AlertifyService,
        private hos: HospitalService,
        private Auth: AuthService,
        private router: Router) { }

    ngOnInit(): void {
        this.drop.getHospitals(+this.user.Id).subscribe(response => {
            this.OptionActiveHospitals = response;
        }, (error) => { console.log(error); });
        // get all countries
        this.drop.getAllCountries().subscribe((next) => {
            this.OptionCountries = next;
            this.selectedCountry = parseInt(this.user.country, 10);
            // get all hospitals per country
            this.drop.getAllHospitalsPerCountry(this.selectedCountry).subscribe((nex) => {
                this.OptionHospitals = nex;
            });
        });
        this.currentHospital = this.user.hospital_id;
    }
    changeCurrentHospital() {
        if (this.currentHospital !== 0) {
            this.hos.getSpecificHospital(this.currentHospital).subscribe(
                (response) => {
                    this.Auth.changeCurrentHospital(response.hospitalName);
                });
            this.user.hospital_id = this.currentHospital; // change the current hospital of the current user
            // update the changed hospital for this user to the valve database application too
            this.OviUpdate.name = this.user.UserName;
            this.OviUpdate.role = this.user.role;
            this.OviUpdate.gender = this.user.gender;
            this.OviUpdate.email = this.user.email;

            

            // send the changed user up to the parent
            this.updateUserToParent.emit(this.user);
        }
    }
    changeCountry() {
        this.drop.getAllHospitalsPerCountry(this.selectedCountry).subscribe(
            (next) => {
                this.OptionHospitals = next;
                this.selectedHospital = this.OptionHospitals[0].value;
            });
    }

    addToListOfHospitals() {
        const a: Array<number> = [];
        this.hos.getSpecificHospital(this.selectedHospital).subscribe((res) => {
            const help: dropItem = { value: +res.hospitalNo, description: res.hospitalName }
            if (!this.OptionActiveHospitals.find(e => e.value === +res.hospitalNo)) {
                this.OptionActiveHospitals.push(help);
                for (const row of this.OptionActiveHospitals) { a.push(row.value); }
                this.user.worked_in = a.join(',');
            }
        });
    }
    removeCurrentHospital() {
        const a: Array<number> = [];
        const index = this.OptionActiveHospitals.findIndex(x => x.value === +this.currentHospital); // find index in your array
        this.OptionActiveHospitals.splice(index, 1);// remove element from array
        for (const row of this.OptionActiveHospitals) { a.push(row.value); }
        this.user.worked_in = a.join(',');
    }
}
